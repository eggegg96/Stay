import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="p-4 flex items-center">
      <Link to="/" className="ml-8 text-4xl font-bold">
        Stay
      </Link>
      <Link to="/login" className="ml-auto cursor-pointer mr-30 items-center">
        로그인
      </Link>
    </header>
  );
}
