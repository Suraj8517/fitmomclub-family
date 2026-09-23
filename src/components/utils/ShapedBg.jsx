import React from "react";

/**
 * ShapeCard — a clipped-corner promo card with a heading, CTA button,
 * and a circular "open" affordance.
 *
 * Sizing is container-relative (cqw), not viewport-relative (vw), so the
 * card scales correctly whether it's full-width or sitting in a narrow
 * grid column or sidebar.
 */
const ShapeCard = ({
  title = "Zacht in smaak,",
  secondLine = "sterk in beeld",
  buttonText = "Roasta",
  bgColor = "#168DF5",
  buttonColor = "#38A5FF",
  textColor = "#FFFFFF",
  maxWidth = 453,
  onButtonClick,
  onArrowClick,
}) => {
  return (
    <div
      className="relative w-full"
      style={{
        containerType: "inline-size",
        maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      }}
    >
      {/* Aspect ratio container */}
      <div className="relative aspect-[453/235] w-full">
        {/* =========================
            SVG CARD
        ========================== */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 453 235"
          preserveAspectRatio="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
              M 36 49
              C 26 51 17 60 17 73
              L 17 204
              C 17 216 25 224 38 224
              L 414 224
              C 426 224 434 216 434 204
              L 434 29
              C 434 15 424 7 410 7
              L 36 49
              Z
            "
            fill={bgColor}
          />
        </svg>

        {/* =========================
            CONTENT
        ========================== */}
        <div className="absolute inset-0">
          {/* Heading */}
          <h2
            className="
              absolute
              left-[7.5%]
              top-[31%]
              max-w-[72%]
              m-0
              font-bold
              text-[clamp(1.35rem,6.2cqw,1.3rem)]
              leading-[1.05]
              tracking-[-0.035em]
            "
            style={{ color: textColor }}
          >
            {title}
            {secondLine ? (
              <>
                <br />
                {secondLine}
              </>
            ) : null}
          </h2>

          {/* =========================
              CARD BUTTON
          ========================== */}
          <button
            type="button"
            onClick={onButtonClick}
            className="
              absolute
              bottom-[10%]
              left-[7.5%]
              rounded-[8px]
              px-[3.2cqw]
              py-[2.1cqw]
              text-[clamp(0.85rem,3.2cqw,1.05rem)]
              font-medium
              leading-none
              text-white
              transition-transform
              duration-200
              hover:-translate-y-[1px]
              active:scale-95
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-white
              motion-reduce:transition-none
              motion-reduce:hover:translate-y-0
            "
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>

          {/* =========================
              ARROW BUTTON
          ========================== */}
          <button
            type="button"
            onClick={onArrowClick}
            aria-label="Open card"
            className="
              absolute
              right-[6%]
              top-[8%]
              z-20
              flex
              h-[11.9cqw]
              w-[11.9cqw]
              min-h-[34px]
              min-w-[34px]
              max-h-[54px]
              max-w-[54px]
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              border
              border-black/10
              shadow-[0_2px_8px_rgba(0,0,0,0.08)]
              transition-transform
              duration-200
              hover:scale-105
              active:scale-95
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-black
              motion-reduce:transition-none
              motion-reduce:hover:scale-100
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[45%] w-[45%]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 18L18 6" />
              <path d="M10 6H18V14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShapeCard;