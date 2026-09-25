import { Link } from "react-router-dom";
import { ArrowLeft, Flame } from "lucide-react";

export default function NotFound({

  homeHref = "/",
  eyebrow = "Page not found",
  heading = "Not Found",
  body = "The page you are looking for is missing, has been moved, or never existed. Return to the homepage and try again.",
  homeLabel = "Return to Home",
  contactHref = "mailto:info@gethyped.nl",
  contactLabel = "Contact Us",
}) {
  return (
    <section className="relative isolate flex min-h-[80svh] flex-col overflow-hidden bg-bgfont-['Inter',system-ui,sans-serif] text-[#161616]">
      
     

    

      {/* main content, centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-12 text-center sm:px-10 sm:pt-36">
        {eyebrow ? (
          <span className="mb-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-tight text-[#161616]/70 sm:mb-4 sm:text-sm">
            {eyebrow}
          </span>
        ) : null}

        <h1
          aria-hidden="true"
          className="select-none font-['Anton',Impact,sans-serif] text-[clamp(6rem,26vw,14rem)] font-normal uppercase leading-[0.85] tracking-tight text-transparent [-webkit-text-stroke:3px_#141414] sm:[-webkit-text-stroke:4px_#141414] md:[-webkit-text-stroke:5px_#141414]"
        >
          404
        </h1>

        <h2 className="mt-4 max-w-xl font-['Anton',Impact,sans-serif] text-2xl font-normal uppercase leading-[0.95] tracking-tight sm:mt-5 sm:max-w-2xl sm:text-4xl md:text-5xl">
          {heading}
        </h2>

        {body ? (
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#161616]/70 sm:mt-5 sm:max-w-lg sm:text-base md:text-lg">
            {body}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9">
          <Link
            to={homeHref}
            className="flex items-center gap-3 rounded-full bg-[#141414] py-3 pl-5 pr-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:py-3.5 sm:pl-6 sm:text-base"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 sm:h-9 sm:w-9">
              <ArrowLeft className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
            </span>
            {homeLabel}
          </Link>

          <a
            href={contactHref}
            className="flex items-center gap-3 rounded-full bg-[#F1552B] py-3 pl-5 pr-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:py-3.5 sm:pl-6 sm:text-base"
          >
            {contactLabel}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 sm:h-9 sm:w-9">
              <Flame className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}