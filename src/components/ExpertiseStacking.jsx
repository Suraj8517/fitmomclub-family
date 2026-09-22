import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Each card = one "expertise". Add/remove entries here and the stack updates automatically.
// NOTE: bg-primary-pink is assumed to exist alongside your existing bg-primary-blue /
// bg-primary-green tokens. If it isn't defined yet, either add it to your Tailwind theme
// or swap the className below for an arbitrary value, e.g. bg-[#F6A6EF].
const expertises = [
  {
    number: "01",
    title: "Take the Quick Family Fitness Quiz",
    subtitle: "Find the right fit for your family.",
    description:
      "Tell us about your household goals, schedules, and who's joining in so we can match your family with the right online fitness program.",
    ctaLabel: "Take the Quiz",
    ctaHref: "#",
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80",
    imageRotate: 4,
    cardBg: "bg-white",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-bg",
    badgeText: "text-text",
    imageBorder: "border-[10px] border-primary-orange",
    ctaBg: "bg-primary-orange",
    ctaText: "text-white",
    circleBg: "bg-white",
    circleIcon: "text-primary-orange",
  },
  {
    number: "02",
    title: "Get Your Custom Family Plan",
    subtitle: "Fitness built around real life.",
    description:
      "Receive workout plans for mom, dad, and the kids designed around your real life—not a fantasy schedule with two free hours a day.",
    ctaLabel: "Get Your Plan",
    ctaHref: "#",
    image:
      "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80",
    imageRotate: -4,
    cardBg: "bg-primary-pink",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-white",
    badgeText: "text-text",
    imageBorder: "border-[10px] border-white",
    ctaBg: "bg-white",
    ctaText: "text-text",
    circleBg: "bg-text",
    circleIcon: "text-white",
  },
  {
    number: "03",
    title: "Join the Community",
    subtitle: "Get stronger together.",
    description:
      "Connect with thousands of families doing the same workouts, sharing wins, and cheering each other on every step of the way.",
    ctaLabel: "Join the Community",
    ctaHref: "#",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
    imageRotate: -3,
    cardBg: "bg-primary-green",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-white",
    badgeText: "text-text",
    imageBorder: "border-[10px] border-white",
    ctaBg: "bg-white",
    ctaText: "text-text",
    circleBg: "bg-text",
    circleIcon: "text-white",
  },
];

export default function ExpertiseStack() {
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // As each next card scrolls up and starts covering the current one, push the
      // current card back into the stack: it shrinks symmetrically, tilts toward
      // its right side, and lifts slightly. Once fully covered, continuing to
      // scroll fades it out so the stack doesn't get visually cluttered.
      cardRefs.current.forEach((card, i) => {
        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) return;

        gsap.set(card, { transformOrigin: "center center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Phase 1 (first half of the scroll range): recede — scale down evenly,
        // tilt clockwise so the right side dips, lift slightly.
        tl.to(
          card,
          { rotate: 4, scale: 0.85, y: -24, ease: "none", duration: 1 },
          0
        );
        // Phase 2 (second half): once it has receded, fade it away.
        tl.to(card, { opacity: 0, ease: "none", duration: 1 }, 1);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-bg font-inter">
      <div className="px-3 pb-24 pt-10 sm:px-5 lg:px-8">
        {expertises.map((c, i) => (
          <div
            key={c.title}
            ref={addCardRef}
            className="sticky"
            style={{ top: `${1.5 + i * 1.5}rem`, zIndex: i + 1 }}
          >
            <div
              className={`relative min-h-[26rem] w-full overflow-hidden rounded-[2rem] p-8 shadow-2xl sm:min-h-[30rem] sm:rounded-[2.5rem] sm:p-12 lg:min-h-[36rem] lg:p-16 ${c.cardBg} ${c.textColor}`}
            >
              {/* Big ghost page number, sits behind everything */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-2 right-6 select-none text-[6rem] font-black leading-none sm:right-10 sm:text-[9rem] lg:right-14 lg:text-[11rem] ${c.numberColor}`}
              >
                {c.number}
              </span>

              {/* Foreground content */}
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="max-w-xl">
                  <span
                    className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${c.badgeBg} ${c.badgeText}`}
                  >
                    Expertise
                  </span>
                  <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                    {c.title}
                  </h2>
                </div>

                <div className="mt-10 max-w-md lg:mt-16">
                  <p className="text-lg font-semibold sm:text-xl">{c.subtitle}</p>
                  <p className="mt-3 text-base opacity-80 sm:text-lg">
                    {c.description}
                  </p>
                  <a
                    href={c.ctaHref}
                    className={`mt-6 inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-bold transition-transform hover:scale-[1.03] sm:text-base ${c.ctaBg} ${c.ctaText}`}
                  >
                    {c.ctaLabel}
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full sm:h-10 sm:w-10 ${c.circleBg}`}
                    >
                      <ArrowRight className={`h-4 w-4 ${c.circleIcon}`} />
                    </span>
                  </a>
                </div>
              </div>

              {/* Rotated photo, top right, overlapping the ghost number */}
              <div
                className="absolute right-6 top-8 z-20 w-32 sm:right-10 sm:top-12 sm:w-48 md:w-56 lg:right-16 lg:top-14 lg:w-72"
                style={{ transform: `rotate(${c.imageRotate}deg)` }}
              >
                <div
                  className={`aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-xl ${c.imageBorder}`}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}