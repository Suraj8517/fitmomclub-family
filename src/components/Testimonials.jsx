import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShapeCard from "./utils/ShapedBg";
import test1 from "../assets/home/testimonials/test1.mp4";
import test2 from "../assets/home/testimonials/test2.mp4";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_ITEMS = [
  {
    videoSrc: test1,
    poster: "",
    tags: ["Family", "Fitness"],
    title:
      "“Finally, a fitness program that works for our whole family.”",
    brand: "Member Since 2025",
    href: "#",
  },

  {
    videoSrc: test2,
    poster: "",
    tags: ["Community", "Lifestyle"],
    title:
      "“These workouts fit perfectly into my busy schedule.”",
    brand: "Member Since 2026",
    href: "#",
  },
];

// True on devices with a mouse (desktop / laptop). Touch devices have no hover.
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function VideoCard({ item }) {
  const videoRef = useRef(null);

  // Desktop: play on hover, pause on leave.
  const handleEnter = () => {
    const v = videoRef.current;
    if (!v || !canHover()) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v || !canHover()) return;
    v.pause();
  };

  // Touch devices can't hover, so play the video while the card is mostly on screen
  // and pause it once it scrolls away (skipped if the person prefers reduced motion).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || canHover()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.6 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const [heading, secondLine] = item.title.split("\n");

  return (
    <div
      data-card
      className="group relative aspect-3/4 w-full overflow-hidden rounded-[24px] bg-text shadow-[0_25px_60px_-25px_rgba(22,22,22,0.5)] sm:rounded-[28px]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* video / poster */}
      {item.videoSrc ? (
        <video
          ref={videoRef}
          // #t=0.1 makes iOS Safari show a real first frame instead of a black box
          src={`${item.videoSrc}#t=0.1`}
          poster={item.poster || undefined}
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
      <div
        data-tags
        className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-5 sm:top-5 sm:gap-2"
      >
        {item.tags.map((tag, i) => (
          <span
            key={tag + i}
            className={`rounded-full px-3 py-1 text-xs font-medium sm:px-3.5 sm:py-1.5 sm:text-sm ${
              i === 0 ? "bg-primary-pink text-text" : "bg-primary-white text-text"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* bottom text panel — shared ShapeCard, white background */}
      <div data-panel className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
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
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* 1. Heading: rises in with a soft blur-to-sharp */
      gsap.fromTo(
        "[data-heading]",
        { y: 60, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-heading]",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 2. Cards: each reveals when it enters view.
            Only the inner card is animated; the wrapper keeps its
            Tailwind translate stagger untouched. */
      gsap.utils.toArray("[data-card]").forEach((card, i) => {
        const tags = card.querySelector("[data-tags]");
        const panel = card.querySelector("[data-panel]");
        const video = card.querySelector("video, img");

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          card,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, scale: 0.94 },
          {
            clipPath: "inset(-20% -20% -20% -20%)", // negative inset keeps the card shadow visible
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power4.out",
          }
        );

        if (tags) {
          tl.from(
            tags.children,
            { y: -14, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.5"
          );
        }
        if (panel) {
          tl.from(panel, { y: 40, opacity: 0, duration: 0.7 }, "-=0.55");
        }

        /* 3. Parallax on the media inside the card (alternates direction) */
        if (video) {
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.fromTo(
            video,
            { scale: 1.12, yPercent: -5 * dir },
            {
              yPercent: 5 * dir,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-bg px-5 py-14 sm:px-10 sm:py-28 lg:px-16"
    >
      {/* heading */}
      <h2
        data-heading
        className="whitespace-pre-line text-[12vw] font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-[5.95rem]"
      >
        {heading}
      </h2>

      <div className="mx-auto max-w-4xl">
        {/* cards: one column with a real gap on phones, two staggered columns from sm up */}
        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-24 sm:grid-cols-2 sm:gap-8 lg:gap-16">
          {items.map((item, i) => (
            <div
              key={i}
              className={`mx-auto w-full max-w-[340px] sm:max-w-[500px] ${
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