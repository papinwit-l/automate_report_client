import OverallAsiaHotel from "@/components/slides/OverallAsiaHotel";
import OverallDefault from "@/components/slides/OverallDefault";
import OverallNokkualok from "@/components/slides/OverallNokkualok";

export const TEMPLATE_SELECT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "asia-hotel", label: "Asia Hotel" },
  { value: "nokkualok", label: "Nokkualok" },
];

export const TEMPLATE_COMPONENTS = {
  default: OverallDefault,
  "asia-hotel": OverallAsiaHotel,
  nokkualok: OverallNokkualok,
};
