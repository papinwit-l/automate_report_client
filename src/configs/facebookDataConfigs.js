// facebookDataConfigs.js

export const FACEBOOK_FIELDS = [
  { key: "impressions", sourceField: "Impressions" },
  { key: "reach", sourceField: "Reach" },
  { key: "clicks", sourceField: "Link clicks" },
  { key: "conversions", sourceField: "Conversion" },
  { key: "spent", sourceField: "Spent" },
  { key: "engagements", sourceField: "Post engagements" },
  { key: "videoWatchesAt25", sourceField: "Video watches at 25%" },
  { key: "views", sourceField: "Video views" },
  {
    key: "messages",
    sourceField: "Messaging conversations started",
  },
  { key: "addToCart", sourceField: "Website adds to cart" },
  { key: "purchase", sourceField: "Website purchases" },
  {
    key: "purchaseConValue",
    sourceField: "Website purchases conversion value",
  },
];

export const FACEBOOK_CALCULATED_FIELDS = [
  { key: "frequency", type: "frequency" },
  { key: "cpr", type: "cpr" },
  { key: "ctr", type: "ctr" },
  { key: "cpc", type: "cpc" },
  { key: "cvr", type: "cvr" },
  { key: "cpl", type: "cpl" },
  { key: "cpm", type: "cpm" },
  { key: "cpv", type: "cpv" },
  { key: "cpe", type: "cpe" },
  { key: "cpa", type: "cpa" },
  { key: "roas", type: "roas" },
  { key: "engagementRate", type: "engagementRate" },
  { key: "viewRate", type: "viewRate" },
];

export const FACEBOOK_PROCESSED_FIELDS = [
  "Channel", // For filtering
  "Ad set name",
  "Impressions",
  "Reach",
  "Link clicks",
  "Conversion",
  "Website conversions",
  "Spent",
  "Video watches at 25%",
  "Video views",
  "Post engagements",
  "Messaging conversations started", // Original field
  "Website adds to cart",
  "Website purchases",
  "Website purchases conversion value",
];

export const FACEBOOK_METRICS = [
  "Ad set name",
  "Ad name",
  "Impressions",
  "Reach",
  "Link clicks",
  "Website conversions",
  "Conversion",
  "Spent",
  "Video watches at 25%",
  "views",
  "Post engagements",
  "Channel", // From FacebookReach & FacebookEngagement
  "Messaging conversations started", // From FacebookMessage
  "Website adds to cart",
  "Website purchases",
  "Website purchases conversion value",
];
