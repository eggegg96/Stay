import { useSearchParams } from "react-router-dom";
import TermsAgreementStep from "@/components/auth/TermsAgreementStep";
import PhoneVerificationStep from "@/components/auth/PhoneVerificationStep";
import UserInfoStep from "@/components/auth/UserInfoStep";
import SignupCompleteStep from "@/components/auth/SignupCompleteStep";

export default function Signup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");

  const goToStep = (nextStep) => {
    setSearchParams({ step: nextStep });
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
