import { Instagram, Linkedin, Phone, MapPin, Clock } from "lucide-react";
import { categories, instagramUrl, tiktokUrl, linkedinUrl, mapUrl, phoneNumber, phoneDisplay } from "../data";
import { useApp } from "../AppContext";
import TikTokIcon from "./TikTokIcon";

// Site footer with navigation links, categories and contact details.
export default function Footer() {
  const { go, shop } = useApp();
  return (
    <footer className="footer">
      <div className="container footer-columns">
        <div className="footer-brand">
          <button className="wordmark" onClick={() => go("/")}>
            <img
              className="wordmark-text"
              src={import.meta.env.BASE_URL + "images/logo-wordmark-white.png"}
              alt="El Vaso"
            />
          </button>
          <p>
            Old bottles, new stories. Thoughtfully upcycled glassware,
            handmade in Kenya.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <button onClick={() => shop()}>Our collection</button>
          <button onClick={() => go("/about")}>About</button>
          <button onClick={() => go("/our-story")}>Our story</button>
          <button onClick={() => go("/sustainability")}>Sustainability</button>
          <button onClick={() => go("/custom-orders")}>Custom orders</button>
          <button onClick={() => go("/contact")}>Contact</button>
        </div>
        <div>
          <h4>Categories</h4>
          {categories.map((c) => (
            <button key={c.id} onClick={() => shop(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href={"tel:" + phoneNumber}>
            <Phone size={15} /> {phoneDisplay}
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <Instagram size={15} /> @elvaso_glassware
          </a>
          <a href={tiktokUrl} target="_blank" rel="noreferrer">
            <TikTokIcon size={15} /> @el.vaso.glassware
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">
            <Linkedin size={15} /> El Vaso Glassware
          </a>
          <a href={mapUrl} target="_blank" rel="noreferrer">
            <MapPin size={15} /> Langata Hospital Complex, Nairobi
          </a>
          <span>
            <Clock size={15} /> Mon to Sat, 8 AM to 7 PM
          </span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} El Vaso Glassware. All rights reserved.
        </span>
        <span>Handmade in Nairobi, Kenya</span>
      </div>
    </footer>
  );
}
