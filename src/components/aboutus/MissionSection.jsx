import React from "react";
import { ArrowRight } from "lucide-react";
import about from "../../assets/about/about.jpg";
export default function MissionSection() {
  return (
    <section className="bg-bg w-full px-6 sm:px-10 lg:px-16  ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column: image */}
        <div className="w-full max-w-md mx-auto lg:mx-0 aspect-[4/5] rounded-3xl overflow-hidden">
          <img
            src={about}
            alt="Team member covering his ears playfully"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right column: eyebrow + heading + description + CTA */}
        <div>
          <p className="font-space font-bold text-primary-orange text-2xl sm:text-3xl md:text-4xl mb-3">
           Our Mission: Fitness For Every Family
          </p>

          <h2 className="font-space font-bold text-text leading-[1.15] tracking-tight text-3xl sm:text-4xl md:text-4xl mb-8 lg:mb-10">
           Our mission is simple: help busy families feel strong, energized, and connected through fitness that fits real life.
          </h2>

          <button className="inline-flex items-center gap-4 bg-primary-white text-text font-inter font-medium text-base pl-6 pr-2 py-2 rounded-full hover:opacity-90 transition-opacity">
            <span>Join Now</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-text text-primary-white">
              <ArrowRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}