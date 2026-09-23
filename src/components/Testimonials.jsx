import { useRef } from "react";
import ShapeCard from "./utils/ShapedBg";
import test1 from "../assets/home/testimonials/test1.mp4"
import test2 from "../assets/home/testimonials/test2.mp4"

const DEFAULT_ITEMS = [
  {
    videoSrc: test1,
    poster: "",
    tags: ["Family", "Fitness"],
    title:
     "“Finally, a fitness program that works for our \nwhole family.”",
    brand: "Member Since 2025",
    href: "#",
  },
  
  {
    videoSrc: test2,
    poster: "",
    tags: ["Community", "Lifestyle"],
    title:
      "“These workouts fit perfectly into my\n busy schedule.”",
    brand: "Member Since 2026",
    href: "#",
  },
];

function VideoCard({ item }) {
  const videoRef = useRef(null);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
  };

  const [heading, secondLine] = item.title.split("\n");

  return (
    <div
      className="group relative aspect-3/4 w-full overflow-hidden rounded-[28px] bg-text shadow-[0_25px_60px_-25px_rgba(22,22,22,0.5)]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* video / poster */}
      {item.videoSrc ? (
        <video
          ref={videoRef}
          src={item.videoSrc}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : item.poster ? (
        <img
          src={item.poster}
          alt={item.title.replace("\n", " ")}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-text via-neutral-800 to-neutral-900" />
      )}

      {/* darken slightly for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10" />

      {/* top-left tag pills */}
      <div className="absolute left-4 top-4 flex gap-2 sm:left-5 sm:top-5">
        {item.tags.map((tag, i) => (
          <span
            key={tag + i}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              i === 0 ? "bg-primary-pink text-text" : "bg-primary-white text-text"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* bottom text panel — shared ShapeCard, white background */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <ShapeCard
          title={heading}
          secondLine={secondLine}
          buttonText={item.brand}
          bgColor="#FFFFFF"
          buttonColor="var(--color-text, #171717)"
          textColor="#171717"
          onArrowClick={() => {
            if (item.href) window.location.href = item.href;
          }}
        />
      </div>
    </div>
  );
}

export default function WorkResults({
  items = DEFAULT_ITEMS,
  heading = "What Families\nAre Saying.",
}) {
  return (
    <section className="bg-bg px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
          <h2 className="whitespace-pre-line text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-[5.95rem]">
          {heading}
        </h2>
      <div className="mx-auto max-w-4xl">
        {/* heading */}
      

        {/* cards */}
        <div className="mt-16 grid grid-cols-2 gap-5 sm:mt-24 sm:gap-8 lg:gap-16">
          {items.map((item, i) => (
            <div
              key={i}
              className={`mx-auto w-full max-w-[300px] sm:max-w-[500px] ${
                i % 2 === 0
                  ? "sm:-translate-y-6 lg:-translate-y-10"
                  : "sm:translate-y-6 lg:translate-y-10"
              }`}
            >
              <VideoCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}