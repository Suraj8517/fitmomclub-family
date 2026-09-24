import React from "react";
import { ArrowRight } from "lucide-react";
import about from "../../assets/about/about.jpg";
import JoinNowButton from "../utils/joinNowButton";
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

          <JoinNowButton text="Join Now" bg="bg-text" color="text-primary-white" circleBg="bg-white" circleColor="text-text" />
        </div>
      </div>
    </section>
  );
}