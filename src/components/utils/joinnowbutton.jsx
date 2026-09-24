import React from "react";
import { ArrowRight } from "lucide-react";

function JoinNowButton({
  text = "Join Now",
  bg = "bg-primary-white",
  color = "text-white",
  circleBg = "bg-white",
  circleColor = "text-primary-white",
}) {
  return (
    <button
      className={`group inline-flex items-center gap-4 rounded-full ${bg} py-2 pl-6 pr-2 font-inter text-base font-medium ${color} transition-opacity hover:opacity-90`}
    >
      <span>{text}</span>

      <span
        className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${circleBg} ${circleColor}`}
      >
        <ArrowRight
          size={18}
          className="absolute transition-all duration-300 ease-out group-hover:-translate-y-4 group-hover:translate-x-4 group-hover:-rotate-45 group-hover:opacity-0 motion-reduce:transition-none"
        />

        <ArrowRight
          size={18}
          className="absolute -translate-x-4 translate-y-4 -rotate-45 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        />
      </span>
    </button>
  );
}

export default JoinNowButton;