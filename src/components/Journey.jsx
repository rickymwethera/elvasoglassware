import { A } from "../utils";
import { Recycle, Scissors, Sparkles, Wine, Utensils } from "lucide-react";

// Steps shown in the Journey section: [icon, title, description].
const journey = [
  [
    Wine,
    "Collected",
    "Empty bottles from bars, restaurants and members of the public.",
  ],
  [Scissors, "Cut", "Each bottle is cut by machine in our Nairobi workshop."],
  [
    Sparkles,
    "Finished",
    "Edges are smoothed so every piece is safe and ready to use.",
  ],
  [Utensils, "On your table", "A one-of-a-kind piece, made for everyday use."],
  [
    Recycle,
    "Nothing wasted",
    "Offcuts are crushed for reuse, with glass terrazzo coming next.",
  ],
];
// The numbered steps showing how a bottle becomes a finished piece.
export default function Journey() {
  return (
    <section className="section journey">
      <div className="container">
        <div className="eyebrow">THE JOURNEY OF A BOTTLE</div>
        <h2>From bottle to finished piece</h2>
        <ol className="journey-steps">
          {journey.map(([Icon, title, desc], i) => (
            <li key={title}>
              <span className="journey-icon">
                <Icon size={26} />
              </span>
              <small>0{i + 1}</small>
              <h3>{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
        <div className="journey-photo">
          <figure>
            <img
              src={A + "bottle-sacks.webp"}
              alt="Sacks of collected bottles delivered to the El Vaso workshop"
              loading="lazy"
            />
            <figcaption>Delivered in bulk</figcaption>
          </figure>
          <figure>
            <img
              src={A + "workshop-racks.webp"}
              alt="Collected bottles sorted by colour on racks above the El Vaso cutting machine, with freshly cut green glasses"
              loading="lazy"
            />
            <figcaption>Sorted, then cut</figcaption>
          </figure>
          <div>
            <h3>Inside our workshop</h3>
            <p>
              Bottles arrive at our workshop in sacks from bars, restaurants
              and members of the public. We sort them by colour on these racks,
              then cut them on the machine below. The green glasses on the
              bench started out as bottles just like these.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
