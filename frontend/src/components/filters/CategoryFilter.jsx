import { CATEGORY_OPTIONS } from "@constants/filters";

export default function CategoryFilter({ category, setCategory }) {
  return (
    <div className="mb-6 border-t border-slate-200 py-3">
      <span className="block font-semibold mb-5">숙소유형</span>
      <fieldset className="flex flex-col gap-2">
        {CATEGORY_OPTIONS.map((opt) => (
          <label key={opt.value || "all"} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value={opt.value}
              checked={category === opt.value}
              onChange={(e) => setCategory(e.target.value)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
