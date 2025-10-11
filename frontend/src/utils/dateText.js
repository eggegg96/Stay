import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DATE_CONSTANTS } from "@/constants";

export function nightsBetween(start, end) {
  return Math.max(1, Math.round((end - start) / DATE_CONSTANTS.ONE_DAY_MS));
}

export function formatRangeKR(start, end, nights) {
  const n = nights ?? nightsBetween(start, end);
  return `${format(start, "MM.dd EEE", { locale: ko })} - ${format(
    end,
    "MM.dd EEE",
    { locale: ko }
  )} (${n}박)`;
}
