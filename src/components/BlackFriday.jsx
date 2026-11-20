import { Tag } from "lucide-react";
import { money, priceLabel } from "../data";

// Black Friday offer: 20% off every product from 20 to 30 November 2026
// (Nairobi time). Outside these dates the site shows normal prices and no
// banner, so nothing needs changing when the offer ends.
const SALE_START = new Date("2026-11-20T00:00:00+03:00");
const SALE_END = new Date("2026-12-01T00:00:00+03:00");
const DISCOUNT = 0.2;

export const saleActive = () => {
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

// "-20%" tag on the corner of a product photo.
export function SaleBadge() {
  if (!saleActive()) return null;
  return <span className="bf-badge">−20%</span>;
}

// Thin black announcement bar shown above the header on every page.
export function TopBar() {
  if (!saleActive()) return null;
  return (
    <div className="bf-topbar">
      <Tag size={15} aria-hidden="true" /> <strong>BLACK FRIDAY</strong>
      <span>20% off everything · 20 to 30 November</span>
    </div>
  );
}
