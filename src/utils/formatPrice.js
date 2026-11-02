// Indian short-form price formatter: 200000 → "₹2 Lakh", 250000 → "₹2.5 Lakh",
// 20000000 → "₹2 Cr", 50000 → "₹50,000".

export function formatPrice(value) {
  if (value == null || value === "") return "Price on Request";
  const raw = String(value).trim();
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return raw;
  if (n >= 10000000) return `₹${parseFloat((n / 10000000).toFixed(2))} Cr`;
  if (n >= 100000) return `₹${parseFloat((n / 100000).toFixed(2))} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default formatPrice;
