import { Clock, HeartHandshake, Users, Sprout, ShieldCheck, CheckIcon } from "lucide-react";

// span: on phones the grid has 2 columns, so every card takes 1 column except the last,
// which takes both -> rows of 2 / 2 / 1. sm and up keep the original spans.
const values = [
  {
    icon: <Clock size={22} />,
    title: "Real life over perfect schedules",
    text: "Workouts that fit real family routines.",
    bg: "bg-primary-blue",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    icon: <HeartHandshake size={22} />,
    title: "Community over competition",
    text: "Support, not comparison.",
    bg: "bg-primary-pink",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    icon: <Users size={22} />,
    title: "Everyone included",
    text: "Programs for moms, dads, and kids, not just one parent.",
    bg: "bg-primary-green",
    span: "sm:col-span-1 lg:col-span-2",
  },
  {
    icon: <Sprout size={22} />,
    title: "Sustainable progress over quick fixes",
    text: "Habits that last.",
    bg: "bg-primary-orange",
    span: "sm:col-span-1 lg:col-span-3",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Safety first",
    text: "Every program is trainer designed and age/stage aware.",
    bg: "bg-primary-white",
    span: "col-span-2 sm:col-span-2 lg:col-span-3",
  },
];

export default function OurValuesSection() {
  return (
    <section className="font-poppins bg-bg text-text w-full py-14 sm:py-28 px-5 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:gap-10 mb-10 sm:mb-16">
          <div className="lg:w-3/5 mb-5 lg:mb-0">
            <h2 className="font-medium leading-none tracking-tighter text-[clamp(2.6rem,8vw,5.5rem)]">
              Our
              <br />
              Values
            </h2>
          </div>
          <div className="lg:w-2/5">
            <p className="text-text/70 text-[15px] sm:text-base leading-relaxed max-w-md">
              Fitness works when it fits your family. These are the principles behind every program we build.
            </p>
          </div>
        </div>

        {/* Values grid: phones 2 / 2 / 1, sm 2 / 2 / 1, lg 3 + 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className={`${v.bg} ${v.span} rounded-2xl p-4 sm:rounded-3xl sm:p-8 flex flex-col justify-between gap-6 sm:gap-16 lg:min-h-[280px]`}
            >
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-text text-primary-white flex items-center justify-center shrink-0">
                {v.icon}
              </span>
              <div>
                <h3 className="font-semibold text-base sm:text-2xl leading-snug tracking-tight mb-1.5 sm:mb-2 max-w-sm break-words">
                  {v.title}
                </h3>
                <p className="text-[13px] sm:text-[15px] leading-snug sm:leading-relaxed max-w-sm text-text/80">
                  {v.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="mt-8 sm:mt-14">
          <span className="inline-flex items-center gap-2.5 bg-primary-white border border-text/10 rounded-full pl-2 pr-4 py-2 text-[14px] font-semibold">
            <span className="w-5 h-5 rounded-full bg-primary-orange flex items-center justify-center shrink-0">
              <CheckIcon size={11} strokeWidth={3} className="text-primary-white" />
            </span>
            Built for moms, dads, and kids.
          </span>
        </div>
      </div>
    </section>
  );
}