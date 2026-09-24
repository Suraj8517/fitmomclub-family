import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import community from "../assets/home/expertise/community.webp";
import plan from "../assets/home/expertise/plan.webp";
import quiz from "../assets/home/expertise/quiz.webp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// imageBorder: thinner border on phones (the photo is small there), original 10px from sm up.
const expertises = [
  {
    number: "01",
    title: "Take the Quick Family Fitness Quiz",
    subtitle: "Find the right fit for your family.",
    description:
      "Tell us about your household goals, schedules, and who's joining in so we can match your family with the right online fitness program.",
    ctaLabel: "Take the Quiz",
    ctaHref: "#",
    image: quiz,
    imageRotate: 4,
    cardBg: "bg-white",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-bg",
    badgeText: "text-text",
    imageBorder: "border-[6px] border-primary-orange sm:border-[10px]",
    ctaBg: "bg-primary-orange",
    ctaText: "text-white",
    circleBg: "bg-white",
    circleIcon: "text-primary-orange",
    subhead: "Take Quiz",
  },
  {
    number: "02",
    title: "Get Your Custom Family Plan",
    subtitle: "Fitness built around real life.",
    description:
      "Receive workout plans for mom, dad, and the kids designed around your real life—not a fantasy schedule with two free hours a day.",
    ctaLabel: "Get Your Plan",
    ctaHref: "#",
    image: plan,
    imageRotate: -4,
    cardBg: "bg-primary-pink",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-white",
    badgeText: "text-text",
    imageBorder: "border-[6px] border-white sm:border-[10px]",
    ctaBg: "bg-white",
    ctaText: "text-text",
    circleBg: "bg-text",
    circleIcon: "text-white",
    subhead: "Select Plan",
  },
  {
    number: "03",
    title: "Join the Community",
    subtitle: "Get stronger together.",
    description:
      "Connect with thousands of families doing the same workouts, sharing wins, and cheering each other on every step of the way.",
    ctaLabel: "Join the Community",
    ctaHref: "#",
    image: community,
    imageRotate: -3,
    cardBg: "bg-primary-green",
    textColor: "text-text",
    numberColor: "text-black/10",
    badgeBg: "bg-white",
    badgeText: "text-text",
    imageBorder: "border-[6px] border-white sm:border-[10px]",
    ctaBg: "bg-white",
    ctaText: "text-text",
    circleBg: "bg-text",
    circleIcon: "text-white",
    subhead: "Join Community",
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
    <section className="bg-bg font-inter pt-14 sm:pt-20">
      <div className="px-4 text-center">
        <h2 className="font-inter text-4xl font-bold sm:text-5xl">How It Works</h2>
      </div>

      <div className="px-3 pb-16 pt-8 sm:px-5 sm:pb-24 sm:pt-10 lg:px-8">
        {expertises.map((c, i) => (
          <div
            key={c.title}
            ref={addCardRef}
            className="sticky"
            style={{ top: `${1.5 + i * 1.5}rem`, zIndex: i + 1 }}
          >
            {/* Phones: compact card that fits inside one screen so the stack effect
                works. sm+: the original tall card. */}
            <div
              className={`relative w-full overflow-hidden rounded-[1.75rem] p-5 shadow-2xl sm:min-h-[30rem] sm:rounded-[2.5rem] sm:p-12 lg:min-h-[36rem] lg:p-16 ${c.cardBg} ${c.textColor}`}
            >
              {/* Big ghost page number, sits behind everything.
                  Phones: bottom right (the photo covers the top right).
                  sm+: top right, as before. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-1 right-4 select-none text-[5.5rem] font-black leading-none sm:bottom-auto sm:-top-2 sm:right-10 sm:text-[9rem] lg:right-14 lg:text-[11rem] ${c.numberColor}`}
              >
                {c.number}
              </span>

              {/* Foreground content */}
              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* Phones: leave room on the right for the photo and reserve its height
                    so it never overlaps the copy below. */}
                <div className="min-h-[44vw] max-w-xl pr-[32vw] sm:min-h-0 sm:pr-0">
                  <span
                    className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-semibold sm:px-4 sm:text-sm ${c.badgeBg} ${c.badgeText}`}
                  >
                    {c.subhead}
                  </span>
                  <h2 className="mt-4 break-words text-[6.8vw] font-black leading-[1] tracking-tight sm:mt-6 sm:text-6xl sm:leading-[0.95] lg:text-7xl">
                    {c.title}
                  </h2>
                </div>

                <div className="mt-5 max-w-md sm:mt-10 lg:mt-16">
                  <p className="text-lg font-semibold sm:text-xl">{c.subtitle}</p>
                  <p className="mt-2 text-[15px] leading-relaxed opacity-80 sm:mt-3 sm:text-lg sm:leading-normal">
                    {c.description}
                  </p>
                  <a
                    href={c.ctaHref}
                    className={`mt-5 inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-bold transition-transform hover:scale-[1.03] sm:mt-6 sm:pl-6 sm:text-base ${c.ctaBg} ${c.ctaText}`}
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
                className="absolute right-4 top-5 z-20 w-[30vw] sm:right-10 sm:top-12 sm:w-48 md:w-56 lg:right-16 lg:top-14 lg:w-72"
                style={{ transform: `rotate(${c.imageRotate}deg)` }}
              >
                <div
                  className={`aspect-[3/4] overflow-hidden rounded-2xl shadow-xl sm:rounded-[1.5rem] ${c.imageBorder}`}
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