import { useState, useRef, useEffect } from "react";
import { Clock, ArrowRight, ArrowUpRight, Check, Mail, Phone, AlertCircle } from "lucide-react";


const SHEET_URL =
  import.meta.env?.VITE_CONTACT_FORM_URL

// TODO: replace these placeholders with your real details.
const CONTACT = {
  email: "fitmomfamily@gmail.com",
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

/* ------------------------------------------------------------------ */
/* Validation config                                                   */
/* ------------------------------------------------------------------ */
const REQUEST_TIMEOUT_MS = 30000;
const MIN_SECONDS_BEFORE_SUBMIT = 3; // bots submit instantly; humans don't

// Keep in sync with the limits enforced in your Apps Script (server is the authority)
const MAX = { name: 100, email: 254, height: 20, weight: 20, message: 2000 };
const FIELD_ORDER = ["name", "email", "who", "goals", "height", "weight", "message"];

const PERSON_NAME_RX = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’\-]*$/u;
// Safe subset only: no quotes, =, {, |, } etc. in the local part (blocks injection payloads).
const EMAIL_RX =
  /^[A-Za-z0-9._%+\-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
// Spreadsheet formula injection: a cell starting with these is executed as a formula.
const FORMULA_START_RX = /^[=+\-@\t\r]/;
// Control chars (except \n and \t), bidi overrides and BOM. ZWJ/ZWNJ are kept for Indic scripts.
const STRIP_RX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const sanitize = (v) => String(v ?? "").normalize("NFC").replace(STRIP_RX, "").trim();

// Allowlists: only these exact values are ever sent, even if the DOM is tampered with.
const WHO_ALLOWED = ["Mom", "Dad", "Kids", "Whole Family"];
const GOALS_ALLOWED = [
  "Weight Loss",
  "Improve Fitness & Strength",
  "Better Nutrition",
  "Build Healthy Family Habits",
  "Overall Family Transformation",
];

// Letters (any script), digits, whitespace and  . , ! ? ' ’ " “ ” - – — ( ) : ; / & @
const MESSAGE_TEXT_RX = /^[\p{L}\p{M}\p{N}\s.,!?'’"“”\-–—():;\/&@\u200C\u200D]+$/u;
const MESSAGE_MIN_LETTERS = 5;
const countLetters = (s) => (s.match(/\p{L}/gu) || []).length;

// Height: "168 cm", "5'6\"", "5 ft 6 in", "5ft"
const HEIGHT_CM_RX = /^(\d{2,3}(?:\.\d)?)\s?cm$/i;
const HEIGHT_FT_RX = /^(\d)\s?(?:ft|feet|'|’)\s?(?:(\d{1,2})\s?(?:in|inches|"|”|'')?)?$/i;
// Weight: "68 kg", "150 lb", "150 lbs"
const WEIGHT_RX = /^(\d{2,3}(?:\.\d)?)\s?(kg|lb|lbs)$/i;

const validators = {
  name: (v) => {
    const s = sanitize(v);
    if (s.length < 2) return "Name is required";
    if (FORMULA_START_RX.test(s)) return "Name can't start with = + - or @";
    return PERSON_NAME_RX.test(s) ? "" : "Name contains unsupported characters";
  },
  email: (v) => {
    const s = sanitize(v);
    if (!s) return "Email is required";
    return s.length <= 254 && EMAIL_RX.test(s) && !s.includes("..") ? "" : "Enter a valid email";
  },
  who: (v) => (!v ? "Please choose who is joining" : WHO_ALLOWED.includes(v) ? "" : "Invalid selection"),
  goals: (v) =>
    v.length === 0
      ? "Pick at least one goal"
      : v.every((g) => GOALS_ALLOWED.includes(g))
      ? ""
      : "Invalid selection",
  height: (v) => {
    const s = sanitize(v);
    if (!s) return ""; // optional
    const cm = s.match(HEIGHT_CM_RX);
    if (cm) {
      const n = parseFloat(cm[1]);
      return n >= 50 && n <= 250 ? "" : "Height must be between 50 and 250 cm";
    }
    const ft = s.match(HEIGHT_FT_RX);
    if (ft) {
      const feet = parseInt(ft[1], 10);
      const inches = ft[2] ? parseInt(ft[2], 10) : 0;
      return feet >= 2 && feet <= 8 && inches <= 11 ? "" : "Enter a realistic height";
    }
    return `Use a format like 5'6" or 168 cm`;
  },
  weight: (v) => {
    const s = sanitize(v);
    if (!s) return ""; // optional
    const m = s.match(WEIGHT_RX);
    if (!m) return "Use a format like 150 lb or 68 kg";
    const n = parseFloat(m[1]);
    const kg = m[2].toLowerCase() === "kg" ? n : n * 0.4536;
    return kg >= 10 && kg <= 300 ? "" : "Enter a realistic weight";
  },
  message: (v) => {
    const s = sanitize(v);
    if (!s) return ""; // optional
    if (FORMULA_START_RX.test(s)) return "Message can't start with = + - or @";
    if (s.length < 10) return "Minimum 10 characters, or leave it empty";
    if (!MESSAGE_TEXT_RX.test(s)) return "Special characters are not allowed in the message";
    if (countLetters(s) < MESSAGE_MIN_LETTERS) return "Please write your message in words";
    return "";
  },
};

const GENERIC_ERROR = "Submission failed. Please try again.";
const UNCONFIRMED_ERROR =
  "We couldn't confirm that your message was received. Please check your connection and try again, or email us directly.";
const SERVER_ERROR_MESSAGES = {
  RATE_LIMITED: "Too many submissions. Please try again later.",
  BUSY: "We're receiving a lot of requests right now. Please try again in a moment.",
};

function newSubmissionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  const b = new Uint8Array(16);
  window.crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ */
/* Styling                                                             */
/* ------------------------------------------------------------------ */
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

const INPUT_BASE =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-text placeholder:text-text/35 outline-none transition-colors focus:ring-2";
const inputClass = (hasError) =>
  `${INPUT_BASE} ${
    hasError
      ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-200"
      : "border-text/15 focus:border-primary-orange focus:ring-primary-orange/25"
  }`;

/* ------------------------------------------------------------------ */
/* UI pieces                                                           */
/* ------------------------------------------------------------------ */
function Err({ id, msg }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertCircle size={12} aria-hidden="true" />
      {msg}
    </p>
  );
}

function ChoicePill({ type, name, value, checked, onChange, onBlur, accent = "orange", invalid }) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
      />
      <span
        className={`inline-flex select-none items-center rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
          invalid ? "border-red-300" : "border-text/15"
        } ${ACCENT_CLASSES[accent]}`}
      >
        {value}
      </span>
    </label>
  );
}

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="ml-0.5 text-primary-orange">*</span>}
      </label>
      {children}
      <Err id={`cf-${htmlFor}-error`} msg={error} />
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

