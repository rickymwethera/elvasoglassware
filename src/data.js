// Site content. Products, categories, contact details and the sale live as
// JSON files in src/content/ so staff can edit them at /admin (Decap CMS).
// This file turns those files into the values the rest of the site imports.
import settings from "./content/settings.json";
import categoryFile from "./content/categories.json";

// Content files store image paths from the site root, e.g. "/images/x.webp".
// Prefix them with the base path the site is built for.
const asset = (path) =>
  path ? import.meta.env.BASE_URL + String(path).replace(/^\//, "") : "";

// Product categories shown on the home page, collection tabs and footer.
// `id` must match the `category` field of the products below.
export const categories = categoryFile.categories.map((c) => ({
  ...c,
  image: asset(c.image),
}));

// One JSON file per product in src/content/products/. The file name is the
// product's id and its address on the site, e.g. /products/glass-set.
// Hidden products are left out; the rest are sorted by `order`, then name.
const productFiles = import.meta.glob("./content/products/*.json", {
  eager: true,
  import: "default",
});
export const products = Object.entries(productFiles)
  .map(([file, p]) => ({
    ...p,
    id: file.split("/").pop().replace(/\.json$/, ""),
    price: Number(p.price) || 0,
    priceFrom: !!p.priceFrom,
    image: asset(p.image),
  }))
  .filter((p) => !p.hidden)
  .sort(
    (a, b) =>
      (a.order ?? 1e9) - (b.order ?? 1e9) || a.name.localeCompare(b.name)
  );

// Formats a number as Kenyan shillings, e.g. 1500 -> "KES 1,500".
export const money = (n) => `KES ${Number(n).toLocaleString("en-KE")}`;
// A product's price as shown to visitors, e.g. "From KES 550".
export const priceLabel = (p) => (p.priceFrom ? "From " : "") + money(p.price);

// Contact details, links and the shop switch, from src/content/settings.json.
// whatsappNumber is in international format without the "+".
export const {
  whatsappNumber,
  phoneNumber,
  phoneDisplay,
  openingHours,
  mapUrl,
  instagramUrl,
  tiktokUrl,
  linkedinUrl,
  pressUrl,
} = settings;
// When true, brings back the cart, search, sorting/price filters and
// add-to-cart buttons. Prices show either way.
export const shopEnabled = !!settings.shopEnabled;
