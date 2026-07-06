export function getPriceValue(price) {
  if (typeof price === "number") {
    // Backend prices are integer cents; convert to dollars.
    return price / 100;
  }

  if (typeof price === "string") {
    const normalized = price.replace(/[^0-9.]/g, "");
    return Number(normalized) || 0;
  }

  return 0;
}
