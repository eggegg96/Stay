import { Link } from "react-router-dom";

export default function HotelCard({ id, name, location, desc, type, images }) {
  return (
    <Link
      to={`/${type}/${id}`}
      className="flex pb-4 border-b border-slate-200 shadow transition gap-4"
    >
      <img
        src={images[0]}
        alt={name}
        className="w-96 h-56 object-cover rounded-md"
      />
      <div className="flex flex-col flex-start">
        <div className="text-lg font-bold">{name}</div>
        <div className="text-slate-500">{location}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
      <div className="flex flex-col justify-end flex-grow pr-4">
        <div className="text-xl font-bold ml-auto">대실 : 22,000원</div>
        <div className="text-xl font-bold ml-auto">숙박 : 70,000원</div>
      </div>
    </Link>
  );
}
