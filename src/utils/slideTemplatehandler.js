import {
  ASIA_HOTEL_FACEBOOK_SLIDES,
  NOKKUALOK_TIKTOK_SLIDES,
} from "@/configs/slideConfig";

const FACEBOOK_TEMPLATE_MAPPING = {
  "asia-hotel": ASIA_HOTEL_FACEBOOK_SLIDES,
};

const TIKTOK_TEMPLATE_MAPPING = {
  nokkualok: NOKKUALOK_TIKTOK_SLIDES,
};

export const handleSlideTemplate = (defaultSlides, template, contentType) => {
  // Return default slides if any parameter is missing
  if (!defaultSlides || !template || !contentType) {
    return defaultSlides;
  }

  // Handle Facebook content type
  if (contentType === "facebook") {
    const templateSlides = FACEBOOK_TEMPLATE_MAPPING[template];
    return templateSlides || defaultSlides; // Fallback to default if template not found
  }

  if (contentType === "tiktok") {
    const templateSlides = TIKTOK_TEMPLATE_MAPPING[template];
    return templateSlides || defaultSlides; // Fallback to default if template not found
  }

  // Add more content types here as needed
  // if (contentType === "google") { ... }
  // if (contentType === "instagram") { ... }

  return defaultSlides;
};
