import BlankMediaPlan from "@/components/custom-templates/BlankMediaPlan";
import EndSlideCustom from "@/components/custom-templates/EndSlideCustom";
import OverallCustom from "@/components/custom-templates/OverallCustom";
import SectionSlideCustom from "@/components/custom-templates/SectionSlideCustom";
import SingleTableSlideCustom from "@/components/custom-templates/SingleTableSlideCustom";
import TitleSlideCustom from "@/components/custom-templates/TitleSlideCustom";

export const START_TEMPLATES = [
  {
    title: "Title",
    name: "title-slide",
    Component: TitleSlideCustom,
  },
  {
    title: "Media Plan",
    name: "media-plan",
    Component: BlankMediaPlan,
  },
  {
    title: "End Slide",
    name: "end-slide",
    Component: EndSlideCustom,
  },
];

export const INITIAL_NEW_SLIDE = {
  title: "Title",
  Component: null,
  table: [],
  metricData: [],
  metricConvLength: 2,
  dataSource: "",
  dataChannel: "",
  dataGroupBy: "",
  extraContentType: "none",
  summaryPosition: "bottom",
  FBPicturePerformBy: "Impressions",
  demographicChart: [
    {
      title: "Chart 1",
      chartBy: "Gender",
      dataBy: "Clicks",
    },
    {
      title: "Chart 2",
      chartBy: "None",
      dataBy: "Clicks",
    },
  ],
  summaryContent: [
    {
      contentType: "overall",
      dataBy: "Conversions",
    },
    {
      contentType: "average-cpx",
      dataBy: "cpl",
    },
    {
      contentType: "best-perform",
      dataBy: "Conversions",
    },
  ],
};

export const CREATE_SLIDE_LIST = [
  {
    title: "Title Slide",
    name: "title-slide",
    Component: TitleSlideCustom,
  },
  {
    title: "Section Slide",
    name: "section-slide",
    Component: SectionSlideCustom,
  },
  {
    title: "End Slide",
    name: "end-slide",
    Component: EndSlideCustom,
  },
  {
    title: "Blank Media Plan",
    name: "media-plan",
    Component: BlankMediaPlan,
  },
  {
    title: "Overall Slide",
    name: "overall-slide",
    Component: OverallCustom,
    table: [
      "Impressions",
      "Clicks",
      "ctr",
      "Conversions",
      "conRate",
      "cpl",
      "Spent",
    ],
    metricData: [
      {
        label: "Impressions",
        value: "impressionData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "Clicks",
        value: "clicksData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "%CTR",
        value: "ctrData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "Conversions",
        value: "conversionsData",
        isConversion: true,
        invertCompare: false,
      },
      {
        label: "%Conv rate",
        value: "conRateData",
        isConversion: true,
        invertCompare: false,
      },
      {
        label: "CPL",
        value: "cplData",
        isConversion: true,
        invertCompare: true,
      },
      {
        label: "Spent",
        value: "spentData",
        isConversion: true,
        invertCompare: true,
      },
    ],
  },
  {
    ...INITIAL_NEW_SLIDE,
    title: "Single Table Slide",
    name: "single-table-slide",
    Component: SingleTableSlideCustom,
    table: [
      "Impressions",
      "Clicks",
      "ctr",
      "cpc",
      "Conversions",
      "conRate",
      "cpl",
      "Spent",
    ],
    metricData: [
      {
        label: "Impressions",
        value: "impressionData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "Clicks",
        value: "clicksData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "%CTR",
        value: "ctrData",
        isConversion: false,
        invertCompare: false,
      },
      {
        label: "Conversions",
        value: "conversionsData",
        isConversion: true,
        invertCompare: false,
      },
      {
        label: "%Con Rate",
        value: "conRateData",
        isConversion: true,
        invertCompare: false,
      },
      {
        label: "CPA",
        value: "cpaData",
        isConversion: true,
        invertCompare: true,
      },
      {
        label: "Spent",
        value: "spentData",
        isConversion: true,
        invertCompare: true,
      },
    ],
  },
];

export const GROUP_BY_LIST = [
  { label: "Keyword", value: "Keyword" },
  { label: "Ad group name", value: "Ad group name" },
  { label: "Ad name", value: "Ad name" },
  { label: "Ad set name", value: "Ad set name" },
  { label: "Campaign name", value: "Campaign name" },
  { label: "Campaign objective", value: "Campaign objective" },
  { label: "Campaign Type", value: "Campaign Type" },
];

export const DEMOGRAPHIC_CHART_BY_LIST = [
  "Gender",
  "Device",
  "Age",
  "Campaign",
];

