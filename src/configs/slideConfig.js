import AsiaHotelFBAwareness01 from "@/components/slides/asia-hotel/AsiaHotelFBAwareness01";
import AsiaHotelFBAwareness02 from "@/components/slides/asia-hotel/AsiaHotelFBAwareness02";
import AsiaHotelFBCatalog01 from "@/components/slides/asia-hotel/AsiaHotelFBCatalog01";
import AsiaHotelFBCatalog02 from "@/components/slides/asia-hotel/AsiaHotelFBCatalog02";
import DiscoverySlide from "@/components/slides/DiscoverySlide";
import FacebookAwarenessSlide01 from "@/components/slides/FacebookAwarenessSlide01";
import FacebookAwarenessSlide02 from "@/components/slides/FacebookAwarenessSlide02";
import FacebookCatalogSlide01 from "@/components/slides/FacebookCatalogSlide01";
import FacebookCatalogSlide02 from "@/components/slides/FacebookCatalogSlide02";
import FacebookConversionSlide01 from "@/components/slides/FacebookConversionSlide01";
import FacebookConversionSlide02 from "@/components/slides/FacebookConversionSlide02";
import FacebookEngagementSlide01 from "@/components/slides/FacebookEngagementSlide01";
import FacebookEngagementSlide02 from "@/components/slides/FacebookEngagementSlide02";
import FacebookLeadSlide01 from "@/components/slides/FacebookLeadSlide01";
import FacebookLeadSlide02 from "@/components/slides/FacebookLeadSlide02";
import FacebookMessageSlide01 from "@/components/slides/FacebookMessageSlide01";
import FacebookMessageSlide02 from "@/components/slides/FacebookMessageSlide02";
import FacebookReachSlide01 from "@/components/slides/FacebookReachSlide01";
import FacebookReachSlide02 from "@/components/slides/FacebookReachSlide02";
import FacebookTrafficSlide01 from "@/components/slides/FacebookTrafficSlide01";
import FacebookTrafficSlide02 from "@/components/slides/FacebookTrafficSlide02";
import FacebookVideoSlide01 from "@/components/slides/FacebookVideoSlide01";
import FacebookVideoSlide02 from "@/components/slides/FacebookVideoSlide02";
import GDNSlide from "@/components/slides/GDNSlide";
import PerformanceMaxSlide from "@/components/slides/PerformanceMaxSlide";
import SEMClickSlide from "@/components/slides/SEMClickSlide";
import SEMConversionSlide from "@/components/slides/SEMConversionSlide";
import ShoppingAdsSlide from "@/components/slides/ShoppingAdsSlide";
import TiktokConversionEcommerceSlide01 from "@/components/slides/TiktokConversionEcommerceSlide01";
import TiktokConversionSlide01 from "@/components/slides/TiktokConversionSlide01";
import TiktokFollowerSlide01 from "@/components/slides/TiktokFollowerSlide01";
import TiktokLeadSlide01 from "@/components/slides/TiktokLeadSlide01";
import TiktokReachSlide01 from "@/components/slides/TiktokReachSlide01";
import TiktokTrafficSlide01 from "@/components/slides/TiktokTrafficSlide01";
import TiktokVideoSlide01 from "@/components/slides/TiktokVideoSlide01";
import YoutubeSlide from "@/components/slides/YoutubeSlide";

export const GOOGLE_SLIDES = {
  SEM: [SEMConversionSlide, SEMClickSlide],
  GDN: [GDNSlide],
  Discovery: [DiscoverySlide],
  YouTube: [YoutubeSlide],
  Shopping: [ShoppingAdsSlide],
  "Performance Max": [PerformanceMaxSlide],
};

export const ASIA_HOTEL_FACEBOOK_SLIDES = {
  "FB Awareness": [AsiaHotelFBAwareness01, AsiaHotelFBAwareness02],
  "FB Reach": [FacebookReachSlide01, FacebookReachSlide02],
  "FB Engagement": [FacebookEngagementSlide01, FacebookEngagementSlide02],
  "FB Traffic": [FacebookTrafficSlide01, FacebookTrafficSlide02],
  "FB Video": [FacebookVideoSlide01, FacebookVideoSlide02],
  "FB Message": [FacebookMessageSlide01, FacebookMessageSlide02],
  "FB Lead": [FacebookLeadSlide01, FacebookLeadSlide02],
  "FB Conversion": [FacebookConversionSlide01, FacebookConversionSlide02],
  "FB Catalog": [AsiaHotelFBCatalog01, AsiaHotelFBCatalog02],
};

export const FACEBOOK_SLIDES = {
  "FB Awareness": [FacebookAwarenessSlide01, FacebookAwarenessSlide02],
  "FB Reach": [FacebookReachSlide01, FacebookReachSlide02],
  "FB Engagement": [FacebookEngagementSlide01, FacebookEngagementSlide02],
  "FB Traffic": [FacebookTrafficSlide01, FacebookTrafficSlide02],
  "FB Video": [FacebookVideoSlide01, FacebookVideoSlide02],
  "FB Message": [FacebookMessageSlide01, FacebookMessageSlide02],
  "FB Lead": [FacebookLeadSlide01, FacebookLeadSlide02],
  "FB Conversion": [FacebookConversionSlide01, FacebookConversionSlide02],
  "FB Catalog": [FacebookCatalogSlide01, FacebookCatalogSlide02],
};

export const TIKTOK_SLIDES = {
  "TikTok Reach": [TiktokReachSlide01],
  "TikTok VDO View": [TiktokVideoSlide01],
  "TikTok Traffic": [TiktokTrafficSlide01],
  "TikTok Lead": [TiktokLeadSlide01],
  "TikTok Conversion": [
    TiktokConversionSlide01,
    TiktokConversionEcommerceSlide01,
  ],
  "TikTok Follower": [TiktokFollowerSlide01],
};
