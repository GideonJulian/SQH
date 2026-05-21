"use client";

import { useEffect, useState } from "react";

export function useAppLoading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = Array.from(document.images);

    const waitForImages = Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve);
        });
      })
    );

    // minimum delay so it doesn't flash
    const minDelay = new Promise((r) => setTimeout(r, 800));

    Promise.all([waitForImages, minDelay]).then(() => {
      setLoading(false);
    });
  }, []);

  return loading;
}