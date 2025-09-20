import SearchForm from "./SearchForm";

export default function ExpandedHeaderSearch({
  area,
  initialActive,
  state,
  onSubmit,
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-4">
      <div className="bg-white rounded-2xl">
        <SearchForm
          state={state}
          onSubmit={onSubmit}
          area={area}
          initialActive={initialActive}
        />
      </div>
    </div>
  );
}
