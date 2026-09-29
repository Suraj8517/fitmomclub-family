import { Link } from "react-router-dom";


export default function NavLink({ label, to }) {
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