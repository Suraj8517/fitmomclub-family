import React from "react";
import vid from "../../assets/videos/video1.mp4";

export default function AboutHero() {
  return (
    <section className="bg-bg w-full px-4 py-30 sm:px-10 sm:py-16 lg:px-16 lg:pt-34">
      <div className="mx-auto grid grid-cols-1 items-center gap-4 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Phones: both column wrappers use `contents`, so their children become direct
            grid items and can be reordered: badge > heading > video > paragraph.
            sm and up: the wrappers are real boxes again (original two-column layout). */}

        {/* Left column: badge (phones only) + video */}
        <div className="contents sm:flex sm:flex-col">
          <span className="order-1 w-fit rounded-lg bg-primary-pink px-3 py-1 text-xs font-medium text-text sm:hidden ">
            About
          </span>

          <div className="order-3 aspect-[3/2] w-full overflow-hidden rounded-xl sm:order-none sm:mt-40 sm:aspect-square sm:w-48 sm:rounded-2xl md:w-56 lg:w-64">
            <video
              src={vid}
              aria-label="Kids playing at the beach"
              className="h-full w-full object-cover object-top"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>

        {/* Right column: heading + description */}
        <div className="contents sm:block">
          <h2 className="order-2 font-space text-[9vw] font-bold leading-[1.05] tracking-tight text-text sm:order-none sm:mb-6 sm:text-5xl md:text-6xl lg:mb-8 lg:text-6xl">
            Built by Parents,
            <br />
            for Families
          </h2>

          <p className="order-4 max-w-xl font-manrope  text-2xl font-bold leading-snug text-text/90 sm:order-none sm:text-xl md:text-2xl">
            FitMom Club Family started with one busy mom who couldn’t find a workout that fit her life. We built something different, online fitness programs for the whole family, designed to fit real schedules and real life.
          </p>
        </div>
      </div>
    </section>
  );
}