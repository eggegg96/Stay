import { AMENITY_GROUPS } from "../../constants/filters";

export default function AmenitiesFilter({ amenities, onToggleAmenity }) {
  return (
    <div className="border-t border-slate-200 py-3">
      <span className="block font-semibold mb-5">시설</span>
      <div className="space-y-6">
        {Object.entries(AMENITY_GROUPS).map(([group, list]) => (
          <section key={group}>
            <h4 className="text-slate-800 font-semibold mb-2">{group}</h4>
            <div className="flex flex-wrap gap-2">
              {list.map((label) => {
                const active = amenities.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onToggleAmenity(label)}
                    className={`px-3 py-1 rounded-2xl border text-sm ${
                      active
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-slate-200"
                    }`}
                    aria-pressed={active}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
