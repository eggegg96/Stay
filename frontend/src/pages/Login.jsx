import SocialLoginButtons from "@common/SocialLoginBtn";

export default function Login() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">로그인</h1>
        <SocialLoginButtons demo /> {/* ← 데모 모드 */}
      </div>
    </section>
  );
}
