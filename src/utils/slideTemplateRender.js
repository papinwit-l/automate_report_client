import { ASIA_HOTEL_FACEBOOK_SLIDES } from "@/configs/slideConfig";

const FACEBOOK_TEMPLATE_MAPPING = {
  "asia-hotel": ASIA_HOTEL_FACEBOOK_SLIDES,
};

export const handleSlideTemplate = (slides, template, content) => {
  if (!slides || !template || !content) return slides;
  if (content === "facebook") {
    const FACEBOOK_TEMPLATE = FACEBOOK_TEMPLATE_MAPPING[template];
    return FACEBOOK_TEMPLATE;
  }
  return slides;
};
