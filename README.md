# El Vaso Glassware — Website

Responsive, slightly minimalist redesign based on the approved green + terracotta concept mockups. Built with **React, Vite, CSS, lucide-react**.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Open this folder in VS Code / Terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit the localhost address shown by Vite (usually http://localhost:5173).

The site is hosted on Cloudflare Pages at https://www.elvasoglassware.com/ (Cloudflare project `elvasoglassware`, in the ELVASO account). Every merge to `main` deploys automatically, and every other branch gets its own preview link.

- Build command: `npm run build:cloudflare`, output folder `dist`. Node version comes from `.nvmrc`.
- Unknown paths such as `/products/<slug>` fall back to the app automatically, so no 404.html is needed.
- `functions/videos/[[path]].js` lets visitors skip through videos. Cloudflare Pages doesn't do that for static files on its own.
- The bare domain elvasoglassware.com redirects to www with a Cloudflare Redirect Rule.

## Pages

- `/` — home
- `/products` — collection with filters and sorting
- `/products/olive-green-tumbler` (and other product slugs) — product details
- `/custom-orders` — custom enquiry form that opens WhatsApp with a prefilled message
- `/our-story` — brand story
- `/about` — vision, mission, objectives, why El Vaso, who we serve
- `/sustainability` — impact and the journey of a bottle
- `/contact` — contact details and a WhatsApp message form

## Shop mode

The site currently focuses on introducing the brand, so all shopping features are switched off with `shopEnabled = false` in `src/data.js`. That hides prices, the cart, search, price sorting/filters and add-to-cart buttons; product pages offer a WhatsApp enquiry instead. Set it to `true` to bring the shop back.

## Before going live

- **All product names, prices, dimensions, stock and delivery claims are demo placeholders.** Confirm your real catalogue and policies with El Vaso.
- Photos in `public/images` are El Vaso's own, chosen from the shared Google Drive folder and resized to WebP (max 1400px).
- Replace the WhatsApp number in `src/data.js` if needed; currently it uses the number listed on the reference site.
- Checkout is intentionally a WhatsApp enquiry flow, _not_ a payment system. The cart is client-side memory only; it does not persist after refresh.
- The custom order form has no server or database; submitting it opens WhatsApp with an editable message. No files are uploaded or stored.
- Product reviews, verified stock, taxes and delivery estimates are intentionally omitted because they were not verifiable.
- If using a different branding domain, update title, favicon, metadata, and your deployment settings.

## Files

- `src/main.jsx`: components, pages, client-side routing and interactions
- `src/data.js`: catalogue/category seed data
- `src/styles.css`: global brand styling and responsive breakpoints
- `public/images/`: El Vaso product, workshop and showroom photos

This is a working front-end prototype/starter, not a production commerce backend.
