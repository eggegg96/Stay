import { create } from "zustand";

const initialFormData = {
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
};

const useBusinessSignupStore = create((set) => ({
  formData: { ...initialFormData },

  // 특정 필드만 업데이트 (이전 데이터 유지하면서 덮어쓰기)
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  // 가입 완료 후 전체 초기화
  resetFormData: () => set({ formData: { ...initialFormData } }),
}));

export default useBusinessSignupStore;
