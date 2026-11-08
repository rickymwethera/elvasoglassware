import { A } from "../utils";

// Photos showing how a bottle becomes a finished piece: [image, label, alt].
const steps = [
  [
    "bottle-sacks.webp",
    "Delivered in bulk",
    "Sacks of collected bottles delivered to the El Vaso workshop",
  ],
  [
    "workshop-racks.webp",
    "Sorted, then cut",
    "Collected bottles sorted by colour on racks above the El Vaso cutting machine",
  ],
  [
    "finished-glasses.webp",
    "Ready for your table",
    "Finished green glasses made from bottles, in woven baskets",
  ],
];
// The bottle's journey, told in photos from the El Vaso workshop.
export default function Journey() {
  return (
    <section className="section journey">
      <div className="container">
        <div className="eyebrow">THE JOURNEY OF A BOTTLE</div>
        <h2>From bottle to finished piece</h2>
        <div className="journey-photos">
          {steps.map(([image, label, alt], i) => (
            <figure key={label}>
              <img src={A + image} alt={alt} loading="lazy" />
              <figcaption>
                <small>0{i + 1}</small> {label}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="journey-text">
          Bottles arrive at our workshop in sacks from bars, restaurants and
          members of the public. We sort them by colour, then cut them on our
          machine. Every edge is smoothed, and each bottle becomes a glass, vase
          or jar ready for everyday use.
        </p>
      </div>
    </section>
  );
}
