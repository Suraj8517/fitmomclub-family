import { useState } from "react";
import { Clock, ArrowRight, ArrowUpRight, Check, Mail, Phone } from "lucide-react";

// Google Apps Script web app (/exec URL). Set it in .env as:
// VITE_CONTACT_FORM_URL=https://script.google.com/macros/s/XXXX/exec
const SHEET_URL =
  import.meta.env?.VITE_CONTACT_FORM_URL ||
  "https://script.google.com/macros/s/AKfycbx46drDEF_arrFAB3MmbC8zE9w4sqAK_PymPf7o6ghZXpYbYjiCNP-4SzYfPncQNaE/exec";

// TODO: replace these placeholders with your real details.
const CONTACT = {
  email: "[Email]",
  phone: "[ Phone Number]",
  instagram: "https://www.instagram.com/fitmom.family/",
  facebook: "https://www.facebook.com/Fitmomclub.family",
  hours: "Mon – Fri, 9 AM – 5 PM",
};

const WHO_OPTIONS = [
  { label: "Mom", accent: "pink" },
  { label: "Dad", accent: "blue" },
  { label: "Kids", accent: "green" },
  { label: "Whole Family", accent: "orange" },
];

const GOAL_OPTIONS = [
  { label: "Weight Loss", accent: "blue" },
  { label: "Improve Fitness & Strength", accent: "green" },
  { label: "Better Nutrition", accent: "pink" },
  { label: "Build Healthy Family Habits", accent: "orange" },
  { label: "Overall Family Transformation", accent: "blue" },
];

// Selected state fills the pill with its own accent, so each family member
// keeps their colour across the page.
const ACCENT_CLASSES = {
  pink: "hover:border-primary-pink peer-checked:border-primary-pink peer-checked:bg-primary-pink peer-checked:text-text peer-focus-visible:outline-primary-pink",
  blue: "hover:border-primary-blue peer-checked:border-primary-blue peer-checked:bg-primary-blue peer-checked:text-white peer-focus-visible:outline-primary-blue",
  green: "hover:border-primary-green peer-checked:border-primary-green peer-checked:bg-primary-green peer-checked:text-white peer-focus-visible:outline-primary-green",
  orange: "hover:border-primary-orange peer-checked:border-primary-orange peer-checked:bg-primary-orange peer-checked:text-white peer-focus-visible:outline-primary-orange",
};

