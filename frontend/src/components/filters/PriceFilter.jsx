import { Range } from "react-range";
import { PRICE_MIN, PRICE_MAX, STEP } from "@constants/filters";

export default function PriceFilter({ priceRange, setPriceRange }) {
  const displayPrice = (() => {
    const [minP, maxP] = priceRange;
    const minTxt = `${minP.toLocaleString()}원`;
    const maxTxt =
      maxP >= PRICE_MAX
        ? `${PRICE_MAX.toLocaleString()}원 이상`
        : `${maxP.toLocaleString()}원`;
    return `${minTxt} ~ ${maxTxt}`;
  })();

  return (
    <div className="mb-6 border-t border-slate-200 py-3">
      <span className="block font-semibold mb-6">
        가격 <span className="text-sm text-slate-400">1박 기준</span>
      </span>

      <div className="mt-3">
        <Range
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          values={priceRange}
          onChange={setPriceRange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full rounded-full bg-slate-200"
              style={{ ...props.style }}
            >
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{
                  marginLeft: `${(priceRange[0] / PRICE_MAX) * 100}%`,
                  width: `${
                    ((priceRange[1] - priceRange[0]) / PRICE_MAX) * 100
                  }%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => {
            const { key, ...thumbProps } = props; // ✅ key 분리
            return (
              <div
                key={key}
                {...thumbProps}
                className="h-5 w-5 rounded-full bg-white border border-slate-300 shadow"
              />
            );
          }}
        />
        <div className="mt-2 text-sm text-slate-600">{displayPrice}</div>
      </div>
    </div>
  );
}
