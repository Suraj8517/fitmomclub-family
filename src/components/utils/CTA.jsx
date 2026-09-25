import { useEffect, useRef, useState, useId } from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, FileMinusCorner } from "lucide-react";
import fmclogo from "../../assets/home/fmc.png"
const NAV = [

  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact", to: "/contact-us" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M4.5 9h3v10.5h-3V9Zm1.5-4.8a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM10 9h2.9v1.5c.5-.9 1.6-1.7 3.2-1.7 3.1 0 3.9 2 3.9 4.7v6h-3v-5.3c0-1.4-.2-2.7-1.8-2.7s-2.1 1.1-2.1 2.7v5.3H10V9Z"
      />
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M16.5 3h-3v11.8a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.2a5.6 5.6 0 1 0 4.8 5.6V8.9a6.5 6.5 0 0 0 3.8 1.2V7.1A3.8 3.8 0 0 1 16.5 3Z"
      />
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <path
        fill="currentColor"
        d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z"
      />
    ),
  },
];

const FALLBACK_COLORS = ["#5FE0A0", "#4FA6F2", "#E39CEF", "#F1552B"];

const STAMP_LIFE_MS = 1200;
const SPAWN_DISTANCE = 220; // px the pointer must travel before the next stamp
const SPAWN_COOLDOWN_MS = 80; // minimum time between stamps, even on fast swipes
const MAX_STAMPS = 8;
// Each stamp drifts a random distance in this range (px) along the pointer's
// direction of travel, so the trail feels loose and organic rather than a
// uniform, fixed nudge.
const DRIFT_DISTANCE_MIN = 160;
const DRIFT_DISTANCE_MAX = 380;

function HypeBadge({ logo, color }) {
  if (logo?.src) {
    return (
      <img
        src={logo.src}
        alt={logo.alt || ""}
        className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
        draggable={false}
      />
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-2xl border-[5px] bg-white px-1 py-1 shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-1 rounded-xl bg-[#141414] px-3 py-1.5 whitespace-nowrap">
        <span className="text-base font-black italic leading-none tracking-tight" style={{ color }}>
          FMC
        </span>
        <span className="text-base font-black italic leading-none tracking-tight text-white">
          FAMILY
        </span>
      </div>
    </div>
  );
}

// Pointer-trail hook — attaches to whatever container ref you give it and
// spawns stamps at the pointer position as it moves. Each stamp remembers
// the pointer's travel direction at spawn time so it can drift that way
// on its way out. It knows nothing about the curved slab; visibility is
// handled purely by paint order in the JSX.
function useHypeTrail(containerRef, { logos, enabled }) {
  const [stamps, setStamps] = useState([]);
  const rawPointRef = useRef(null);
  const distanceSinceSpawnRef = useRef(Infinity);
  const lastSpawnTimeRef = useRef(0);
  const colorIndexRef = useRef(0);
  const frameRef = useRef(null);
  const timeoutsRef = useRef(new Map());
  // Normalized pointer travel direction, updated every move. Defaults to
  // "straight up" so the very first stamp (before any movement) still has
  // a sensible drift if it somehow spawns early.
  const dirRef = useRef({ x: 0, y: -1 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return undefined;

    const palette = logos && logos.length > 0 ? logos : FALLBACK_COLORS;

    const spawn = (x, y) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const paletteEntry = palette[colorIndexRef.current % palette.length];
      colorIndexRef.current += 1;

      const dir = dirRef.current;
      // Vary how FAR each stamp drifts (not just the direction) so the
      // trail reads as loose and free-floating rather than mechanical.
      const driftDistance =
        DRIFT_DISTANCE_MIN + Math.random() * (DRIFT_DISTANCE_MAX - DRIFT_DISTANCE_MIN);

      const stamp = {
        id,
        x,
        y,
        rotate: Math.random() * 22 - 10,
        // Drift vector for the pop-out exit, in px, pointing the same way
        // the pointer was traveling when this stamp spawned.
        driftX: dir.x * driftDistance,
        driftY: dir.y * driftDistance,
        logo: paletteEntry?.src ? paletteEntry : null,
        color: paletteEntry?.src ? undefined : paletteEntry,
      };

      setStamps((prev) => {
        const next = [...prev, stamp];
        return next.length > MAX_STAMPS ? next.slice(next.length - MAX_STAMPS) : next;
      });

      const t = setTimeout(() => {
        setStamps((prev) => prev.filter((s) => s.id !== id));
        timeoutsRef.current.delete(id);
      }, STAMP_LIFE_MS);
      timeoutsRef.current.set(id, t);
    };

    const handlePointerMove = (event) => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const raw = rawPointRef.current;
        if (raw) {
          const dx = x - raw.x;
          const dy = y - raw.y;
          const dist = Math.hypot(dx, dy);
          distanceSinceSpawnRef.current += dist;
          // Only update the drift direction on meaningful movement so a
          // stationary jittery mouse doesn't reset it to (0,0).
          if (dist > 0.5) {
            dirRef.current = { x: dx / dist, y: dy / dist };
          }
        }
        rawPointRef.current = { x, y };

        const now = performance.now();
        const sinceLastSpawn = now - lastSpawnTimeRef.current;
        const traveledEnough = distanceSinceSpawnRef.current >= SPAWN_DISTANCE;

        if (traveledEnough && sinceLastSpawn >= SPAWN_COOLDOWN_MS) {
          distanceSinceSpawnRef.current = 0;
          lastSpawnTimeRef.current = now;
          spawn(x, y);
        }
      });
    };

    container.addEventListener("pointermove", handlePointerMove);
    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, [containerRef, logos, enabled]);

  return stamps;
}