function FormGroup({ title, hint, error, errorId, children }) {
  return (
    <div className="border-t border-text/10 pt-6">
      <h3 className="text-base font-semibold">{title}</h3>
      {hint && <p className="mt-0.5 text-sm text-text/55">{hint}</p>}
      <div className="mt-4">{children}</div>
      <Err id={errorId} msg={error} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ContactPage() {
  const [fd, setFd] = useState({
    name: "",
    email: "",
    who: "",
    goals: [],
    height: "",
    weight: "",
    message: "",
    fax_number: "", // honeypot: real users never see or fill this
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef(null);
  const submittingRef = useRef(false); // blocks double-clicks before state updates
  const submissionIdRef = useRef(null); // idempotency key, reused on retries until confirmed
  const loadedAtRef = useRef(Date.now());
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadedAtRef.current = Date.now();
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const validate = (name, value) => validators[name]?.(value) ?? "";

  const setField = (name, value) => {
    setFd((p) => ({ ...p, [name]: value }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const onTextChange = (e) => setField(e.target.name, e.target.value);

  const onTextBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const onWhoChange = (e) => {
    setField("who", e.target.value);
    setTouched((p) => ({ ...p, who: true }));
    setErrors((p) => ({ ...p, who: "" }));
  };

  const onGoalToggle = (e) => {
    const { value, checked } = e.target;
    const next = checked ? [...fd.goals, value] : fd.goals.filter((g) => g !== value);
    setFd((p) => ({ ...p, goals: next }));
    setTouched((p) => ({ ...p, goals: true }));
    setErrors((p) => ({ ...p, goals: validate("goals", next) }));
  };

  const focusField = (name) => {
    const form = formRef.current;
    if (!form) return;
    if (name === "who" || name === "goals") {
      form.querySelector(`input[name="${name}"]`)?.focus();
    } else {
      form.elements.namedItem(name)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return; // already sending
    setFormError("");

    // Validate everything
    const allT = FIELD_ORDER.reduce((a, k) => ({ ...a, [k]: true }), {});
    const allE = FIELD_ORDER.reduce((a, k) => ({ ...a, [k]: validate(k, fd[k]) }), {});
    setTouched(allT);
    setErrors(allE);
    const firstBad = FIELD_ORDER.find((k) => allE[k]);
    if (firstBad) {
      setFormError("Please correct the highlighted fields.");
      focusField(firstBad);
      return;
    }

    // Anti-bot: filled honeypot or impossibly fast submit. Pretend success, send nothing.
    const tooFast = Date.now() - loadedAtRef.current < MIN_SECONDS_BEFORE_SUBMIT * 1000;
    if (fd.fax_number || tooFast) {
      if (fd.fax_number) {
        setSubmitted(true);
      } else {
        setFormError("Please take a moment to review your message, then send again.");
      }
      return;
    }

    if (!SHEET_URL) {
      setFormError("This form is not configured correctly. Please email us instead.");
      return;
    }

    submittingRef.current = true;
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      if (!submissionIdRef.current) submissionIdRef.current = newSubmissionId();
      const submissionId = submissionIdRef.current;

      // Keys must match the sheet headers exactly:
      // date | name | email | joinee | goal | height | weight | message
      const params = new URLSearchParams({
        name: sanitize(fd.name).replace(/\s+/g, " "),
        email: sanitize(fd.email).toLowerCase(),
        joinee: WHO_ALLOWED.includes(fd.who) ? fd.who : "",
        goal: fd.goals.filter((g) => GOALS_ALLOWED.includes(g)).join(", "),
        height: sanitize(fd.height),
        weight: sanitize(fd.weight),
        message: sanitize(fd.message),
        fax_number: fd.fax_number,
        submissionId,
      });

      // Content-Type is CORS-safelisted, so there is no preflight (Apps Script can't answer OPTIONS).
      const res = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "omit",
        cache: "no-store",
        signal: controller.signal,
        body: params.toString(),
      });

      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (!mountedRef.current) return;

      // Accepts the old reply { result: "success" } and the stricter { ok: true, submissionId }
      const confirmed =
        body &&
        ((body.ok === true && (!body.submissionId || body.submissionId === submissionId)) ||
          body.result === "success");

      if (confirmed) {
        submissionIdRef.current = null;
        setSubmitted(true);
        return;
      }

      if (body && (body.ok === false || body.result === "error")) {
        setFormError(SERVER_ERROR_MESSAGES[body.code] ?? GENERIC_ERROR);
        return;
      }

      // 200 but no valid receipt (HTML error page, truncated body...)
      setFormError(UNCONFIRMED_ERROR);
    } catch (err) {
      // Network failure, timeout/abort, CORS-blocked error page. We can't know if it was stored.
      console.error("Contact form submission error:", err?.name || "error"); // no form data logged
      if (mountedRef.current) setFormError(UNCONFIRMED_ERROR);
    } finally {
      clearTimeout(timer);
      submittingRef.current = false;
      if (mountedRef.current) setSending(false);
    }
  };

  const resetForm = () => {
    setFd({ name: "", email: "", who: "", goals: [], height: "", weight: "", message: "", fax_number: "" });
    setTouched({});
    setErrors({});
    setFormError("");
    submissionIdRef.current = null;
    loadedAtRef.current = Date.now();
    setSubmitted(false);
  };

  // Shared props + a11y wiring for text inputs
  const textProps = (name) => {
    const msg = touched[name] && errors[name];
    return {
      id: name,
      name,
      value: fd[name],
      onChange: onTextChange,
      onBlur: onTextBlur,
      maxLength: MAX[name],
      className: inputClass(!!msg),
      "aria-invalid": !!msg,
      "aria-describedby": msg ? `cf-${name}-error` : undefined,
    };
  };
  const errFor = (name) => touched[name] && errors[name];

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
            {/* Contact details */}
            <aside className="lg:sticky lg:top-28 lg:col-span-2">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact details</h2>

              <div className="mt-6 flex flex-col">
                <ContactRow accent="pink" label="Email" href={`mailto:${CONTACT.email}`} value={CONTACT.email} />
                
                <ContactRow accent="green" label="Hours" icon={Clock} value={CONTACT.hours} />
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

            {/* Form card */}
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
                      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Message sent</h2>
                      <p className="max-w-md text-base leading-relaxed text-text/70 sm:text-lg">
                        Thanks for reaching out. A member of our team will get back to you
                        within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="mt-2 rounded-full border border-primary-green px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-primary-green hover:text-white"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      noValidate
                      aria-busy={sending}
                      className="flex flex-col gap-6"
                    >
                      {/* Honeypot: off-screen, not focusable, hidden from assistive tech. */}
                      <div
                        aria-hidden="true"
                        style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
                      >
                        <label>
                          Leave this field empty
                          <input
                            type="text"
                            name="fax_number"
                            value={fd.fax_number}
                            onChange={onTextChange}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>

                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Send us a message</h2>
                        <p className="mt-1 text-sm text-text/60">
                          Fields marked <span className="text-primary-orange">*</span> are required.
                        </p>
                      </div>

                      {formError && (
                        <div
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                        >
                          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                          {formError}
                        </div>
                      )}

                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Name" htmlFor="name" required error={errFor("name")}>
                          <input
                            {...textProps("name")}
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            aria-required="true"
                          />
                        </Field>
                        <Field label="Email address" htmlFor="email" required error={errFor("email")}>
                          <input
                            {...textProps("email")}
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-required="true"
                          />
                        </Field>
                      </div>

                      <FormGroup title="Who’s joining? *" error={errFor("who")} errorId="cf-who-error">
                        <fieldset aria-describedby={errFor("who") ? "cf-who-error" : undefined}>
                          <legend className="sr-only">Who’s joining (required)</legend>
                          <div className="flex flex-wrap gap-2">
                            {WHO_OPTIONS.map((opt) => (
                              <ChoicePill
                                key={opt.label}
                                type="radio"
                                name="who"
                                value={opt.label}
                                accent={opt.accent}
                                checked={fd.who === opt.label}
                                onChange={onWhoChange}
                                invalid={!!errFor("who")}
                              />
                            ))}
                          </div>
                        </fieldset>
                      </FormGroup>

                      <FormGroup
                        title="What would you like to achieve? *"
                        hint="Pick as many as you like."
                        error={errFor("goals")}
                        errorId="cf-goals-error"
                      >
                        <fieldset aria-describedby={errFor("goals") ? "cf-goals-error" : undefined}>
                          <legend className="sr-only">Goals (select at least one)</legend>
                          <div className="flex flex-wrap gap-2">
                            {GOAL_OPTIONS.map((opt) => (
                              <ChoicePill
                                key={opt.label}
                                type="checkbox"
                                name="goals"
                                value={opt.label}
                                accent={opt.accent}
                                checked={fd.goals.includes(opt.label)}
                                onChange={onGoalToggle}
                                invalid={!!errFor("goals")}
                              />
                            ))}
                          </div>
                        </fieldset>
                      </FormGroup>

                      <FormGroup title="A little about you" hint="Optional. It helps us suggest the right plan.">
                        <div className="flex flex-col gap-6">
                          <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <Field label="Height" htmlFor="height" error={errFor("height")}>
                              <input
                                {...textProps("height")}
                                type="text"
                                inputMode="text"
                                autoComplete="off"
                                placeholder={"5'6\" or 168 cm"}
                              />
                            </Field>
                            <Field label="Weight" htmlFor="weight" error={errFor("weight")}>
                              <input
                                {...textProps("weight")}
                                type="text"
                                inputMode="text"
                                autoComplete="off"
                                placeholder="150 lb or 68 kg"
                              />
                            </Field>
                          </div>

                          <Field
                            label="Anything else you’d like us to know?"
                            htmlFor="message"
                            error={errFor("message")}
                          >
                            <textarea
                              {...textProps("message")}
                              rows={4}
                              placeholder="Tell us about your family’s schedule, goals, or questions."
                              className={`${inputClass(!!errFor("message"))} resize-y`}
                            />
                            <p className="mt-1 text-right text-xs text-text/40">
                              {fd.message.length}/{MAX.message}
                            </p>
                          </Field>
                        </div>
                      </FormGroup>

                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex w-full items-center justify-between gap-4 rounded-full bg-primary-orange py-3.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-center"
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