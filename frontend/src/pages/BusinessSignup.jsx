import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

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
 * 왜 이렇게 많은 단계가 필요한가?
 * 1. 이메일 인증: 실제 사용하는 이메일인지 확인 (보안 + 스팸 방지)
 * 2. 소속 확인: 정확한 사업자 매칭 (숙소 관리를 위해 필수)
 * 3. 약관 동의: 법적 요구사항
 * 4. 휴대폰 인증: 본인 확인 + 중복 가입 방지
 * 5. 단계별 검증: 각 단계에서 데이터 무결성 보장
 *
 * 왜 state로 formData를 관리하는가?
 * - 각 단계에서 입력한 데이터를 다음 단계로 전달
 * - 뒤로가기 시에도 입력한 데이터 유지
 * - 마지막 단계에서 모든 데이터를 한 번에 서버로 전송
 */
export default function BusinessSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const step = parseInt(searchParams.get("step") || "1");

  // 전체 회원가입 데이터를 하나의 state로 관리
  // 이유: 각 단계의 데이터를 통합 관리하여 데이터 일관성 유지
  const [formData, setFormData] = useState({
    // step 1-2: 이메일 인증
    email: "",
    emailVerified: false, // 이메일 인증 완료 여부

    // step 4-5: 소속 정보
    companyType: "", // 724펜, 독채펜션, 호텔 등
    companyName: "", // 선택한 소속명
    businessNumber: "", // 사업자등록번호

    // step 6: 약관 동의
    termsAgreed: false,

    // step 7: 휴대폰 인증
    phoneNumber: "",
    phoneVerified: false, // 휴대폰 인증 완료 여부

    // step 8: 기본정보
    name: "",
    password: "",
    passwordConfirm: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
  });

  /**
   * 다음 단계로 이동
   *
   * @param {number} nextStep - 이동할 step 번호
   * @param {object} data - 현재 step에서 입력한 데이터
   *
   * replace: true를 사용하는 이유:
   * - 브라우저 뒤로가기 시 step을 거슬러 올라가지 않음
   * - 회원가입 플로우는 순차적으로 진행되어야 하므로
   */
  const goToStep = (nextStep, data = {}) => {
    // 현재 단계 데이터를 기존 formData에 병합
    setFormData((prev) => ({ ...prev, ...data }));

    navigate(`/business/signup?step=${nextStep}`, {
      replace: true,
    });
  };

  /**
   * 이전 단계로 돌아가기
   *
   * 사용 예: 소속 확인 화면에서 "뒤로" 버튼
   */
  const goBack = (prevStep) => {
    navigate(`/business/signup?step=${prevStep}`, {
      replace: true,
    });
  };

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
