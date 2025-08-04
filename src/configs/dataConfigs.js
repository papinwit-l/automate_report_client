import {
  FACEBOOK_CALCULATED_FIELDS,
  FACEBOOK_FIELDS,
  FACEBOOK_METRICS,
  FACEBOOK_PROCESSED_FIELDS,
} from "./facebookDataConfigs";
import {
  TIKTOK_CALCULATED_FIELDS,
  TIKTOK_FIELDS,
  TIKTOK_METRICS,
  TIKTOK_PROCESSED_FIELDS,
} from "./tiktokDataConfigs";

// configs/dataConfigs.js
export const NON_NUMERIC_COLUMNS = [
  "Ad group name",
  "Updated Date",
  "Date",
  "Project",
  "Channel",
  "Age",
  "Gender",
  "Year & month",
  "Year & week (Mon-Sun)",
  "Date",
  "Updated Month",
  "Updated Week",
  "Updated Date",
  "Campaign name",
  "Keyword",
  "Device",
  "Ad set name",
  "Ad name",
  "Campaign objective",
  "Campaign Type",
  "Ad Format",
];

// Social Media Platform Configurations
export const SOCIAL_MEDIA_CONFIGS = {
  FacebookAudience: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookAwareness: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookReach: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookEngagement: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookMessage: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookLead: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookConversion: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookTraffic: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookVideo: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  FacebookCatalog: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: FACEBOOK_FIELDS,
    calculatedFields: FACEBOOK_CALCULATED_FIELDS,
  },

  // TikTok Campaign Types
  TikTokAudience: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  TikTokLead: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  TikTokReach: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  TikTokTraffic: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  TikTokConversion: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  TikTokVideo: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: TIKTOK_FIELDS,
    calculatedFields: TIKTOK_CALCULATED_FIELDS,
  },

  InstagramAudience: {
    audienceGroupBy: "Ad set name",
    creativeGroupBy: "Ad name",
    fields: [
      { key: "impressions", sourceField: "Impressions" },
      { key: "reach", sourceField: "Reach" },
      { key: "clicks", sourceField: "Link clicks" },
      { key: "conversions", sourceField: "Conversions" },
      { key: "cost", sourceField: "Amount spent" },
      { key: "engagements", sourceField: "Engagements" },
    ],
    calculatedFields: [
      { key: "frequency", type: "frequency" },
      { key: "ctr", type: "ctr" },
      { key: "cpc", type: "cpc" },
      { key: "cvr", type: "cvr" },
      { key: "cpa", type: "cpa" },
      { key: "cpm", type: "cpm" },
      { key: "cpe", type: "cpe" },
      { key: "cpr", type: "cpr" },
      { key: "engagementRate", type: "engagementRate" },
      { key: "spent", type: "custom", calculate: (data) => data.cost },
    ],
  },
};

