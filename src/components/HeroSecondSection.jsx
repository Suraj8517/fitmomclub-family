import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "../assets/home/img1.webp";
import JoinNowButton from "./utils/joinnowbutton";
import { Scroll } from "lucide-react";
import ScrollBlurText from "./utils/blurText";

gsap.registerPlugin(ScrollTrigger);

const PORTRAIT_SRC = img;

export default function IntroSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const imageRef = useRef(null);
  const imgInnerRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollBtnRef = useRef(null);
  const btnArrowRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      /* 1. Headline: slides up as the section enters the viewport */
      gsap.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      /* 2. Portrait: clip-path reveal (wipes up) + soft fade.
            Only clip-path/opacity are animated on the wrapper so the
            Tailwind rotate-2 tilt is never overwritten. */
      gsap.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 3. Portrait inner image: zoom-out on reveal + scroll parallax */
      gsap.fromTo(
        imgInnerRef.current,
        { scale: 1.35 },
        {
          scale: 1.1,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        imgInnerRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      /* 4. Paragraph: rises in with a slight blur-to-sharp */
      gsap.fromTo(
        textRef.current,
        { y: 50, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      /* 5. CTA button: pops in after the paragraph */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 24,
          opacity: 0,
          scale: 0.92,
          duration: 0.7,
          delay: 0.25,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        });
      }

      /* 6. Scroll indicator: fades in, arrow bobs, hides once scrolled past */
      gsap.from(scrollBtnRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      });

      if (btnArrowRef.current) {
        gsap.to(btnArrowRef.current, {
          y: 4,
          duration: 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      gsap.to(scrollBtnRef.current, {
        opacity: 0,
        pointerEvents: "none",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 85%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, sectionRef);

    // Image load shifts layout, so recalc trigger positions
    const imgEl = imgInnerRef.current;
    const refresh = () => ScrollTrigger.refresh();
    if (imgEl && !imgEl.complete) imgEl.addEventListener("load", refresh);

    return () => {
      if (imgEl) imgEl.removeEventListener("load", refresh);
      ctx.revert();
    };
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
          <ScrollBlurText text="Fast, effective workouts for busy families. Train at home, stay consistent, and get stronger together with real coaching." />   
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
              ref={imgInnerRef}
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
            <div className="mt-6" ref={ctaRef}>
           <JoinNowButton text="Start Your Free Trial" bg="bg-white" color="text-text" circleBg="bg-text" circleColor="text-white" />

            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
      onClick={() => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
        ref={scrollBtnRef}
        type="button"
        aria-label="Scroll naar beneden"
        className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-xl border border-primary-blue text-primary-blue transition-colors hover:bg-primary-blue hover:text-white sm:bottom-8 sm:right-8 lg:right-12"
      >
        <svg
          ref={btnArrowRef}
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