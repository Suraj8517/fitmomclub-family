import vignesh from "../../assets/about/vignesh.png";
import sarvesh from "../../assets/about/sarvesh.png";
import pritika from "../../assets/about/pritika.png";
import ShapeCardForTeams from "../utils/shapeBgForTeam";

// offset: same top margin (mt-10) for every card on phones; the original staggered
//         offsets apply from sm up.
// order:  phones show Vignesh, Sarvesh, Pritika; sm and up keeps the original order.
const DEFAULT_ITEMS = [
  {
    image: pritika,
    title: "Pritika",
    secondLine: "",
    buttonText: "Co-Founder and Chief Evangelist",
    bgColor: "#FF5C1A",
    buttonColor: "#FF8A4C",
    width: "max-w-[380px]",
    offset: "mt-10 sm:mt-36", // sm+: pushed down -> sits lowest
    order: "order-3 sm:order-none", // third on phones
    hoverRotate: "hover:-rotate-3",
    href: "#",
  },
  {
    image: sarvesh,
    title: "Sarvesh",
    secondLine: "Prabhakaran",
    buttonText: "Co Founder & CEO",
    bgColor: "#168DF5",
    buttonColor: "#3BA0FF",
    width: "max-w-[380px]",
    offset: "mt-10 sm:mt-16", // sm+: sits highest
    order: "order-2 sm:order-none", // second on phones
    hoverRotate: "hover:rotate-3",
    href: "#",
  },
  {
    image: vignesh,
    title: "Vignesh",
    secondLine: "Prabhakaran",
    buttonText: "Founder & Chief Business Director",
    bgColor: "#1FBF8F",
    buttonColor: "#3FD1A5",
    width: "max-w-[380px]",
    offset: "mt-10 sm:mt-0", // sm+: middle
    order: "order-1 sm:order-none", // first on phones
    hoverRotate: "hover:-rotate-1",
    href: "#",
  },
];

function WorkCard({ item }) {
  return (
    <div
      className={`relative w-full ${item.width} ${item.offset} ${item.order} ${item.hoverRotate} overflow-hidden rounded-[2rem] transition-transform duration-300 ease-out hover:scale-[1.02]`}
      style={{ border: `8px solid ${item.bgColor}` }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-[560px] w-full object-cover"
      />
      <div className="absolute inset-x-4 bottom-4">
        <ShapeCardForTeams
          title={item.title}
          secondLine={item.secondLine}
          buttonText={item.buttonText}
          bgColor={item.bgColor}
          buttonColor={item.buttonColor}
          textColor="#FFFFFF"
          onArrowClick={() => {
            if (item.href) window.location.href = item.href;
          }}
        />
      </div>
    </div>
  );
}

export default function WorkShowcase({ items = DEFAULT_ITEMS }) {
  return (
    <section className="bg-bg px-5 py-2 sm:px-10 lg:px-16">
      {/* Phones: no gap, spacing comes from each card's equal mt-10.
          sm and up: original gaps. */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-center gap-0 sm:gap-8 lg:gap-12">
        {items.map((item, i) => (
          <WorkCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}