// Wordmark logo, bottom-left, overflowing past the section edge. Pass
// `logoSrc` to swap in your own logo image instead — the markup falls back
// to it automatically and the wordmark is skipped. `to` routes via React
// Router; if omitted it falls back to a plain `href` anchor.
function BrandLogo({ src, alt = "Logo", to, href = "#" }) {
  const Wrapper = to ? Link : "a";
  const wrapperProps = to ? { to } : { href };

  if (src) {
    return (
      <Wrapper
        {...wrapperProps}
        aria-label={alt}
        className="-mb-6 inline-flex h-16 w-40 items-end justify-start sm:h-20 sm:w-48 md:-mb-18 md:h-24 md:w-56 lg:h-68 lg:w-104 -rotate-1"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-auto max-w-full object-contain object-left"
          draggable={false}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...wrapperProps}
      aria-label={alt}
      className="-mb-6 inline-flex overflow-hidden rounded-t-2xl border-[5px] border-black bg-[#f4efe6] font-['Anton',Impact,sans-serif] text-[clamp(3.4rem,9vw,7.6rem)] uppercase leading-[0.9] tracking-tight sm:-mb-8 sm:rounded-t-3xl sm:border-[6px] md:-mb-9 lg:border-[7px]"
    >
      <b className="flex items-center bg-black pl-[0.14em] pr-[0.1em] pt-[0.06em] font-normal not-italic text-white">
       FMC
      </b>
      <em
        className="flex items-center bg-white pl-[0.06em] pr-[0.16em] pt-[0.06em] not-italic text-transparent [-webkit-text-stroke:2.5px_#000] sm:[-webkit-text-stroke:3px_#000]"
      >
        FAMILY
      </em>
    </Wrapper>
  );
}

