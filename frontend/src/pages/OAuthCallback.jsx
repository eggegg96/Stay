// src/pages/OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const [sp] = useSearchParams();
  const [msg, setMsg] = useState("처리 중…");

  useEffect(() => {
    const provider = sp.get("provider");
    const code = sp.get("code");
    const error = sp.get("error");

    if (error) return setMsg(`실패: ${error}`);
    if (code) return setMsg(`[DEMO] ${provider} 코드 수신: ${code}`);
    setMsg("코드가 없음");
  }, [sp]);

  return <section className="p-6 text-center">{msg}</section>;
}
