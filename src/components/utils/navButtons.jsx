import { Link, useLocation, useResolvedPath } from "react-router-dom";

export default function NavLink({ label, to }) {
  const location = useLocation();
  const target = useResolvedPath(to);

  const current = location.pathname;
  const link = target.pathname;
  const isActive =
    to === "/"
      ? current === "/"
      : current === link || current.startsWith(link + "/");

  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className="group relative px-4 py-2 text-sm font-semibold inline-block"
    >
      {/* orange layer: grows up from the bottom first */}
      <span
        className={`absolute inset-0 rounded-md bg-primary-orange origin-bottom transition-transform duration-300 ease-out ${
          isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
        }`}
      />

      {/* black layer: grows up from the bottom right after, inset slightly from
          the top so a sliver of the orange layer stays visible as a "border" */}
      <span
        className={`absolute left-0 right-0 bottom-0 top-[3px] rounded-md bg-text origin-bottom transition-transform duration-300 delay-75 ease-out ${
          isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
        }`}
      />

      {/* rolling text */}
      <span className="relative z-10 block h-[18px] overflow-hidden leading-[18px]">
        <span
          className={`block transition-transform duration-300 ease-out ${
            isActive ? "-translate-y-full" : "group-hover:-translate-y-full"
          }`}
        >
          {label}
        </span>
        <span
          className={`block absolute inset-0 text-primary-white transition-transform duration-300 ease-out ${
            isActive ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
          }`}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}