export const DEMOGRAPHIC_DATA_LIST = [
  { label: "Conversion", value: "Conversion" },
  { label: "Clicks", value: "Clicks" },
  { label: "Impressions", value: "Impressions" },
  { label: "Spent", value: "Spent" },
  { label: "Engagements", value: "Engagements" },
  { label: "Video views", value: "Video views" },
];

export const SUMMARRY_CONTENT_LIST = [
  { label: "Overall", value: "overall" },
  { label: "Average CPX", value: "average-cpx" },
  { label: "Best perform", value: "best-perform" },
  { label: "Best potential", value: "best-potential" },
];

export const METRIC_DATA_LIST = [
  { label: "Impressions", value: "impressionData", invertCompare: false },
  { label: "Clicks", value: "clicksData", invertCompare: false },
  { label: "%CTR", value: "ctrData", invertCompare: false },
  { label: "Conversions", value: "conversionsData", invertCompare: false },
  { label: "%Conv rate", value: "conRateData", invertCompare: false },
  {
    label: "Conversion Value",
    value: "conversionValueData",
    invertCompare: false,
  },
  { label: "Reach", value: "reachData", invertCompare: false },
  { label: "Frequency", value: "frequencyData", invertCompare: false },
  { label: "Engagements", value: "engagementData", invertCompare: false },
  { label: "%Engage Rate", value: "engagementRateData", invertCompare: false },
  { label: "Views", value: "VideoViewsData", invertCompare: false },
  { label: "%View rate", value: "viewRateData", invertCompare: false },
  { label: "View 6 sec", value: "view6secData", invertCompare: false },
  { label: "Spent", value: "spentData", invertCompare: true },
  { label: "CPL", value: "cplData", invertCompare: true },
  { label: "CPA", value: "cpaData", invertCompare: true },
  { label: "CPC", value: "cpcData", invertCompare: true },
  { label: "CPE", value: "cpeData", invertCompare: true },
  { label: "CPM", value: "cpmData", invertCompare: true },
  { label: "CPR", value: "cprData", invertCompare: true },
  { label: "CPV", value: "cpvData", invertCompare: true },
  { label: "ROAS", value: "roasData", invertCompare: false },
];

export const OVERALL_TABLE = [
  { label: "Impressions", value: "Impressions" },
  { label: "Clicks", value: "Clicks" },
  { label: "%CTR", value: "ctr" },
  { label: "Conversions", value: "Conversions" },
  { label: "%Conv rate", value: "conRate" },
  { label: "Engagements", value: "Post Engagement" },
  { label: "Spent", value: "Spent" },
  { label: "CPL", value: "cpl" },
  { label: "CPA", value: "cpa" },
  { label: "CPC", value: "cpc" },
];

export const CUSTOM_TABLE = [
  // // Dimensions
  // { label: "Keyword", value: "Keyword" },
  // { label: "Campaign", value: "Campaign" },
  // { label: "Ad Group", value: "Ad Group" },
  // { label: "Audience", value: "audience" },
  // { label: "Creative", value: "creative" },
  // { label: "Ad Name", value: "Ad Name" },

  // Basic Metrics
  { label: "Impressions", value: "Impressions" },
  { label: "Clicks", value: "Clicks" },
  { label: "Reach", value: "Reach" },
  { label: "Spent", value: "Spent" },

  // Engagement Metrics
  { label: "Engagements", value: "Engagements" },
  // { label: "Post Engagement", value: "Post Engagement" },
  { label: "Follows", value: "Follows" },

  // Conversion Metrics
  { label: "Conversions", value: "Conversions" },
  { label: "Conversion Value", value: "Conversion value" },

  // Video Metrics
  { label: "Video Views", value: "Video views" },
  { label: "VideoViews", value: "VideoViews" },
  { label: "6sec Views", value: "View6sec" },

  // Calculated Metrics - Rates
  { label: "%CTR", value: "ctr" },
  { label: "%Conv Rate", value: "conRate" }, // Advertising naming (preferred over cvr)
  { label: "%View Rate", value: "viewRate" },
  { label: "%View Rate 6sec", value: "viewRate6sec" },
  { label: "%Engagement Rate", value: "engagementRate" },
  { label: "Frequency", value: "frequency" },

  // Calculated Metrics - Cost Per Action
  { label: "CPC", value: "cpc" },
  { label: "CPM", value: "cpm" },
  { label: "CPL", value: "cpl" }, // Advertising naming (same as CPA in this context)
  { label: "CPA", value: "cpa" },
  { label: "CPE", value: "cpe" },
  { label: "CPV", value: "cpv" },
  { label: "CPV 6sec", value: "cpv6sec" },
  { label: "CPF", value: "cpf" },
  { label: "CPR", value: "cpr" },

  // Return on Ad Spend
  { label: "ROAS", value: "roas" },
];
