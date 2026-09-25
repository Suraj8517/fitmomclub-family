import { Link } from "react-router-dom";
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

// Wordmark logo, overflowing past the section edge on desktop. Pass
// `logoSrc` to use your own logo image — the markup falls back to a
// text wordmark automatically when no src is given. `to` routes via
// React Router; if omitted it falls back to a plain `href` anchor.
function BrandLogo({ src, alt = "Logo", to, href = "#" }) {
  const Wrapper = to ? Link : "a";
  const wrapperProps = to ? { to } : { href };

  if (src) {
    return (
      <Wrapper
        {...wrapperProps}
        aria-label={alt}
        className="-mb-6 inline-flex h-16 w-40 items-start justify-start sm:h-20 sm:w-48 md:-mb-18 md:h-24 md:w-56 lg:h-68 lg:w-104 -rotate-1"
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
      <em className="flex items-center bg-white pl-[0.06em] pr-[0.16em] pt-[0.06em] not-italic text-transparent [-webkit-text-stroke:2.5px_#000] sm:[-webkit-text-stroke:3px_#000]">
        FAMILY
      </em>
    </Wrapper>
  );
}

export default function Footer({
  logoSrc = fmclogo,
  logoAlt = "Brand logo",
  logoTo = "/",
  logoHref,
  // Content used only by the compact mobile/tablet layout below `xl`.
  legalLinks = [
    { label: "Algemene voorwaarden", href: "#" },
    { label: "Privacyverklaring", href: "#" },
  ],
  credit = "© Design by Dylan",
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#FBF3EA] font-['Inter',system-ui,sans-serif] text-[#161616]">
      {/* ============================================================ */}
      {/* MOBILE / TABLET LAYOUT — shown below the `xl` breakpoint.      */}
      {/* Big logo, nav pills, socials, contact/address, legal footer.  */}
      {/* ============================================================ */}
      <div className="relative z-20 flex flex-col items-center gap-4 px-5 py-2 text-center xl:hidden sm:gap-7 sm:px-8 sm:py-11 md:mx-auto md:max-w-2xl md:gap-8 md:px-10 md:py-14">
        {/* Logo */}
        <div className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px]">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-auto w-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.15)]"
            draggable={false}
          />
        </div>

        {/* Nav pills */}
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
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
      {/* DESKTOP LAYOUT — curved footer slab, shown from `xl` up.       */}
      {/* ============================================================ */}
      <div className="relative hidden px-5 pb-8 xl:mt-50  xl:block sm:px-[3vw] sm:pb-9">
        {/* Tilted tan slab behind the content */}
        <div className="absolute -bottom-[400px] left-[2.2%] right-[2.2%] -top-[10px] z-10 origin-bottom-left rounded-t-[34px] bg-[#E9E2D6] lg:top-[100px] 2xl:top-[120px] lg:-skew-y-[10deg]" />

        <div className="relative z-20 grid max-w-[1600px] items-end gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-[1fr_minmax(0,400px)_220px]">
          {/* logo */}
          <div className="order-3 md:order-1 lg:order-none flex items-start self-end justify-start">
            <BrandLogo
              src={logoSrc}
              alt={logoAlt}
              to={logoHref ? undefined : logoTo}
              href={logoHref}
            />
          </div>

          {/* nav + socials + credits */}
          <div className="order-2 flex flex-col gap-5 sm:gap-6 md:order-2 lg:order-none">
            <nav aria-label="Footer" className="flex flex-wrap gap-2 sm:gap-2.5">
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
              <span>© {new Date().getFullYear()} Get Hyped</span>
            </div>
          </div>

          {/* contact */}
          <div id="contact" className="relative order-1 md:order-3 lg:order-none md:col-span-2 lg:col-span-1">
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
    </section>
  );
}