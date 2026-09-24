import { useState } from "react";
import { Clock, ArrowRight, ArrowUpRight, Check } from "lucide-react";

// TODO: replace these placeholders with your real details.
const CONTACT = {
  email: "[Email]",
  phone: "[Your Phone Number]",
  instagram: "#", // [link]
  facebook: "#", // [link]
  hours: "Mon – Fri, 9 AM – 5 PM",
};

// Each family member gets its own accent from the palette, so the "who's joining"
// choice reads as a person rather than an interchangeable form option.
const WHO_OPTIONS = [
  { label: "Mom", accent: "pink" },
  { label: "Dad", accent: "blue" },
  { label: "Kids", accent: "green" },
  { label: "Whole Family", accent: "orange" },
];

const ACCENT_CLASSES = {
  pink: "hover:border-primary-pink peer-checked:border-primary-pink peer-checked:bg-primary-pink peer-checked:text-text peer-focus-visible:outline-primary-pink",
  blue: "hover:border-primary-blue peer-checked:border-primary-blue peer-checked:bg-primary-blue peer-checked:text-white peer-focus-visible:outline-primary-blue",
  green: "hover:border-primary-green peer-checked:border-primary-green peer-checked:bg-primary-green peer-checked:text-white peer-focus-visible:outline-primary-green",
  orange: "hover:border-primary-orange peer-checked:border-primary-orange peer-checked:bg-primary-orange peer-checked:text-white peer-focus-visible:outline-primary-orange",
};

const GOAL_OPTIONS = [
  { label: "Weight Loss", accent: "blue" },
  { label: "Improve Fitness & Strength", accent: "green" },
  { label: "Better Nutrition", accent: "pink" },
  { label: "Build Healthy Family Habits", accent: "orange" },
  { label: "Overall Family Transformation", accent: "blue" },
];

const INPUT_CLASS =
  "w-full rounded-xl border border-text/15 bg-bg px-4 py-3 text-base text-text placeholder:text-text/40 outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/30";

// A radio / checkbox styled as a pill. The real input is visually hidden but still
// focusable, so keyboard and screen-reader users are covered.
function ChoicePill({ type, name, value, required, accent = "orange" }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} required={required} className="peer sr-only" />
      <span
        className={`inline-flex select-none items-center rounded-full border border-text/15 bg-bg px-4 py-2 text-sm font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${ACCENT_CLASSES[accent]}`}
      >
        {value}
      </span>
    </label>
  );
}

function Field({ label, htmlFor, required, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="ml-0.5 text-primary-orange">*</span>}
      </label>
      {children}
    </div>
  );
}

