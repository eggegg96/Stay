import { useParams, useMatch } from "react-router-dom";

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const isDomestic = !!useMatch("/domestic/:id");

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold">
        {isDomestic ? "국내 숙소" : "해외 숙소"} 상세
      </h1>
      <p>숙소 ID: {id}</p>
    </section>
  );
}
