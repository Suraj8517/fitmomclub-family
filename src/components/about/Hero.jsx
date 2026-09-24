export default function AboutHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 ">
      {/* Badge */}
      <span className="inline-block bg-bg border border-text/10 text-text text-sm font-medium px-4 py-2 rounded-xl mb-6 font-dm-sans">
        Built by Parents, for Families
      </span>

      {/* Heading */}
      <h1 className="font-inter text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text leading-[0.65]max-w-3xl">
        FitMom Club
      </h1>
      <h1 className="font-inter text-5xl sm:text-6xl lg:text-[8vw] font-black text-primary-orange tracking-wider mb-6 max-w-3xl">
        Family
      </h1>

      {/* Description */}
      <p className="font-jakarta text-xl text-text/80 max-w-md leading-relaxed mb-8 font-semibold">
        Born from one mom staring at a gym schedule that never matched real
        life, FitMom Club Family grew into online fitness programs built for
        the whole family.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <a
          href="#"
          className="flex items-center gap-3 bg-primary-white border border-text/50 text-text font-semibold text-sm pl-5 pr-1 py-1 rounded-xl transition-all duration-300 ease-out hover:opacity-90 hover:-rotate-2 hover:scale-105"
        >
          Join Now
          <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-text text-primary-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 bg-primary-white border border-text/50 text-text font-semibold text-sm pl-5 pr-1 py-1 rounded-xl transition-all duration-300 ease-out hover:opacity-90 hover:rotate-2 hover:scale-105"
        >
          See Our Programs
          <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-text text-primary-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}