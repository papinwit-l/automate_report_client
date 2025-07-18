// configs/dataConfigs.js
export const NON_NUMERIC_COLUMNS = [
  "Ad group name",
  "Updated Date",
  "Project",
  "Channel",
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
    fields: [
      { key: "impressions", sourceField: "Impressions" },
      { key: "reach", sourceField: "Reach" },
      { key: "clicks", sourceField: "Link clicks" },
      { key: "conversions", sourceField: "Website conversions" },
      { key: "cost", sourceField: "Cost" },
    ],
    calculatedFields: [
      { key: "frequency", type: "frequency" },
      { key: "cpr", type: "cpr" },
      { key: "ctr", type: "ctr" },
      { key: "cpc", type: "cpc" },
      { key: "cvr", type: "cvr" },
      { key: "cpl", type: "cpl" },
      { key: "cpm", type: "cpm" },
      { key: "spent", type: "custom", calculate: (data) => data.cost },
    ],
  },

  TikTokAudience: {
    audienceGroupBy: "Ad group name",
    creativeGroupBy: "Ad name",
    fields: [
      { key: "impressions", sourceField: "Impressions" },
      { key: "reach", sourceField: "Reach" },
      { key: "clicks", sourceField: "Clicks" },
      { key: "conversions", sourceField: "Conversions" },
      { key: "cost", sourceField: "Cost" },
    ],
    calculatedFields: [
      { key: "frequency", type: "frequency" },
      { key: "ctr", type: "ctr" },
      { key: "cpc", type: "cpc" },
      { key: "cvr", type: "cvr" },
      { key: "cpa", type: "cpa" },
      { key: "cpm", type: "cpm" },
      { key: "spent", type: "custom", calculate: (data) => data.cost },
    ],
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
    ],
    calculatedFields: [
      { key: "frequency", type: "frequency" },
      { key: "ctr", type: "ctr" },
      { key: "cpc", type: "cpc" },
      { key: "cvr", type: "cvr" },
      { key: "cpa", type: "cpa" },
      { key: "cpm", type: "cpm" },
      { key: "spent", type: "custom", calculate: (data) => data.cost },
    ],
  },
};

// Main Data Configurations
export const DATA_CONFIGS = {
  // Search/Advertising platforms
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

  // Social media platforms
  FacebookAudience: {
    endpoint: "facebook-data",
    processFields: [
      "Ad set name",
      "Impressions",
      "Reach",
      "Link clicks",
      "Website conversions",
      "Cost",
    ],
    groupBy: "Ad set name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.FacebookAudience,
  },

  TikTokAudience: {
    endpoint: "tiktok-data",
    processFields: [
      "Ad group name",
      "Impressions",
      "Reach",
      "Clicks",
      "Conversions",
      "Cost",
    ],
    groupBy: "Ad group name",
    hasComparison: true,
    processData: true,
    processorType: "social",
    socialConfig: SOCIAL_MEDIA_CONFIGS.TikTokAudience,
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
  FacebookAudience: [
    "Ad set name",
    "Ad name",
    "Impressions",
    "Reach",
    "Link clicks",
    "Website conversions",
    "Cost",
  ],
  TikTokAudience: [
    "Ad group name",
    "Ad name",
    "Impressions",
    "Reach",
    "Clicks",
    "Conversions",
    "Cost",
  ],
  InstagramAudience: [
    "Ad set name",
    "Ad name",
    "Impressions",
    "Reach",
    "Link clicks",
    "Conversions",
    "Amount spent",
  ],
};
