import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import vid1 from "../../src/assets/videos/video1.mp4";
import vid2 from "../../src/assets/videos/video2.mp4";

// rotate       -> tilt on sm and up (fanned deck)
// mobileRotate -> tilt on phones (only the first two cards are shown there)
const cards = [
  {
    type: "stat",
    bg: "bg-primary-blue",
    value: "10K+",
    label: "Happy Families",
    caption: "Stronger together",
    rotate: -8,
    mobileRotate: -8,
  },
  {
    type: "video",
    src: vid1,
    poster: "...",
    alt: "Family fitness",
    rotate: 9,
    mobileRotate: 2,
  },
  {
    type: "stat",
    bg: "bg-primary-green",
    value: "100+",
    label: "Workouts",
    caption: "Made for every body",
    rotate: -7,
    mobileRotate: 0,
  },
  {
    type: "video",
    src: vid2,
    poster: "...",
    alt: "Family staying active",
    overlay: "MOVE",
    rotate: 6,
    mobileRotate: 0,
  },
];

// Per-card vertical "lift" for the fanned deck on sm and up.
// Written as literal class strings so Tailwind's JIT scanner picks them up.
const LIFT_CLASSES = [
  "sm:mt-0",
  "sm:mt-10 md:mt-12 lg:mt-6",
  "sm:mt-8 md:mt-9 lg:mt-12",
  "sm:-mt-2 md:-mt-3 lg:-mt-4",
];

// Stacking order. On phones the first (blue) card sits on top of the video card.
// On sm and up it goes back to left-to-right stacking.
const Z_CLASSES = ["z-20 sm:z-[1]", "z-10 sm:z-[2]", "sm:z-[3]", "sm:z-[4]"];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // mobile: two overlapping tilted cards side by side (cards 3 and 4 are hidden)
      mm.add("(max-width: 639px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(headlineRef.current, { y: 24, opacity: 0, duration: 0.7 }).fromTo(
          cardRefs.current.slice(0, 2),
          { y: 40, opacity: 0, rotate: 0 },
          {
            y: 0,
            opacity: 1,
            rotate: (i) => cards[i].mobileRotate,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.35"
        );
      });

      // desktop: headline settles, then the card deck fans out and tilts into place;
      // hovering a card straightens the rest, opens a gap around it, and lets it pop forward
      mm.add("(min-width: 640px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(headlineRef.current, { y: 24, opacity: 0, duration: 0.7 }).fromTo(
          cardRefs.current,
          { y: 70, opacity: 0, rotate: 0 },
          {
            y: 0,
            opacity: 1,
            rotate: (i) => cards[i].rotate,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.35"
        );

        // capture each card's resting overlap (its computed negative margin + lift)
        // once layout has settled, so hover can animate away from and back to it
        const baseMarginLeft = cardRefs.current.map(
          (el) => parseFloat(getComputedStyle(el).marginLeft) || 0
        );
        const baseMarginTop = cardRefs.current.map(
          (el) => parseFloat(getComputedStyle(el).marginTop) || 0
        );

        const applyHover = (hoveredIndex) => {
          cardRefs.current.forEach((el, j) => {
            const isHovered = j === hoveredIndex;
            gsap.to(el, {
              rotate: isHovered ? cards[j].rotate * 1.3 : 0,
              scale: isHovered ? 1.06 : 1,
              zIndex: isHovered ? 40 : 10,
              marginLeft: j === 0 ? 0 : 14,
              marginTop: isHovered ? baseMarginTop[j] - 12 : 0,
              duration: 0.35,
              ease: "power2.out",
            });
          });
        };

        const clearHover = () => {
          cardRefs.current.forEach((el, j) => {
            gsap.to(el, {
              rotate: cards[j].rotate,
              scale: 1,
              zIndex: j + 1,
              marginLeft: baseMarginLeft[j],
              marginTop: baseMarginTop[j],
              duration: 0.35,
              ease: "power2.out",
            });
          });
        };

        const cleanups = cardRefs.current.map((el, i) => {
          const onEnter = () => applyHover(i);
          const onLeave = () => clearHover();

          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          };
        });

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bg font-inter text-text overflow-hidden">
      <div className="w-full px-4 pt-30 sm:px-8 sm:pt-20 lg:px-12 lg:pt-36">
        {/* Headline */}
        <div ref={headlineRef}>
          {/* Phones: one "Get …" per line. sm and up: original two-line break. */}
          <h1 className="text-[14vw] font-semibold leading-[0.95] tracking-tight sm:text-[8vw] lg:text-[7vw]">
            <span className="block sm:inline">Get Fit.</span>{" "}
            <span className="block sm:inline">
              Get
              <br className="hidden sm:block" /> Healthy.
            </span>{" "}
            <span className="block sm:inline">Get Results.</span>
          </h1>

          <p className="mt-6 max-w-md font-jakarta text-xl font-semibold leading-tight sm:mt-10 sm:text-2xl sm:leading-normal">
            Fitness Programs for the Whole
            <br className="hidden sm:block" /> Family Real Results, No Gym Required
          </p>
        </div>

        {/* Card stack
            phones: two big overlapping cards that bleed slightly past the edges
            sm+:    the full fanned deck, sized in vw so it never overflows */}
        <div className="-mx-4 mt-10 flex items-start justify-center pb-16 sm:mx-0 sm:mt-24 lg:pb-32">
          {cards.map((card, i) => (
            <div
              key={i}
              ref={addCardRef}
              className={`relative aspect-[3/4] w-[49vw] flex-none origin-center overflow-hidden rounded-[20px] shadow-xl sm:aspect-[2/3] sm:w-[22vw] sm:rounded-2xl lg:w-[20vw] lg:max-w-[22rem] ${
                i > 0 ? "-ml-[4vw]" : ""
              } ${i > 1 ? "hidden sm:block" : ""} ${Z_CLASSES[i]} ${LIFT_CLASSES[i]}`}
            >
              {card.type === "stat" ? (
                <div className={`flex h-full flex-col justify-between p-4 sm:p-5 lg:p-8 ${card.bg}`}>
                  <span className="text-[11vw] font-bold leading-none sm:text-4xl md:text-5xl lg:text-7xl">
                    {card.value}
                  </span>
                  {/* Phones: label, divider line, then caption. sm+: divider on top of both. */}
                  <div className="sm:border-t sm:border-text/20 sm:pt-3">
                    <p className="border-b border-text pb-1.5 text-[4.2vw] font-semibold leading-tight sm:border-b-0 sm:pb-0 sm:text-lg lg:text-xl">
                      {card.label}
                    </p>
                    <p className="mt-1.5 text-[3.4vw] opacity-70 sm:mt-0 sm:text-sm lg:text-base">
                      {card.caption}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <video
                    className="h-full w-full object-cover"
                    src={card.src}
                    poster={card.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={card.alt}
                  />
                  {card.overlay && (
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xl font-black uppercase text-primary-white [text-shadow:2px_2px_0_rgba(0,0,0,0.5)] sm:bottom-6 sm:text-2xl lg:text-3xl">
                      {card.overlay}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}