import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import BusinessEmailVerification from "@/components/auth/BusinessEmailVerification";
import BusinessEmailSent from "@/components/auth/BusinessEmailSent";
import BusinessCompanySelect from "@/components/auth/BusinessCompanySelect";
import BusinessCompanyConfirm from "@/components/auth/BusinessCompanyConfirm";
import BusinessTermsAgreement from "@/components/auth/BusinessTermsAgreement";
import BusinessPhoneVerification from "@/components/auth/BusinessPhoneVerification";
import BusinessBasicInfo from "@/components/auth/BusinessBasicInfo";
import SignupCompleteStep from "@/components/auth/SignupCompleteStep";

/**
 * 비즈니스 회원가입 페이지
 *
 * 접근 제어:
 * 1. 로그인한 사용자 → 홈으로 리다이렉트
 * 2. 비로그인 사용자 → step 검증 후 회원가입 진행
 */
export default function BusinessSignup() {
  const { user, loading } = useAuth(); // ← loading 추가!
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const step = parseInt(searchParams.get("step") || "1");

  // 검증 중 상태
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // 전체 회원가입 데이터
  const [formData, setFormData] = useState({
    email: "",
    emailVerified: false,
    companyType: "",
    companyName: "",
    businessNumber: "",
    termsAgreed: false,
    phoneNumber: "",
    phoneVerified: false,
    name: "",
    password: "",
    passwordConfirm: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
  });

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
      console.log(`🔍 비즈니스 회원가입 페이지 접근 검증 시작...`);

      // 🔒 1순위: 이미 로그인한 사용자는 회원가입 페이지 접근 불가
      if (user) {
        console.warn("⚠️ 이미 로그인된 사용자 - 홈으로 리다이렉트");
        navigate("/", { replace: true });
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // 2순위: Step 검증
      console.log(`🔍 Business Step ${step} 검증 시작...`);

      // Step 1은 항상 접근 가능
      if (step === 1) {
        sessionStorage.removeItem("businessSignupStep1Completed");
        sessionStorage.removeItem("businessSignupStep2Completed");
        sessionStorage.removeItem("businessSignupStep4Completed");
        sessionStorage.removeItem("businessSignupStep5Completed");
        sessionStorage.removeItem("businessSignupStep6Completed");
        sessionStorage.removeItem("businessSignupStep7Completed");
        sessionStorage.removeItem("businessSignupStep8Completed");
        console.log("🔄 Business Step 1 - 진행 상태 초기화");
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 2: 이메일 입력 완료 여부 확인
      if (step === 2) {
        const step1Completed = sessionStorage.getItem(
          "businessSignupStep1Completed"
        );
        if (!step1Completed) {
          console.warn("⚠️ Business Step 1 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 3은 백엔드에서 이메일 인증 처리 (건너뜀)

      // Step 4: 이메일 발송 확인 완료 여부
      if (step === 4) {
        const step2Completed = sessionStorage.getItem(
          "businessSignupStep2Completed"
        );
        if (!step2Completed) {
          console.warn("⚠️ Business Step 2 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 5: 소속 선택 완료 여부 확인
      if (step === 5) {
        const step4Completed = sessionStorage.getItem(
          "businessSignupStep4Completed"
        );
        if (!step4Completed) {
          console.warn("⚠️ Business Step 4 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 6: 소속 확인 완료 여부 확인
      if (step === 6) {
        const step5Completed = sessionStorage.getItem(
          "businessSignupStep5Completed"
        );
        if (!step5Completed) {
          console.warn("⚠️ Business Step 5 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 7: 약관 동의 완료 여부 확인
      if (step === 7) {
        const step6Completed = sessionStorage.getItem(
          "businessSignupStep6Completed"
        );
        if (!step6Completed) {
          console.warn("⚠️ Business Step 6 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 8: 휴대폰 인증 완료 여부 확인
      if (step === 8) {
        const step7Completed = sessionStorage.getItem(
          "businessSignupStep7Completed"
        );
        if (!step7Completed) {
          console.warn("⚠️ Business Step 7 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
          setIsValid(false);
          setIsValidating(false);
          return;
        }
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Step 9: 기본정보 입력 완료 여부 확인
      if (step === 9) {
        const step8Completed = sessionStorage.getItem(
          "businessSignupStep8Completed"
        );
        if (!step8Completed) {
          console.warn("⚠️ Business Step 8 미완료 - Step 1로 리다이렉트");
          navigate("/business/signup?step=1", { replace: true });
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
      navigate("/business/signup?step=1", { replace: true });
      setIsValid(false);
      setIsValidating(false);
    };

    validateAccess();
  }, [step, navigate, user, loading]);

  /**
   * 다음 단계로 이동
   */
  const goToStep = (nextStep, data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));

    // 현재 step 완료 표시 (step 3은 제외 - 백엔드 처리)
    if (step !== 3) {
      sessionStorage.setItem(`businessSignupStep${step}Completed`, "true");
      console.log(`✅ Business Step ${step} 완료`);
    }

    navigate(`/business/signup?step=${nextStep}`, {
      replace: true,
    });
  };

  /**
   * 이전 단계로 돌아가기
   */
  const goBack = (prevStep) => {
    navigate(`/business/signup?step=${prevStep}`, {
      replace: true,
    });
  };

  // 검증 중이거나 검증 실패 시 아무것도 렌더링하지 않음
  if (isValidating || !isValid) {
    return null;
  }

  return (
    <section className="min-h-[calc(100vh-80px)] py-12 px-6">
      {/* Step별 컴포넌트 렌더링 */}
      {step === 1 && (
        <BusinessEmailVerification
          initialData={formData}
          onNext={(data) => goToStep(2, data)}
        />
      )}

      {step === 2 && (
        <BusinessEmailSent
          email={formData.email}
          onResend={() => {
            // 이메일 재발송 로직
            // TODO: 백엔드 API 호출
            console.log("이메일 재발송:", formData.email);
          }}
          onNext={() => goToStep(4)} // 이메일 인증 완료 후 소속 선택으로
        />
      )}

      {/* step 3은 백엔드에서 처리 (이메일 링크 클릭 시 자동으로 step 4로) */}

      {step === 4 && (
        <BusinessCompanySelect
          initialData={formData}
          onNext={(data) => goToStep(5, data)}
        />
      )}

      {step === 5 && (
        <BusinessCompanyConfirm
          companyInfo={formData}
          onBack={() => goBack(4)}
          onNext={() => goToStep(6)}
        />
      )}

      {step === 6 && <BusinessTermsAgreement onNext={() => goToStep(7)} />}

      {step === 7 && (
        <BusinessPhoneVerification
          initialData={formData}
          onNext={(data) => goToStep(8, data)}
        />
      )}

      {step === 8 && (
        <BusinessBasicInfo
          initialData={formData}
          onNext={(data) => goToStep(9, data)}
        />
      )}

      {step === 9 && <SignupCompleteStep />}
    </section>
  );
}
