import { Link } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";

export default function Header() {
  const { header } = useHeader();

  if (header.mode === "detail") {
    return (
      <header className="p-4 h-20 flex items-center border-b border-slate-200">
        <Link to="/" className="ml-8 text-4xl font-bold">
          Stay
        </Link>

        <div className="ml-32 min-w-0 bg-gray-100 p-3 rounded-lg">
          <div className="text-sm font-semibold text-gray-600 truncate">
            {header.title} | {header.checkIn} ~ {header.checkOut} | 성인{" "}
            {header.adults}, 객실 {header.rooms}
          </div>
        </div>

        <Link
          to="/login"
          className="ml-auto mr-8 border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold"
        >
          로그인/회원가입
        </Link>
      </header>
    );
  }

  // 기본 헤더
  return (
    <header className="p-4 h-20 flex items-center border-b border-slate-200">
      <Link to="/" className="ml-8 text-4xl font-bold">
        Stay
      </Link>
      <Link
        to="/login"
        className="ml-auto mr-8 border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold"
      >
        로그인/회원가입
      </Link>
    </header>
  );
}