export default function FooterWithCta({
  heading = "Start Your Family Fitness Journey!",
  body = "Build strength, energy, and connection together with simple family-friendly fitness that fits your everyday life.",
  logos = [],
  primaryCta = { label: "Programs", href: "#" },
  secondaryCta = { label: "Join Now", href: "mailto:info@gethyped.nl" },
  contactHref = "mailto:hallo@fitmomclub.nl",
  badgeInitials = "FMC",
  badgeTagline = "GET RESULTS • FMC FAMILY • GET STRONGER •",
  logoSrc = fmclogo,
  logoAlt = "Brand logo",
  logoTo = "/",
  logoHref,
  // Content used only by the compact mobile/tablet layout below `xl`.
  mobileCtaLabel = "Get Hyped! Neem contact op",
  legalLinks = [
    { label: "Algemene voorwaarden", href: "#" },
    { label: "Privacyverklaring", href: "#" },
  ],
  credit = "© Design by Dylan",
}) {
  const rootRef = useRef(null);
  const styleId = useId();
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionEnabled(!query.matches);
    const onChange = () => setMotionEnabled(!query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // One trail, tracked across the entire combined section. Only visible on
  // pointer-driven (xl+) layouts in practice, since it's a hover effect —
  // harmless to keep mounted everywhere.
  const stamps = useHypeTrail(rootRef, { logos, enabled: motionEnabled });

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-[#FBF3EA] font-['Inter',system-ui,sans-serif] text-[#161616]"
    >
      <style>{`
        @keyframes hypeStampIn-${styleId} {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35) rotate(var(--hype-rotate));
          }
          22% {
            opacity: 1;
            transform: translate(calc(-50% + var(--hype-dx) * 0.06), calc(-50% + var(--hype-dy) * 0.06))
              scale(1.15) rotate(var(--hype-rotate));
          }
          34% {
            transform: translate(calc(-50% + var(--hype-dx) * 0.14), calc(-50% + var(--hype-dy) * 0.14))
              scale(0.94) rotate(var(--hype-rotate));
          }
          45% {
            opacity: 1;
            transform: translate(calc(-50% + var(--hype-dx) * 0.22), calc(-50% + var(--hype-dy) * 0.22))
              scale(1) rotate(var(--hype-rotate));
          }
          70% {
            opacity: 1;
            transform: translate(calc(-50% + var(--hype-dx) * 0.55), calc(-50% + var(--hype-dy) * 0.55))
              scale(1) rotate(var(--hype-rotate));
          }
          88% {
            opacity: 0.85;
            transform: translate(calc(-50% + var(--hype-dx) * 0.82), calc(-50% + var(--hype-dy) * 0.82))
              scale(0.75) rotate(calc(var(--hype-rotate) + 6deg));
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--hype-dx)), calc(-50% + var(--hype-dy))) scale(0.3)
              rotate(calc(var(--hype-rotate) + 12deg));
          }
        }
      `}</style>

      {/*
        Trail layer — sits at the very back of the stacking order (z-0),
        BEFORE the curved slab in the DOM. Wherever the opaque slab paints
        on top of it later, the stamps are simply hidden underneath — no
        manual geometry/hit-testing required.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            className="absolute h-14 w-36 sm:h-16 sm:w-40 md:h-20 md:w-48"
            style={{
              left: stamp.x,
              top: stamp.y,
              "--hype-rotate": `${stamp.rotate}deg`,
              // Direction (in px) this stamp drifts as it pops out, matching
              // the pointer's travel direction at spawn time.
              "--hype-dx": `${stamp.driftX}px`,
              "--hype-dy": `${stamp.driftY}px`,
              animation: `hypeStampIn-${styleId} ${STAMP_LIFE_MS}ms ease-out forwards`,
            }}
          >
            <HypeBadge logo={stamp.logo} color={stamp.color} />
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* MOBILE / TABLET LAYOUT — shown below the `xl` breakpoint.      */}
      {/* Matches the compact, stacked design: big logo, single orange   */}
      {/* CTA, nav pills, socials, contact/address, then legal footer.   */}
      {/* ============================================================ */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-5 pb-10 pt-9 text-center xl:hidden sm:gap-7 sm:px-8 sm:pb-12 sm:pt-11 md:mx-auto md:max-w-2xl md:gap-8 md:px-10 md:pb-14 md:pt-14">
        {/* Logo */}
        <div className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px]">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-auto w-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.15)]"
            draggable={false}
          />
        </div>

        {/* CTA button */}
        <a
          href={contactHref}
          className="flex items-center gap-3 rounded-full bg-[#F1552B] py-3 pl-6 pr-2 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:py-3.5 sm:pl-7 sm:text-base md:text-lg"
        >
          {mobileCtaLabel}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 sm:h-10 sm:w-10">
            <Flame className="h-4 w-4 text-white sm:h-[18px] sm:w-[18px]" />
          </span>
        </a>

        {/* Nav pills */}
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5"
        >
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="rounded-[10px] bg-white px-4 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] sm:px-5 sm:py-3 sm:text-base"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="grid h-11 w-11 place-items-center rounded-full bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] sm:h-12 sm:w-12"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-[22px] sm:w-[22px]">
                {s.icon}
              </svg>
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1 text-sm leading-relaxed sm:text-base">
          <a href="mailto:info@gethyped.nl" className="hover:underline">
            info@gethyped.nl
          </a>
          <a href="tel:+31631328354" className="hover:underline">
            +31 6 3132 8354
          </a>
        </div>

        {/* Address */}
        <p className="text-sm leading-relaxed sm:text-base">
          Beltrumsestraat 6,
          <br />
          7141 AL Groenlo
        </p>

        {/* Legal + credits */}
        <div className="mt-2 flex flex-col items-center gap-1.5 text-xs text-[#5b5750] sm:text-sm">
          {legalLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:underline">
              {l.label}
            </a>
          ))}
          <span className="mt-1.5">© {new Date().getFullYear()} Get Hyped</span>
          <span>{credit}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP LAYOUT — unchanged design, shown from `xl` up.         */}
      {/* ============================================================ */}
      <div className="hidden xl:block">
        {/* decorative blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-40px] top-10 z-[1] h-64 w-[60%] rounded-[50%] bg-black/[0.04] blur-2xl"
        />

        {/*
          Rotating contact badge — pinned to the TOP-RIGHT corner of the
          section at every breakpoint (absolute, not in normal flow), so it
          sits above and to the right of the headline exactly like a stamp.
        */}
        <a
          href={contactHref}
          aria-label="Neem contact op"
          className="group absolute right-4 top-4 z-30 flex h-24 w-24 items-center justify-center sm:right-6 sm:top-6 sm:h-32 sm:w-32 md:right-8 md:top-8 md:h-36 md:w-36 lg:right-[4vw] lg:top-10 lg:h-40 lg:w-40"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite]">
            <defs>
              <path id={`badge-circle-${styleId}`} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <circle cx="50" cy="50" r="49" fill="#E7B4F2" />
            <text fontSize="7.2" fontWeight="700" letterSpacing="1.5" fill="#141414">
              <textPath href={`#badge-circle-${styleId}`}>{badgeTagline}</textPath>
            </text>
          </svg>
          <span className="relative rounded-full bg-[#141414] px-2.5 py-1.5 text-base font-black text-white sm:px-3.5 sm:text-xl md:text-2xl">
            {badgeInitials}
          </span>
        </a>

        {/* ---------- CTA content (trail is visible around/behind this) ---------- */}
        <div className="relative z-20 px-6 pb-10 pt-16 text-left sm:px-10 sm:pt-20 md:pt-24 lg:px-[4vw] lg:pt-28">
          <h2 className="max-w-4xl font-['Anton',Impact,sans-serif] text-[2.6rem] font-normal uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {heading}
          </h2>

          {body ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#161616]/70 sm:mt-5 sm:text-base lg:text-lg">
              {body}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <a
              href={secondaryCta.href}
              className="flex items-center gap-3 rounded-full border-2 border-black bg-white pl-4 pr-1.5 py-1.5 text-xs font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 sm:pl-5 sm:text-sm lg:text-base"
            >
              {secondaryCta.label}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141414] sm:h-8 sm:w-8">
                <ArrowRight className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
              </span>
            </a>

            <a
              href={primaryCta.href}
              className="flex items-center gap-2 rounded-full bg-[#F1552B] px-5 py-3 text-xs font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 sm:px-6 sm:py-3.5 sm:text-sm lg:text-base"
            >
              {primaryCta.label}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 sm:h-7 sm:w-7">
                <Flame className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" />
              </span>
            </a>
          </div>
        </div>

        {/* ---------- Footer / curved section ---------- */}
        <div className="relative px-5 pb-8 pt-[2px] sm:px-[3vw] sm:pb-9 lg:pt-[1px]">
          {/*
            Tilted tan slab — z-10, painted AFTER the trail layer above, so it
            occludes any stamps spawned in this region. Its own content
            (logo, nav, socials, contact) goes on top at z-20/relative so the
            trail never shows through inside the curved area.
          */}
          <div className="absolute -bottom-[400px] left-[2.2%] right-[2.2%] -top-[10px] z-10 origin-bottom-left -skew-y-[3deg] rounded-t-[26px] bg-[#E9E2D6] sm:top-[0px] sm:-skew-y-[0deg] sm:rounded-t-[34px] lg:top-[120px] lg:-skew-y-[10deg]" />

          <div className="relative z-20 grid max-w-[1600px] items-end gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-[1fr_minmax(0,400px)_220px]">
            {/* logo */}
            <div className="order-3 md:order-1 lg:order-none flex items-end self-end justify-start">
              <BrandLogo
                src={logoSrc}
                alt={logoAlt}
                to={logoHref ? undefined : logoTo}
                href={logoHref}
              />
            </div>

            {/* nav + socials + credits */}
            <div className="order-2 flex flex-col gap-5 sm:gap-6 md:order-2 lg:order-none">
              <nav aria-label="Footer" className="xl:flex flex-wrap gap-2 sm:gap-2.5 hidden">
                {NAV.map((n) => (
                  <Link
                    key={n.label}
                    to={n.to}
                    className="rounded-[10px] bg-white px-3 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] sm:px-3.5 sm:py-3 sm:text-base"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <strong className="mr-2 text-base font-semibold tracking-tight sm:text-[1.15rem]">
                  Follow us
                </strong>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] sm:h-12 sm:w-12"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]">
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap justify-between gap-3 text-xs text-[#5b5750] sm:mt-4 sm:text-[0.86rem]">
                <span>© 2026 Get Hyped</span>
              </div>
            </div>

            {/* contact */}
            <div id="contact" className="relative order-1 md:order-3 lg:order-none  md:col-span-2 lg:col-span-1">
              <h3 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">Contact</h3>
              <p className="mb-5 text-sm leading-normal sm:mb-6 sm:text-[0.98rem]">
                <a href="mailto:info@gethyped.nl">info@gethyped.nl</a>
                <br />
                <a href="tel:+31631328354">+31 6 3132 8354</a>
              </p>
              <h3 className="mb-2 text-lg font-semibold tracking-tight sm:text-xl">Adres</h3>
              <p className="mb-5 text-sm leading-normal sm:mb-6 sm:text-[0.98rem]">
                Beltrumsestraat 6,
                <br />
                7141 AL Groenlo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}