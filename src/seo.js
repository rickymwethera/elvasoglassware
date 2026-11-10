// Title and description for each page. Used in the browser at runtime (App.jsx)
// and at build time by scripts/prerender.mjs, which writes a real HTML file per
// page so Google gets the right title, description and a 200 status for each.
// Keep this file free of Vite-only code such as import.meta.
export const SITE_URL = "https://www.elvasoglassware.com";
export const SITE_NAME = "El Vaso Glassware";

export const pages = {
  "/": {
    title: "El Vaso Glassware | Upcycled glassware handmade in Nairobi",
    description:
      "El Vaso turns discarded glass bottles into handmade glasses, vases, jars and planters in Nairobi, Kenya. Upcycled glassware, custom orders and workshops.",
  },
  "/products": {
    title: "Our collection | El Vaso Glassware",
    description:
      "Upcycled drinking glasses, vases, storage jars, planters and gift sets, each cut by hand from a discarded bottle in Nairobi.",
  },
  "/custom-orders": {
    title: "Custom orders and engraving | El Vaso Glassware",
    description:
      "Branded, engraved and etched upcycled glassware for events, hotels, restaurants and corporate gifts. Made to order by El Vaso in Nairobi.",
  },
  "/our-story": {
    title: "Our story | El Vaso Glassware",
    description:
      "How El Vaso started turning Nairobi's discarded glass bottles into handmade glassware, and the people who make it.",
  },
  "/about": {
    title: "About El Vaso | Upcycled glassware in Kenya",
    description:
      "El Vaso's vision, mission and the customers we serve: homes, hospitality, events and businesses across Kenya.",
  },
  "/sustainability": {
    title: "Sustainability | El Vaso Glassware",
    description:
      "The journey of a bottle at El Vaso: collected, sorted, cut and finished by hand, keeping glass out of Nairobi's landfills.",
  },
  "/contact": {
    title: "Contact El Vaso | Langata workshop, Nairobi",
    description:
      "Visit the El Vaso workshop at Langata Hospital Complex, Nairobi, or reach us on WhatsApp, phone, Instagram and TikTok.",
  },
};
