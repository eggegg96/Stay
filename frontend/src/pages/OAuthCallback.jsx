import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const provider = sp.get("provider");
    const code = sp.get("code");
    const error = sp.get("error");

    if (error) {
      alert(`로그인 실패: ${error}`);
      navigate("/login", { replace: true });
      return;
    }

    if (code) {
      console.log(`[DEMO] ${provider} 코드 수신:`, code);

      setTimeout(() => {
        navigate("/signup?step=1", { replace: true });
      }, 1000);
    } else {
      navigate("/login", { replace: true });
    }
  }, [sp, navigate]);

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      </div>
    </section>
  );
}
