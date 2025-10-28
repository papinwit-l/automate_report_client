import BlankMediaPlan from "@/components/custom-templates/BlankMediaPlan";
import EndSlideCustom from "@/components/custom-templates/EndSlideCustom";
import GoogleSlideCustom from "@/components/custom-templates/GoogleSlideCustom";
import OverallCustom from "@/components/custom-templates/OverallCustom";
import SectionSlideCustom from "@/components/custom-templates/SectionSlideCustom";
import TitleSlideCustom from "@/components/custom-templates/TitleSlideCustom";

export const START_TEMPLATES = [
  {
    title: "Title",
    Component: TitleSlideCustom,
  },
  {
    title: "Media Plan",
    Component: BlankMediaPlan,
  },
  {
    title: "End Slide",
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
  dataGroupBy: "default",
  extraContentType: "none",
  summaryPosition: "bottom",
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
    title: "Google Slide",
    name: "google-slide",
    Component: GoogleSlideCustom,
    table: [
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

export const DEMOGRAPHIC_DATA_LIST = [
  { label: "Conversion", value: "Conversion" },
  { label: "Clicks", value: "Clicks" },
  { label: "Impressions", value: "Impressions" },
  { label: "Spent", value: "Spent" },
  { label: "Engagements", value: "Engagements" },
  { label: "Video views", value: "Video views" },
];

export const METRIC_DATA_LIST = [
  { label: "Impressions", value: "impressionData", invertCompare: false },
  { label: "Clicks", value: "clicksData", invertCompare: false },
  { label: "%CTR", value: "ctrData", invertCompare: false },
  { label: "Conversions", value: "conversionsData", invertCompare: false },
  { label: "%Conv rate", value: "conRateData", invertCompare: false },
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

export const GOOGLE_TABLE = [
  { label: "Keyword", value: "Keyword" },
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
