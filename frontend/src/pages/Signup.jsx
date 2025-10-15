import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import TermsAgreementStep from "@/components/auth/TermsAgreementStep";
import PhoneVerificationStep from "@/components/auth/PhoneVerificationStep";
import UserInfoStep from "@/components/auth/UserInfoStep";
import SignupCompleteStep from "@/components/auth/SignupCompleteStep";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const step = parseInt(searchParams.get("step") || "1");

  console.log("Signup - location.state:", location.state); // 디버깅용

  const goToStep = (nextStep) => {
    navigate(`/signup?step=${nextStep}`, {
      replace: true,
      state: location.state, // 기존 state 유지
    });
  };

  return (
    <section className="min-h-[calc(100vh-80px)] py-12 px-6">
      {step === 1 && <TermsAgreementStep onNext={() => goToStep(2)} />}
      {step === 2 && <PhoneVerificationStep onNext={() => goToStep(3)} />}
      {step === 3 && <UserInfoStep onNext={() => goToStep(4)} />}
      {step === 4 && <SignupCompleteStep />}
    </section>
  );
}