// Main Data Configurations
export const DATA_CONFIGS = {
  // Search/Advertising platforms
  overall: {
    endpoint: "overall-data",
    processFields: [
      "Channel",
      "Impressions",
      "Reach",
      "Clicks",
      "ctr",
      "Conversions",
      "conRate",
      "cpl",
      "Spent",
    ],
    groupBy: "Channel",
    hasComparison: true,
    processData: true,
    processorType: "advertising",
  },
  SEM: {
    endpoint: "sem-data",
    processFields: [
      "Keyword",
      "Impressions",
      "Clicks",
      "ctr",
      "cpc",
      "Conversions",
      "conRate",
      "cpl",
      "Spent",
    ],
    groupBy: "Keyword",
    hasComparison: true,
    processData: true,
    processorType: "advertising",
  },

  GGDemographic: {
    endpoint: "gg-demographic",
    processFields: [
      "Channel",
      "Conversions",
      "Campaign name",
      "Gender",
      "Device",
      "Impressions",
      "Clicks",
    ],
    groupBy: "Channel",
    hasComparison: false,
    processData: false,
    processorType: "none",
  },

  GDN: {
    endpoint: "gdn-data",
    processFields: [
      "Ad group name",
      "Impressions",
      "Clicks",
      "ctr",
      "Conversions",
      "cpl",
      "Spent",
    ],
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "advertising",
  },

  Disc: {
    endpoint: "disc-data",
    processFields: [
      "Ad group name",
      "Impressions",
      "Clicks",
      "ctr",
      "cpc",
      "Conversions",
      "conRate",
      "cpl",
      "Spent",
    ],
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "advertising",
  },

  Youtube: {
    endpoint: "youtube-data",
    processFields: [
      "Ad group name",
      "Impressions",
      "Clicks",
      "Video views",
      "viewRate",
      "cpv",
      "Conversions",
      "Spent",
      "Watch 25% views",
      "Watch 50% views",
      "Watch 75% views",
      "Watch 100% views",
      "Engagements",
    ],
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "advertising",
  },

  // Social media platforms
  FacebookAudience: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookAudience,
  },

  FacebookAwareness: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookAwareness,
  },

  FBDemographic: {
    endpoint: "fb-demographic",
    processFields: [
      "Project",
      "Channel",
      "Conversion",
      "Spent",
      "Updated Date",
      "Campaign name",
      "Campaign objective",
      "Age",
      "Gender",
      "Impressions",
      "Reach",
      "Link clicks",
      "Website conversions",
      "New messaging conversations within 7 days",
    ],
    groupBy: "Channel",
    hasComparison: false,
    processData: false,
    processorType: "none",
  },

  FacebookReach: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookReach,
  },

  FacebookEngagement: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookEngagement,
  },

  FacebookMessage: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookMessage,
  },

  FacebookLead: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookLead,
  },

  FacebookConversion: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookConversion,
  },

  FacebookTraffic: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookTraffic,
  },

  FacebookVideo: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookVideo,
  },

  FacebookCatalog: {
    endpoint: "facebook-data",
    processFields: FACEBOOK_PROCESSED_FIELDS,
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookCatalog,
  },

  TikTokAudience: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokAudience,
  },

  TikTokLead: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokLead,
  },

  TikTokReach: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokReach,
  },

  TikTokTraffic: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokTraffic,
  },

  TikTokConversion: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokConversion,
  },

  TikTokVideo: {
    endpoint: "tiktok-data",
    processFields: TIKTOK_PROCESSED_FIELDS,
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokVideo,
  },

  InstagramAudience: {
    endpoint: "instagram-data",
    processFields: [
      "Ad set name",
      "Impressions",
      "Reach",
      "Link clicks",
      "Conversions",
      "Amount spent",
    ],
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.InstagramAudience,
  },
};

// Default metrics for each data type
export const DEFAULT_METRICS = {
  overall: [
    "Channel",
    "Impressions",
    "Reach",
    "Clicks",
    "Conversions",
    "Spent",
  ],
  SEM: ["Keyword", "Impressions", "Clicks", "Conversions", "Spent"],
  GGDemographic: [
    "Channel",
    "Conversions",
    "Campaign name",
    "Gender",
    "Device",
    "Impressions",
    "Clicks",
  ],
  GDN: ["Ad group name", "Impressions", "Clicks", "Conversions", "Spent"],
  Disc: ["Ad group name", "Impressions", "Clicks", "Conversions", "Spent"],
  Youtube: [
    "Ad group name",
    "Impressions",
    "Clicks",
    "Video views",
    "Conversions",
    "Spent",
    "Watch 25% views",
    "Watch 50% views",
    "Watch 75% views",
    "Watch 100% views",
    "Engagements",
  ],
  FacebookAudience: FACEBOOK_METRICS,
  FacebookAwareness: FACEBOOK_METRICS,
  FBDemographic: FACEBOOK_METRICS,
  FacebookReach: FACEBOOK_METRICS,
  FacebookEngagement: FACEBOOK_METRICS,
  FacebookMessage: FACEBOOK_METRICS,
  FacebookLead: FACEBOOK_METRICS,
  FacebookConversion: FACEBOOK_METRICS,
  FacebookTraffic: FACEBOOK_METRICS,
  FacebookVideo: FACEBOOK_METRICS,
  FacebookCatalog: FACEBOOK_METRICS,
  TikTokAudience: TIKTOK_METRICS,
  TikTokLead: TIKTOK_METRICS,
  TikTokReach: TIKTOK_METRICS,
  TikTokTraffic: TIKTOK_METRICS,
  TikTokConversion: TIKTOK_METRICS,
  TikTokVideo: TIKTOK_METRICS,
  InstagramAudience: [
    "Ad set name",
    "Ad name",
    "Impressions",
    "Reach",
    "Link clicks",
    "Conversions",
    "Amount spent",
    "Engagements",
  ],
};
