import { useEffect, useState } from "react";

const DURATION = 4000; // fill time in ms
const HOLD = 400; // pause on the fully filled word
const EXIT = 1000; // scale-up + fade-out time

// Wave path: wavelength 450, repeated so it can scroll seamlessly
const wave =
  "M0 0 q112.5 -20 225 0 t225 0 t225 0 t225 0 t225 0 t225 0 t225 0 t225 0 V400 H0 Z";

const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const css = `
@keyframes fm-bar-top { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes fm-bar-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes fm-reveal {
  from { opacity: 0; filter: blur(18px); transform: scale(1.08); }
  to   { opacity: 1; filter: blur(0);    transform: scale(1); }
}
@keyframes fm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes fm-dolly { from { transform: scale(1); } to { transform: scale(1.06); } }
@keyframes fm-grain {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-3%, 2%); }
  40%  { transform: translate(2%, -3%); }
  60%  { transform: translate(-2%, -2%); }
  80%  { transform: translate(3%, 3%); }
  100% { transform: translate(0, 0); }
}
.fm-bar-top    { animation: fm-bar-top 1s cubic-bezier(.7,0,.2,1) both; }
.fm-bar-bottom { animation: fm-bar-bottom 1s cubic-bezier(.7,0,.2,1) both; }
.fm-dolly      { animation: fm-dolly ${DURATION + HOLD + EXIT}ms linear both; }
.fm-reveal     { animation: fm-reveal 1.6s cubic-bezier(.2,.7,.2,1) .4s both; }
.fm-tag        { animation: fm-fade 1.2s ease-out 1.4s both; }
.fm-meta       { animation: fm-fade 1s ease-out 1.8s both; }
.fm-grain      { animation: fm-grain .6s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) {
  .fm-dolly, .fm-grain { animation: none; }
}
`;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // keep the page from scrolling behind the loader
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(easeInOutCubic(t) * 100);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const hold = setTimeout(() => setExiting(true), DURATION + HOLD);
    const done = setTimeout(() => onDone?.(), DURATION + HOLD + EXIT);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hold);
      clearTimeout(done);
    };
  }, [onDone]);

  // water level: below the text at 0%, above the text at 100%
  const level = 290 - (progress / 100) * 250;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-50 overflow-hidden bg-bg"
      style={{
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.8)" : "scale(1)",
        transformOrigin: "center",
        transition: `opacity ${EXIT}ms cubic-bezier(.6,0,.4,1), transform ${EXIT}ms cubic-bezier(.6,0,.4,1)`,
      }}
    >
      <style>{css}</style>

      {/* letterbox bars */}
      <div className="fm-bar-top absolute inset-x-0 top-0 h-[11vh] bg-text" />
      <div className="fm-bar-bottom absolute inset-x-0 bottom-0 h-[11vh] bg-text" />

      {/* main frame, slow push-in */}
      <div className="fm-dolly flex h-full w-full items-center justify-center px-6">
        <div className="w-full max-w-[900px]">
          <svg viewBox="0 0 900 280" className="fm-reveal block w-full">
            <defs>
              <clipPath id="family-clip">
                <text
                  x="0"
                  y="260"
                  fontSize="260"
                  textLength="900"
                  lengthAdjust="spacingAndGlyphs"
                  className="font-inter font-black"
                >
                  FAMILY
                </text>
              </clipPath>
            </defs>

            {/* empty text */}
            <text
              x="0"
              y="260"
              fontSize="260"
              textLength="900"
              lengthAdjust="spacingAndGlyphs"
              className="font-inter font-black"
              fill="#161616"
              fillOpacity="0.08"
            >
              FAMILY
            </text>

            {/* water rising inside the letters */}
            <g clipPath="url(#family-clip)">
              <g transform={`translate(0 ${level})`}>
                <g opacity="0.4">
                  <path d={wave} fill="#161616">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from="-450 6"
                      to="0 6"
                      dur="3.6s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
                <path d={wave} fill="#161616">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-450 0"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>

            {/* small FMC above the first F */}
            <text
              x="6"
              y="54"
              fontSize="30"
              letterSpacing="6"
              className="fm-tag font-inter font-bold"
              fill="#161616"
            >
              FMC
            </text>
          </svg>

          <p className="fm-meta mt-2 text-right font-inter text-sm font-medium tabular-nums text-text">
            loading... {Math.round(progress)} %
          </p>
        </div>
      </div>

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(22,22,22,0.28) 100%)",
        }}
      />

      {/* film grain */}
      <div
        className="fm-grain pointer-events-none absolute -inset-[10%] opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: grain }}
      />
    </div>
  );
}