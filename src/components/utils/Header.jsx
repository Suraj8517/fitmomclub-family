import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

// Update the `to` paths to match your router setup
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact", to: "/contact-us" },
];

function NavLink({ label, to }) {
  return (
    <Link
      to={to}
      className="group relative px-4 py-2 text-sm font-semibold inline-block"
    >
      {/* orange layer: grows up from the bottom first */}
      <span className="absolute inset-0 rounded-md bg-primary-orange origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />

      {/* black layer: grows up from the bottom right after, inset slightly from
          the top so a sliver of the orange layer stays visible as a "border" */}
      <span className="absolute left-0 right-0 bottom-0 top-[3px] rounded-md bg-text origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75 ease-out" />

      {/* rolling text */}
      <span className="relative z-10 block h-[18px] overflow-hidden leading-[18px]">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {label}
        </span>
        <span className="block absolute inset-0 translate-y-full text-primary-white transition-transform duration-300 ease-out group-hover:translate-y-0">
          {label}
        </span>
      </span>
    </Link>
  );
}

function NavPill() {
  return (
    <nav className="hidden lg:flex items-center gap-1 bg-primary-white rounded-xl px-2 py-2">
      {NAV_LINKS.map(({ label, to }) => (
        <NavLink key={to} label={label} to={to} />
      ))}
    </nav>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        // Always show at the very top
        setVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> show
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down -> hide (and close mobile menu)
        setVisible(false);
        setOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The mobile menu is a full-screen overlay: lock page scroll while it is open
  // (otherwise scrolling behind it would trigger the hide-on-scroll and close it).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // If the window grows to desktop size while the menu is open, close it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`w-full bg-transparent fixed top-0 left-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Mobile menu: full-screen pink panel, links as white pills in the centre,
          CTA pinned to the bottom. Sits behind the logo + toggle row (z-10 below). */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute left-0 top-0 z-0 flex h-dvh w-full flex-col items-center rounded-b-2xl bg-primary-pink px-4 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-opacity duration-300 ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-2">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="rounded-2xl bg-primary-white px-6 py-3 text-xl font-semibold text-text transition-transform duration-200 active:scale-95"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          to="/join"
          onClick={closeMenu}
          className="inline-flex items-center gap-3 rounded-xl bg-text py-1 pl-4 pr-1 text-sm font-semibold text-primary-white transition-transform duration-200 active:scale-95"
        >
          Join Now
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-white">
            🔥
          </span>
        </Link>
      </div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex shrink-0" onClick={closeMenu}>
            <img src={logo} alt="Logo" className="h-18 w-auto" />
          </Link>

          {/* Desktop nav */}
          <NavPill />

          {/* CTA button */}
          <Link
            to="/join"
            className="hidden lg:inline-flex items-center gap-3 bg-primary-pink text-text font-semibold text-sm pl-3 pr-1 py-1 rounded-xl transition-all duration-300 ease-out hover:opacity-90 hover:-rotate-3 hover:scale-105"
          >
            Join Now
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-white transition-transform duration-300 ease-out group-hover:rotate-12">
              🔥
            </span>
          </Link>

          {/* Mobile menu button: pink normally, white while the pink menu is open */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden flex flex-col justify-center items-center h-10 w-10 rounded-xl shrink-0 transition-colors duration-300 ${
              open ? "bg-primary-white" : "bg-primary-pink"
            }`}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`block h-0.5 w-5 bg-text transition-transform ${
                open ? "rotate-45 translate-y-1" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text mt-1 transition-transform ${
                open ? "-rotate-45 -translate-y-1" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}