/**
 * 날짜 유틸리티 함수
 */
import { DATE_CONSTANTS } from "@/constants";

export const getDefaultCheckOutDate = (checkInDate) => {
  if (!checkInDate) {
    return new Date(Date.now() + DATE_CONSTANTS.ONE_DAY_MS);
  }

  const checkIn =
    typeof checkInDate === "string" ? new Date(checkInDate) : checkInDate;

  return new Date(checkIn.getTime() + DATE_CONSTANTS.ONE_DAY_MS);
};
