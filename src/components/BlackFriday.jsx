import { Tag } from "lucide-react";
import { money, priceLabel } from "../data";
import sale from "../content/sale.json";

// The current offer (e.g. Black Friday), set in src/content/sale.json and
// editable at /admin. It runs from the start date to the end of the end date,
// Nairobi time. Outside those dates, or when switched off, the site shows
// normal prices and no banner, so nothing needs changing when an offer ends.
const DAY = 24 * 60 * 60 * 1000;
const nairobiMidnight = (date) => new Date(`${date}T00:00:00+03:00`);
const SALE_START = sale.start && nairobiMidnight(sale.start);
const SALE_END = sale.end && new Date(nairobiMidnight(sale.end).getTime() + DAY);
const PERCENT = Math.min(Math.max(Number(sale.discount) || 0, 0), 90);
const DISCOUNT = PERCENT / 100;

export const saleActive = () => {
  if (!sale.enabled || !SALE_START || !SALE_END || !PERCENT) return false;
  const now = new Date();
  return now >= SALE_START && now < SALE_END;
};

// The offer price, rounded to the nearest 10 shillings.
export const salePrice = (p) =>
  saleActive() ? Math.round((p.price * (1 - DISCOUNT)) / 10) * 10 : p.price;

// Price label with the offer applied, e.g. "From KES 840".
export const currentPriceLabel = (p) =>
  saleActive() ? (p.priceFrom ? "From " : "") + money(salePrice(p)) : priceLabel(p);

// Shows the offer price with the original price crossed out.
export function SalePrice({ p, detail }) {
  if (!saleActive()) return <strong>{priceLabel(p)}</strong>;
  return (
    <span className={"bf-price" + (detail ? " bf-price-detail" : "")}>
      <strong>{currentPriceLabel(p)}</strong>
      <s aria-label={"Was " + money(p.price)}>{money(p.price)}</s>
    </span>
  );
}

// "−20%"-style tag on the corner of a product photo.
export function SaleBadge() {
  if (!saleActive()) return null;
  return <span className="bf-badge">−{PERCENT}%</span>;
}

// Thin black announcement bar shown above the header on every page.
export function TopBar() {
  if (!saleActive()) return null;
  return (
    <div className="bf-topbar">
      <Tag size={15} aria-hidden="true" /> <strong>{sale.label}</strong>
      {sale.message && <span>{sale.message}</span>}
    </div>
  );
}
