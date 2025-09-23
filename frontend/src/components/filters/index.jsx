import useFilterParams from "@hooks/useFilterParams";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import AmenitiesFilter from "./AmenitiesFilter";

export default function Filters() {
  const {
    category,
    setCategory,
    priceRange,
    setPriceRange,
    amenities,
    setAmenities,
  } = useFilterParams();

  const onToggleAmenity = (a) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  return (
    <div className="p-4 rounded-md bg-white">
      <CategoryFilter category={category} setCategory={setCategory} />
      <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
      <AmenitiesFilter
        amenities={amenities}
        onToggleAmenity={onToggleAmenity}
      />
    </div>
  );
}
