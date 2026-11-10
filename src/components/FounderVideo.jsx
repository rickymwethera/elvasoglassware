import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { A, BASE } from "../utils";

// Interview with our CEO, filmed by GrowthAfrica. preload="none" means the
// video file is only downloaded once a visitor presses play, so it does not
// slow the page down.
export default function FounderVideo() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    setPlaying(true);
    video.current.play();
  };
  return (
    <section className="section info-band founder-video">
      <div className="container">
        <div className="eyebrow">HEAR IT FROM OUR CEO</div>
        <h2>
          Circularity through <em>a glass lens.</em>
        </h2>
        <figure>
          <div className="video-frame">
            <video
              ref={video}
              preload="none"
              playsInline
              controls={playing}
              width="1280"
              height="720"
              poster={A + "founder-video-poster.webp"}
            >
              <source src={BASE + "/videos/founder-interview.mp4"} type="video/mp4" />
            </video>
            {!playing && (
              <button
                className="video-play"
                onClick={play}
                aria-label="Play the interview with Judith Ririani, CEO of El Vaso Glassware (4 min 52 s)"
              >
                <span className="video-play-icon"><Play size={26} fill="currentColor" /></span>
                <span className="video-play-label">Watch the story <small>4:52</small></span>
              </button>
            )}
          </div>
          <figcaption>
            Judith Ririani, CEO of El Vaso Glassware, on turning waste glass
            into a business. Video by GrowthAfrica, funded by the Embassy of
            Finland, Nairobi.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
