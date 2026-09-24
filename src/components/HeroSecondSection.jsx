import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import img from "../assets/home/img1.webp";
import JoinNowButton from "./utils/joinNowButton";

const PORTRAIT_SRC = img;

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
      className="relative bg-bg font-inter text-text pb-24 overflow-hidden sm:pb-16"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-20 lg:px-12 lg:pt-4">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-inter max-w-4xl text-[8vw] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]"
        >
          Fast, effective workouts for busy families. Train at home, stay consistent, and get stronger together with real coaching.
        </h2>
      </div>

      {/* Portrait + copy row — full-bleed so the portrait can sit flush
          against the actual screen edge, independent of this section's
          max-width container */}
      <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 sm:mt-24">
        <div className="pb-6 flex flex-col items-center gap-10 sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-0">
          {/* Phones: wide portrait, tilted a few degrees. sm+: original small portrait. */}
          <div
            ref={imageRef}
            className="py-6aspect-[4/5] w-[78vw] shrink-0 rotate-2 overflow-hidden rounded-[20px] bg-primary-pink/40 sm:ml-25 sm:w-full sm:max-w-[260px] sm:rotate-0 sm:rounded-2xl"
          >
            <img
              src={PORTRAIT_SRC}
              alt="family"
              className="h-full w-full object-cover "
            />
          </div>

          {/* Phones: full width, left aligned. sm+: original centered column. */}
          <div
            ref={textRef}
            className="w-full max-w-md px-4 text-left sm:mx-54 sm:w-auto sm:px-0"
          >
            <p className="text-xl font-semibold leading-snug sm:text-[24px]">
              You don't need two hours and a babysitter to get strong. FitMom Club Family gives busy moms, dads, and kids fast, effective home workouts, real coaching, and a community that actually gets it because we're a family too.
            </p>

            {/* Phones: outlined pill. sm+: white pill with shadow. */}
            <div className="mt-6">
           <JoinNowButton text="Start Your Free Trial" bg="bg-white" color="text-text" circleBg="bg-text" circleColor="text-white" />

            </div>
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