const DEFAULT_PROGRAMS = [
  {
    title: "Family Home Workouts",
    subtitle: "15-Minute Programs",
    tag: "Online",
    description:
      "Short, effective online workouts the whole family can do together or separately, on your own schedule. No gym, minimal equipment, maximum results.",
    tone: "pink",
    span: "lg:col-span-4",
    featured: true,
    href: "#",
  },
  {
    title: "Mom & Dad Fitness Coaching",
    tag: "1:1 Coaching",
    description:
      "Work directly with a certified coach who builds a fitness program around each parent's goals and schedule, with weekly check-ins to keep you both accountable.",
    tone: "white",
    span: "lg:col-span-2",
    href: "#",
  },
  {
    title: "Kids & Family Activity Programs",
    tag: "Kids",
    description:
      "Fun, age-appropriate movement activities designed to get kids off screens and moving. Easy to fold into family workout time.",
    tone: "dark",
    span: "lg:col-span-2",
    href: "#",
  },
  {
    title: "Postpartum & Prenatal Fitness Programs",
    tag: "Prenatal",
    description:
      "Safe, trainer-approved programs for pregnancy and postpartum recovery, built with certified pre/postnatal specialists so moms can rebuild strength with confidence.",
    tone: "white",
    span: "lg:col-span-2",
    href: "#",
  },
  {
    title: "FitMom Club",
    subtitle: "Family Community Membership",
    tag: "Community",
    description:
      "Join a private community of families doing the same workouts, sharing wins, and keeping each other accountable. Motivation is easier when the whole household is in it together.",
    tone: "pink",
    span: "lg:col-span-2",
    href: "#",
  },
];

const TONES = {
  pink: {
    card: "bg-primary-pink text-text",
    desc: "text-text/75",
    pill: "bg-primary-white text-text",
    btn: "bg-text text-primary-white",
  },
  white: {
    card: "bg-primary-white text-text",
    desc: "text-text/70",
    pill: "bg-primary-pink text-text",
    btn: "bg-text text-primary-white",
  },
  dark: {
    card: "bg-text text-primary-white",
    desc: "text-primary-white/70",
    pill: "bg-primary-pink text-text",
    btn: "bg-primary-pink text-text",
  },
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ProgramCard({ program }) {
  const t = TONES[program.tone] ?? TONES.white;

  return (
    <a
      href={program.href}
      className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[24px] p-5 shadow-[0_25px_60px_-30px_rgba(22,22,22,0.45)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text sm:min-h-[320px] sm:rounded-[28px] sm:p-8 ${
        program.featured ? "lg:min-h-[400px]" : ""
      } ${program.span} ${t.card}`}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium sm:px-3.5 sm:py-1.5 sm:text-sm ${t.pill}`}
        >
          {program.tag}
        </span>
        {program.featured && (
          <span className="text-right text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
            15
            <span className="ml-1 text-lg font-medium sm:text-2xl">min</span>
          </span>
        )}
      </div>

      {/* bottom text */}
      <div className="mt-8 sm:mt-12">
        <h3
          className={`break-words font-semibold leading-[1.08] tracking-tight ${
            program.featured
              ? "text-3xl sm:text-5xl"
              : "text-2xl sm:text-3xl"
          }`}
        >
          {program.title}
          {program.subtitle && (
            <span className="mt-1 block text-base font-medium opacity-70 sm:text-xl">
              {program.subtitle}
            </span>
          )}
        </h3>

        {/* Phones: description full width, arrow underneath on the right.
            sm and up: description and arrow side by side. */}
        <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p
            className={`max-w-[46ch] text-[15px] leading-relaxed sm:text-base ${t.desc}`}
          >
            {program.description}
          </p>
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full transition-transform duration-300 group-hover:rotate-45 sm:h-12 sm:w-12 sm:self-auto ${t.btn}`}
          >
            <ArrowIcon />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function OurPrograms({
  programs = DEFAULT_PROGRAMS,
  heading = "Our\nPrograms.",
  intro = "Five ways to get your whole family moving, whether you have 15 minutes or a full weekend.",
}) {
  return (
    <section className="bg-bg px-5 py-24 sm:px-10 sm:py-28 lg:px-16">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="whitespace-pre-line text-[12vw] font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-[5.95rem]">
          {heading}
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-text/70 sm:text-lg">
          {intro}
        </p>
      </div>

      {/* Phones: auto-rows-fr makes every row as tall as the tallest card.
          sm and up: rows size to their content again. */}
      <div className="mx-auto mt-8 grid max-w-6xl auto-rows-fr grid-cols-1 gap-4 sm:mt-20 sm:auto-rows-auto sm:gap-6 lg:grid-cols-6">
        {programs.map((program) => (
          <ProgramCard key={program.title} program={program} />
        ))}
      </div>
    </section>
  );
}