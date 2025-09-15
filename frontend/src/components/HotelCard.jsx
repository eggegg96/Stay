export default function HotelCard({ name, location, desc }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <h3 className="font-bold">{name}</h3>
      <p className="text-sm text-slate-600">{location}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