// One large, tappable line for a primary contact method (email / phone).
// Treated as the main event of the card rather than one of several identical rows.
function PrimaryContactLink({ href, value, isFirst }) {
  return (
    <a
      href={href}
      className={`group flex items-center justify-between gap-3 border-white/25 py-4 ${
        isFirst ? "pt-0" : "border-t"
      }`}
    >
      <span className="break-all text-xl font-semibold leading-snug sm:text-2xl">{value}</span>
      <ArrowUpRight
        size={20}
        className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      whoIsJoining: fd.get("who"),
      goals: fd.getAll("goals"),
      height: fd.get("height"),
      weight: fd.get("weight"),
      message: fd.get("message"),
    };

    // TODO: send `payload` to your backend or form service (Formspree, EmailJS, your API...).
    console.log("Contact form submitted:", payload);

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-bg font-inter text-text">
      <section className="px-5 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-40 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {/* Intro */}
          <span className="inline-block rounded-lg bg-primary-orange px-3 py-1 text-xs font-medium text-white sm:text-sm">
            Contact
          </span>
          <h1 className="font-manrope mt-5 max-w-4xl text-[11.5vw] font-bold leading-[.9] tracking-tight sm:text-6xl lg:text-[5.5rem]">
            We’d Love to Hear <span className="text-primary-orange">from You</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text/70 sm:mt-6 sm:text-xl">
            Questions about our fitness programs for moms, dads, or kids, membership options,
            or which plan fits your family’s schedule? Send us a message and a real member of
            our team, usually a parent herself or himself, will get back to you within 24
            hours.
          </p>

          <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-5 lg:items-start lg:gap-8">
            {/* Contact details: email + phone lead as large links, socials and hours sit quietly below */}
            <aside className="rounded-3xl bg-text p-6 text-white sm:p-8 lg:sticky lg:top-28 lg:col-span-2">
              <p className="text-sm font-semibold text-white/60">Get in touch</p>
              <h2 className="mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Contact Details
              </h2>

              <div className="mt-6 flex flex-col border-b border-white/15">
                <PrimaryContactLink
                  href={`mailto:${CONTACT.email}`}
                  value={CONTACT.email}
                  isFirst
                />
                <PrimaryContactLink
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  value={CONTACT.phone}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock size={16} />
                  <span>{CONTACT.hours}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={CONTACT.instagram}
                    className="rounded-full bg-primary-green/20 px-4 py-1.5 text-sm font-semibold text-primary-green transition-colors hover:bg-primary-green hover:text-text"
                  >
                    Instagram
                  </a>
                  <a
                    href={CONTACT.facebook}
                    className="rounded-full bg-primary-blue/20 px-4 py-1.5 text-sm font-semibold text-primary-blue transition-colors hover:bg-primary-blue hover:text-white"
                  >
                    Facebook
                  </a>
                </div>
              </div>

              <div className="mt-8 flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-green opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-green" />
                </span>
                We reply within 24 hours
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl bg-primary-white p-5 shadow-[0_25px_60px_-30px_rgba(22,22,22,0.35)] sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="flex flex-col items-start gap-4 py-6 sm:py-10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-green text-white">
                      <Check size={26} strokeWidth={3} />
                    </span>
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Message sent!
                    </h2>
                    <p className="max-w-md text-base leading-relaxed text-text/70 sm:text-lg">
                      Thanks for reaching out. A member of our team will get back to you
                      within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 rounded-full border border-primary-green px-6 py-2.5 text-sm font-semibold text-primary-green transition-colors hover:bg-primary-green hover:text-white"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Send us a message
                      </h2>
                      <p className="mt-1 text-sm text-text/60">
                        Fields marked <span className="text-primary-orange">*</span> are
                        required.
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Name" htmlFor="name" required>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className={INPUT_CLASS}
                        />
                      </Field>
                      <Field label="Email Address" htmlFor="email" required>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={INPUT_CLASS}
                        />
                      </Field>
                    </div>

                    <fieldset>
                      <legend className="mb-2 text-sm font-semibold">
                        Who’s joining?<span className="ml-0.5 text-primary-orange">*</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {WHO_OPTIONS.map((opt, i) => (
                          <ChoicePill
                            key={opt.label}
                            type="radio"
                            name="who"
                            value={opt.label}
                            accent={opt.accent}
                            required={i === 0}
                          />
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2 text-sm font-semibold">
                        What would you like to achieve?
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {GOAL_OPTIONS.map((opt) => (
                          <ChoicePill
                            key={opt.label}
                            type="checkbox"
                            name="goals"
                            value={opt.label}
                            accent={opt.accent}
                          />
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      <Field label="Height" htmlFor="height">
                        <input
                          id="height"
                          name="height"
                          type="text"
                          placeholder={"5'6\" or 168 cm"}
                          className={INPUT_CLASS}
                        />
                      </Field>
                      <Field label="Weight" htmlFor="weight">
                        <input
                          id="weight"
                          name="weight"
                          type="text"
                          placeholder="150 lb or 68 kg"
                          className={INPUT_CLASS}
                        />
                      </Field>
                    </div>

                    <Field label="Anything else you'd like us to know?" htmlFor="message">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your family's schedule, goals, or questions."
                        className={`${INPUT_CLASS} resize-y`}
                      />
                    </Field>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-between gap-4 rounded-full bg-primary-orange py-3.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:justify-center"
                    >
                      Send Message
                     
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}