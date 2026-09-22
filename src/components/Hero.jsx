import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import vid1 from "../../src/assets/videos/video1.mp4"
import vid2 from "../../src/assets/videos/video2.mp4"
const cards = [
  {
    type: "stat",
    bg: "bg-primary-blue",
    value: "10K+",
    label: "Happy Families",
    caption: "Stronger together",
    rotate: -8,
  },
  {
    type: "video",
    src: vid1,
    poster: "...",
    alt: "Family fitness",
    rotate: 9,
  },
  {
    type: "stat",
    bg: "bg-primary-green",
    value: "100+",
    label: "Workouts",
    caption: "Made for every body",
    rotate: -7,
  },
  {
    type: "video",
    src: vid2,
    poster: "...",
    alt: "Family staying active",
    overlay: "MOVE",
    rotate: 6,
  },
];

// Per-card vertical "lift" that creates the fanned/scattered deck look:
// outer cards sit higher, the two inner cards dip down — matches the reference image.
// Written as literal class strings (not interpolated) so Tailwind's JIT scanner picks them up.
const LIFT_CLASSES = [
  "sm:mt-0",
  "sm:mt-10 md:mt-12 lg:mt-6",
  "sm:mt-8 md:mt-9 lg:mt-12",
  "sm:-mt-2 md:-mt-3 lg:-mt-4",
];

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

      // mobile: cards stack flat, no rotation
      mm.add("(max-width: 639px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(headlineRef.current, { y: 24, opacity: 0, duration: 0.7 }).fromTo(
          cardRefs.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
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
      <div className="w-full px-6 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        {/* Headline */}
        <div ref={headlineRef}>
          <h1 className="text-[13vw] font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
           Get Fit. Get 
            <br />
            Healthy. Get Results.
          </h1>

          <p className="mt-6 max-w-md text-lg font-medium sm:text-xl">
           Fitness Programs for the Whole 
            <br className="hidden sm:block" />Family Real Results, No Gym Required
          </p>
        </div>

        {/* Card stack — overlapping and fanned out like a scattered hand of cards */}
        <div className="mt-14 flex flex-col items-stretch gap-5 pb-16 sm:mx-auto sm:mt-24 sm:max-w-3xl sm:flex-row sm:items-start sm:justify-center sm:gap-0 lg:max-w-5xl lg:pb-32">
          {cards.map((card, i) => (
            <div
              key={i}
              ref={addCardRef}
              style={{ zIndex: i + 1 }}
              className={`relative aspect-[2/3] origin-center overflow-hidden rounded-2xl shadow-xl sm:h-[20rem] sm:w-[13rem] sm:flex-none md:h-[23rem] md:w-[15rem] lg:h-[30rem] lg:w-[22rem] ${
                i > 0 ? "sm:-ml-10 md:-ml-14 lg:-ml-16" : ""
              } ${LIFT_CLASSES[i]}`}
            >
              {card.type === "stat" ? (
                <div className={`flex h-full flex-col justify-between p-7 sm:p-8 ${card.bg}`}>
                  <span className="text-5xl font-black sm:text-6xl lg:text-7xl">{card.value}</span>
                  <div className="border-t border-text/20 pt-3">
                    <p className="text-lg font-semibold sm:text-xl">{card.label}</p>
                    <p className="text-sm opacity-70 sm:text-base">{card.caption}</p>
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
                  />
                  {card.overlay && (
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-2xl font-black uppercase text-primary-white [text-shadow:2px_2px_0_rgba(0,0,0,0.5)] sm:text-3xl">
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