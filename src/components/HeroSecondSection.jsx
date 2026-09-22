import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import img from "../assets/home/img1.webp"
/**
 * "Wij maken content die opvalt" intro section.
 *
 * Uses the same design tokens as HeroSection.jsx (bg-bg, primary-blue,
 * text-text, font-inter — see that file's header comment for the
 * @theme block this relies on).
 *
 * Swap PORTRAIT_SRC for the real photo. Requires gsap: `npm install gsap`
 */

const PORTRAIT_SRC =img;

export default function IntroSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const scrollBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(headlineRef.current, { y: 28, opacity: 0, duration: 0.7 })
        .from(
          imageRef.current,
          { y: 30, opacity: 0, duration: 0.6 },
          "-=0.35"
        )
        .from(textRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          scrollBtnRef.current,
          { opacity: 0, duration: 0.5 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg font-inter text-text pb-16"
    >
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 sm:py-20 lg:px-12 lg:pt-4">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-inter max-w-4xl text-[9vw] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]"
        >
          Fast, effective workouts for busy families. Train at home, stay consistent, and get stronger together with real coaching.


        </h2>

      </div>

      {/* Portrait + copy row — full-bleed so the portrait can sit flush
          against the actual screen edge, independent of this section's
          max-width container */}
      <div className="relative left-1/2 mt-16 w-screen -translate-x-1/2 sm:mt-24">
        <div className="flex flex-col items-center gap-10 sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-0">
          <div
            ref={imageRef}
            className="aspect-[4/5] w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl bg-primary-pink/40 sm:ml-25 sm:max-w-[260px]"
          >
            <img
              src={PORTRAIT_SRC}
              alt="Teamlid van het bureau"
              className="h-full w-full object-cover"
            />
          </div>

          <div ref={textRef} className="mx-54 max-w-md text-left">
            <p className="text-lg font-semibold leading-snug sm:text-[24px]">
              You don't need two hours and a babysitter to get strong. FitMom Club Family gives busy moms, dads, and kids fast, effective home workouts, real coaching, and a community that actually gets it because we're a family too. 
            </p>

            <button
              type="button"
              className="mx-auto mt-8 inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-base font-semibold shadow-sm transition-transform hover:scale-[1.02]"
            >
              Leer ons kennen
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-text">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="var(--color-bg)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        ref={scrollBtnRef}
        type="button"
        aria-label="Scroll naar beneden"
        className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-xl border border-primary-blue text-primary-blue transition-colors hover:bg-primary-blue hover:text-white sm:bottom-8 sm:right-8 lg:right-12"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 3V13M8 13L4 9M8 13L12 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}