const DOT_CLASSES = {
  pink: "bg-primary-pink",
  blue: "bg-primary-blue",
  green: "bg-primary-green",
  orange: "bg-primary-orange",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-text/15 bg-white px-4 py-3 text-base text-text placeholder:text-text/35 outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/25";

function ChoicePill({ type, name, value, required, accent = "orange" }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} required={required} className="peer sr-only" />
      <span
        className={`inline-flex select-none items-center rounded-full border border-text/15 bg-white px-4 py-2 text-sm font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${ACCENT_CLASSES[accent]}`}
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

// A row in the contact list. Email and phone are links; hours are plain text.
function ContactRow({ icon: Icon, label, accent, href, value, note }) {
  const body = (
    <>
      <span className="flex items-center gap-2 text-sm font-semibold text-text/55">
        <span className={`h-2 w-2 rounded-full ${DOT_CLASSES[accent]}`} />
        {label}
      </span>
      <span className="mt-1 flex items-center justify-between gap-3">
        <span className="break-all text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
          {value}
        </span>
        {href && (
          <ArrowUpRight
            size={20}
            className="shrink-0 text-text/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-orange"
          />
        )}
        {!href && Icon && <Icon size={20} className="shrink-0 text-text/40" />}
      </span>
      {note && <span className="mt-1 block text-sm text-text/55">{note}</span>}
    </>
  );

  return href ? (
    <a href={href} className="group block border-t border-text/12 py-5 first:border-t-0 first:pt-0">
      {body}
    </a>
  ) : (
    <div className="block border-t border-text/12 py-5">{body}</div>
  );
}

function FormGroup({ title, hint, children }) {
  return (
    <div className="border-t border-text/10 pt-6">
      <h3 className="text-base font-semibold">{title}</h3>
      {hint && <p className="mt-0.5 text-sm text-text/55">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Keys must match the sheet headers exactly:
    // date | name | email | joinee | goal | height | weight | message
    const params = new URLSearchParams({
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      joinee: fd.get("who") || "",
      goal: fd.getAll("goals").join(", "),
      height: fd.get("height") || "",
      weight: fd.get("weight") || "",
      message: fd.get("message") || "",
    });

    setSending(true);
    setError("");
    try {
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        /* non-JSON reply */
      }
      if (data.result !== "success") throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Your message did not send. Check your connection and try again, or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg font-inter text-text">
      <section className="px-5 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-40 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {/* Intro */}
          <h1 className="font-manrope max-w-4xl text-[11.5vw] font-bold leading-[.92] tracking-tight sm:text-6xl lg:text-[5.5rem]">
            We’d love to hear from you
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text/70 sm:mt-6 sm:text-xl">
            Questions about our fitness programs for moms, dads, or kids, membership options,
            or which plan fits your family’s schedule? Send us a message and a real member of
            our team, usually a parent herself or himself, will get back to you within 24
            hours.
          </p>

          <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-5 lg:items-start lg:gap-14">
            {/* Contact details: open list on the page background, no card */}
            <aside className="lg:sticky lg:top-28 lg:col-span-2">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact details</h2>

              <div className="mt-6 flex flex-col">
                <ContactRow
                  accent="pink"
                  label="Email"
                  href={`mailto:${CONTACT.email}`}
                  value={CONTACT.email}
                />
                <ContactRow
                  accent="blue"
                  label="Phone"
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  value={CONTACT.phone}
                />
                <ContactRow
                  accent="green"
                  label="Hours"
                  icon={Clock}
                  value={CONTACT.hours}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-text/12 pt-6">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary-green px-4 py-1.5 text-sm font-semibold text-text transition-colors hover:bg-primary-green hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary-blue px-4 py-1.5 text-sm font-semibold text-text transition-colors hover:bg-primary-blue hover:text-white"
                >
                  Facebook
                </a>
              </div>

              <div className="mt-8 flex w-fit items-center gap-2 rounded-full bg-primary-green/15 px-3.5 py-1.5 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-green opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-green" />
                </span>
                We reply within 24 hours
              </div>
            </aside>

            {/* Form card: white, with a four-colour edge that echoes the family palette */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-3xl border border-text/10 bg-primary-white shadow-[0_25px_60px_-35px_rgba(22,22,22,0.25)]">
                <div className="flex h-1.5 w-full" aria-hidden="true">
                  <span className="flex-1 bg-primary-pink" />
                  <span className="flex-1 bg-primary-blue" />
                  <span className="flex-1 bg-primary-green" />
                  <span className="flex-1 bg-primary-orange" />
                </div>

                <div className="p-5 sm:p-8 lg:p-10">
                  {submitted ? (
                    <div role="status" className="flex flex-col items-start gap-4 py-6 sm:py-10">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-green text-white">
                        <Check size={26} strokeWidth={3} />
                      </span>
                      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Message sent
                      </h2>
                      <p className="max-w-md text-base leading-relaxed text-text/70 sm:text-lg">
                        Thanks for reaching out. A member of our team will get back to you
                        within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-2 rounded-full border border-primary-green px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-green hover:text-white"
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
                        <Field label="Email address" htmlFor="email" required>
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

                      <FormGroup title="Who’s joining?">
                        <fieldset>
                          <legend className="sr-only">Who’s joining (required)</legend>
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
                      </FormGroup>

                      <FormGroup title="What would you like to achieve?" hint="Pick as many as you like.">
                        <fieldset>
                          <legend className="sr-only">Goals</legend>
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
                      </FormGroup>

                      <FormGroup title="A little about you" hint="Optional. It helps us suggest the right plan.">
                        <div className="flex flex-col gap-6">
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

                          <Field label="Anything else you’d like us to know?" htmlFor="message">
                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              placeholder="Tell us about your family’s schedule, goals, or questions."
                              className={`${INPUT_CLASS} resize-y`}
                            />
                          </Field>
                        </div>
                      </FormGroup>

                      {error && (
                        <p role="alert" className="text-sm font-semibold text-red-600">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex w-full items-center justify-between gap-4 rounded-full bg-primary-orange py-3.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:justify-center"
                      >
                        {sending ? "Sending..." : "Send message"}
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
                          <ArrowRight size={18} />
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}