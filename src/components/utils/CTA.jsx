import { useEffect, useRef, useState, useId } from "react";
import { Flame } from "lucide-react";
//import logo1 from "../../assets/home/logos/pinklogo.webp";
//import logo2 from "../../assets/home/logos/bluelogo.webp";
//import logo3 from "../../assets/home/logos/greenlogo.webp";
//import logo4 from "../../assets/home/logos/orangelogo.webp";


const FALLBACK_COLORS = ["#5FE0A0", "#4FA6F2", "#E39CEF", "#F1552B"];

const STAMP_LIFE_MS = 1300;
const SPAWN_DISTANCE = 220; // px the pointer must travel before the next stamp
const SPAWN_COOLDOWN_MS = 160; // minimum time between stamps, even on fast swipes
const MAX_STAMPS = 5;

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
  // Text-based placeholder, styled after the reference logo, used until
  // real logo files are wired in via the `logos` prop.
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

function useHypeTrail(sectionRef, { logos, enabled }) {
  const [stamps, setStamps] = useState([]);
  const rawPointRef = useRef(null); // last raw pointer position, updated on every move
  const distanceSinceSpawnRef = useRef(Infinity); // accumulated path length since the last stamp
  const lastSpawnTimeRef = useRef(0);
  const colorIndexRef = useRef(0);
  const frameRef = useRef(null);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled) return undefined;

    const palette = logos && logos.length > 0 ? logos : FALLBACK_COLORS;

    const spawn = (x, y) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const paletteEntry = palette[colorIndexRef.current % palette.length];
      colorIndexRef.current += 1;

      const stamp = {
        id,
        x,
        y,
        rotate: Math.random() * 22 - 10,
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
        const rect = section.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const raw = rawPointRef.current;
        if (raw) {
          distanceSinceSpawnRef.current += Math.hypot(x - raw.x, y - raw.y);
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

    section.addEventListener("pointermove", handlePointerMove);
    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, [sectionRef, logos, enabled]);

  return stamps;
}

export default function CtaHyped({
  heading = "Ready to Start?",
  body = "Join FitMom Club Family today and get your first family fitness program for free for 7 days. No pressure, no perfection, just progress, together.",
  logos = [
   
  ],
  primaryCta = { label: "Join FitMom Club Family Free", href: "#" },
  contactHref = "mailto:hallo@fitmomclub.nl",
  badgeInitials = "FMC",
  badgeTagline = "GET RESULTS • FMC FAMILY • GET STRONGER •",
}) {
  const sectionRef = useRef(null);
  const styleId = useId();
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionEnabled(!query.matches);
    const onChange = () => setMotionEnabled(!query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const stamps = useHypeTrail(sectionRef, { logos, enabled: motionEnabled });

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-bg px-5 py-24 sm:py-32"
    >
      {/* keyframes for the stamp pop-in / fade-out, scoped once per mount */}
      <style>{`
        @keyframes hypeStampIn-${styleId} {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(var(--hype-rotate)); }
          55% { opacity: 1; transform: translate(-50%, -50%) scale(1.06) rotate(var(--hype-rotate)); }
          70% { transform: translate(-50%, -50%) scale(1) rotate(var(--hype-rotate)); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 14px)) scale(0.96) rotate(var(--hype-rotate)); }
        }
      `}</style>

      {/* decorative blob, bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-[60%] rounded-[50%] bg-black/[0.04] blur-2xl"
      />

      {/* pointer trail layer — never intercepts clicks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            className="absolute h-16 w-40 sm:h-20 sm:w-48"
            style={{
              left: stamp.x,
              top: stamp.y,
              "--hype-rotate": `${stamp.rotate}deg`,
              animation: `hypeStampIn-${styleId} ${STAMP_LIFE_MS}ms ease-out forwards`,
            }}
          >
            <HypeBadge logo={stamp.logo} color={stamp.color} />
          </div>
        ))}
      </div>

      {/* content */}
      <div className="relative z-20 mx-auto max-w-2xl text-center">
        <h2 className="text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl  font-inter">
          {heading}
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-base font-jakarta leading-relaxed text-text/70 sm:text-lg">
          {body}
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={primaryCta.href}
            className="flex items-center gap-2 rounded-full bg-[#F1552B] px-6 py-3.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 sm:text-base"
          >
            {primaryCta.label}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Flame className="h-3.5 w-3.5 text-white" />
            </span>
          </a>
        </div>
      </div>

      {/* rotating contact badge, bottom-right */}
      <a
        href={contactHref}
        aria-label="Neem contact op"
        className="group absolute bottom-8 right-6 z-20 hidden h-28 w-28 items-center justify-center sm:flex lg:bottom-12 lg:right-16"
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
        <span className="relative rounded-full bg-[#141414] px-3 py-1 text-lg font-black text-white">
          {badgeInitials}
        </span>
      </a>
    </section>
  );
}