import SearchForm from "./SearchForm";

export default function ExpandedHeaderSearch({
  area,
  initialActive,
  state,
  onSubmit,
}) {
  const handleFormSubmit = (payload) => {
    console.log("ExpandedHeaderSearch received:", payload);
    onSubmit(payload);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-4">
      <div className="bg-white rounded-2xl">
        <SearchForm
          state={state}
          onSubmit={handleFormSubmit}
          area={area}
          initialActive={initialActive}
        />
      </div>
    </div>
  );
}
