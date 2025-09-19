import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4 h-20 flex items-center border-b border-slate-200">
      <Link to="/" className="ml-8 text-4xl font-bold">
        Stay
      </Link>
      <Link
        to="/login"
        className="ml-auto cursor-pointer mr-30 items-center border px-4 py-2 border-blue-500 rounded-lg text-blue-500 font-semibold"
      >
        로그인/회원가입
      </Link>
    </header>
  );
}
