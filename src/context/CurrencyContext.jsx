"use client";
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const CurrencyContext = createContext(null);

const CURRENCY_STORAGE_KEY = "sqh_currency";

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(CURRENCY_STORAGE_KEY) || "NGN";
  });
  const [ngnPerUsd, setNgnPerUsd] = useState(null);

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    let cancelled = false;

    async function loadRate() {
      try {
        const response = await api.get("/fx-rate");
        if (!cancelled) {
          setNgnPerUsd(response.data.ngnPerUsd);
        }
      } catch {
        // Rate stays null; consumers fall back to NGN-only display.
      }
    }

    loadRate();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, ngnPerUsd }),
    [currency, ngnPerUsd],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}
