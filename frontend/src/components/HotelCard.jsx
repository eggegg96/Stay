import { Link } from "react-router-dom";

export default function HotelCard({ id, name, location, desc, type }) {
  return (
    <Link
      to={`/${type}/${id}`}
      className="block border rounded-lg p-4 hover:shadow transition"
    >
      <div className="text-lg font-bold">{name}</div>
      <div className="text-slate-500">{location}</div>
      <div className="text-sm">{desc}</div>
    </Link>
  );
}
