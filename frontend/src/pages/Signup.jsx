import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import TermsAgreementStep from "@/components/auth/TermsAgreementStep";
import PhoneVerificationStep from "@/components/auth/PhoneVerificationStep";
import UserInfoStep from "@/components/auth/UserInfoStep";
import SignupCompleteStep from "@/components/auth/SignupCompleteStep";

/**
 * 소셜 회원가입 페이지
 *
 * URL step 검증이 필요한 이유:
 * - 사용자가 URL에 직접 step=3을 입력하면 약관 동의, 휴대폰 인증을 건너뛸 수 있음
 * - 이는 필수 정보 누락 및 데이터 무결성 문제로 이어짐
 * - 실무에서도 회원가입 플로우는 반드시 순차적으로 진행되어야 함
 *
 * sessionStorage를 사용하는 이유:
 * - 브라우저 탭을 닫으면 자동으로 초기화 (보안)
 * - localStorage보다 짧은 생명주기
 * - 회원가입은 한 세션 내에서 완료되므로 적합
 */

export default function Signup() {
  const { user, loading } = useAuth(); // 로그인 상태 확인
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const step = parseInt(searchParams.get("step") || "1");

  console.log("Signup - location.state:", location.state); // 디버깅용

  // 검증이 완료될 때까지 렌더링 방지
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  /**
   * Step 검증 로직
   *
   * 검증이 필요한 이유:
   * - useEffect는 렌더링 **후**에 실행되므로 컴포넌트가 잠깐 보일 수 있음
   * - isValidating 상태로 검증 중에는 아무것도 렌더링하지 않음
   * - 검증 실패 시 즉시 리다이렉트
   */
  /**
   * 로그인 상태 확인 + Step 검증
   */
  useEffect(() => {
    // AuthContext 로딩 중이면 검증 대기
    if (loading) {
      console.log("🔄 AuthContext 로딩 중...");
      return;
    }

    const validateAccess = () => {
      console.log(`🔍 회원가입 페이지 접근 검증 시작...`);
      console.log("User:", user);

      // 🔒 1순위: 이미 로그인한 사용자는 회원가입 페이지 접근 불가
      if (user) {
        console.warn("⚠️ 이미 로그인된 사용자 - 홈으로 리다이렉트");
        navigate("/", { replace: true });
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // 2순위: Step 검증 (비로그인 사용자만)
      console.log(`🔍 Step ${step} 검증 시작...`);

      // Step 1은 항상 접근 가능
      if (step === 1) {
        sessionStorage.removeItem("signupStep1Completed");
        sessionStorage.removeItem("signupStep2Completed");
        sessionStorage.removeItem("signupStep3Completed");
        console.log("🔄 Step 1 - 진행 상태 초기화");
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 2: 약관 동의 완료 여부 확인
      if (step === 2) {
        const step1Completed = sessionStorage.getItem("signupStep1Completed");
        if (!step1Completed) {
          console.warn("⚠️ Step 1 미완료 - Step 1로 리다이렉트");
          navigate("/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 3: 휴대폰 인증 완료 여부 확인
      if (step === 3) {
        const step2Completed = sessionStorage.getItem("signupStep2Completed");
        if (!step2Completed) {
          console.warn("⚠️ Step 2 미완료 - Step 1로 리다이렉트");
          navigate("/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 4: 회원정보 입력 완료 여부 확인
      if (step === 4) {
        const step3Completed = sessionStorage.getItem("signupStep3Completed");
        if (!step3Completed) {
          console.warn("⚠️ Step 3 미완료 - Step 1로 리다이렉트");
          navigate("/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // 그 외 잘못된 step
      console.warn(`⚠️ 잘못된 step: ${step} - Step 1로 리다이렉트`);
      navigate("/signup?step=1", { replace: true });
      setIsValid(false);
      setIsValidating(false);
    };

    validateAccess();
  }, [step, navigate, user]);

  /**
   * 다음 단계로 이동
   *
   * @param {number} nextStep - 이동할 step 번호
   *
   * 각 step 완료 시 sessionStorage에 완료 표시를 저장
   * 이를 통해 URL 직접 접근을 방지
   */
  const goToStep = (nextStep) => {
    // 현재 step 완료 표시
    sessionStorage.setItem(`signupStep${step}Completed`, "true");
    console.log(`✅ Step ${step} 완료`);

    navigate(`/signup?step=${nextStep}`, {
      replace: true,
      state: location.state, // 기존 state 유지
    });
  };

  // 검증 중이거나 검증 실패 시 아무것도 렌더링하지 않음
  if (isValidating || !isValid) {
    return null; // 또는 <div>검증 중...</div>
  }

  return (
    <section className="min-h-[calc(100vh-80px)] py-12 px-6">
      {step === 1 && <TermsAgreementStep onNext={() => goToStep(2)} />}
      {step === 2 && <PhoneVerificationStep onNext={() => goToStep(3)} />}
      {step === 3 && <UserInfoStep onNext={() => goToStep(4)} />}
      {step === 4 && <SignupCompleteStep />}
    </section>
  );
}
