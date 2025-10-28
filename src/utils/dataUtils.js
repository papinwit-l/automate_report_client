// utils/dataUtils.js

import { formatDisplayData } from "./dataDisplayUtils";

// Helper function to calculate date difference in days
export const getDateDifference = (from, to) => {
  const fromDate = from instanceof Date ? from : new Date(from);
  const toDate = to instanceof Date ? to : new Date(to);
  return Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24);
};

// Helper function to get previous period dates
export const getPreviousPeriodDates = (from, to) => {
  const fromDate = from instanceof Date ? from : new Date(from);
  const toDate = to instanceof Date ? to : new Date(to);

  const daysDifference = getDateDifference(fromDate, toDate);

  const previousTo = new Date(fromDate);
  previousTo.setDate(previousTo.getDate() - 1);

  const previousFrom = new Date(previousTo);
  previousFrom.setDate(previousFrom.getDate() - daysDifference);

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatDateLocal(previousFrom),
    to: formatDateLocal(previousTo),
  };
};

// Helper function to filter data by date range
// Helper function to convert Excel serial date to Date object
const serialToDate = (serial) => {
  if (typeof serial !== "number") return null;
  const epoch = new Date(1899, 11, 30);
  return new Date(epoch.getTime() + serial * 24 * 60 * 60 * 1000);
};

export const filterDataByDateRange = (data, from, to) => {
  if (!from || !to) return data;

  // Convert from/to to Date objects if they're strings
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Set time to start/end of day for accurate comparison
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);

  const filtered = data.filter((item) => {
    const itemDateValue = item["Updated Date"] || item["Date"];
    if (!itemDateValue) return false;

    let itemDate;

    // Handle serial number (from UNFORMATTED_VALUE)
    if (typeof itemDateValue === "number") {
      itemDate = serialToDate(itemDateValue);
      if (!itemDate) return false;
    }
    // Handle date string (YYYY-MM-DD or other formats)
    else if (typeof itemDateValue === "string") {
      itemDate = new Date(itemDateValue);
    }
    // Handle Date object
    else if (itemDateValue instanceof Date) {
      itemDate = itemDateValue;
    } else {
      return false;
    }

    // Check if date is valid
    if (isNaN(itemDate.getTime())) return false;

    // Compare dates
    return itemDate >= fromDate && itemDate <= toDate;
  });

  return filtered;
};

// Helper function to calculate comparison percentages
export const calculateComparison = (current, previous) => {
  const comparison = {};

  Object.keys(current).forEach((key) => {
    const currentValue = current[key];
    const previousValue = previous[key] || 0;

    if (typeof currentValue === "number" && typeof previousValue === "number") {
      if (previousValue === 0) {
        comparison[key] = currentValue > 0 ? 100 : 0;
      } else {
        const percentChange =
          ((currentValue - previousValue) / previousValue) * 100;
        comparison[key] = Number(percentChange.toFixed(2));
      }
    }
  });

  return comparison;
};

// Helper function to create state setters map
export const createStateSettersMap = (stateSetter) => {
  return {
    overall: {
      setData: stateSetter.setOverallData,
      setTotals: stateSetter.settotalsData,
      setMetrics: stateSetter.setOverallMetrics,
      setComparison: stateSetter.setcomparisonData,
    },
    SEM: {
      setData: stateSetter.setSEMData,
      setTotals: stateSetter.setSEMTotals,
      setMetrics: stateSetter.setSEMMetrics,
      setComparison: stateSetter.setSEMComparison,
    },
    GGDemographic: {
      setData: stateSetter.setGGDemographicData,
      setTotals: stateSetter.setGGDemographicTotals,
      setMetrics: stateSetter.setGGDemographicMetrics,
      setComparison: null,
    },
    GDN: {
      setData: stateSetter.setGDNData,
      setTotals: stateSetter.setGDNTotals,
      setMetrics: stateSetter.setGDNMetrics,
      setComparison: stateSetter.setGDNComparison,
    },
    Disc: {
      setData: stateSetter.setDiscData,
      setTotals: stateSetter.setDiscTotals,
      setMetrics: stateSetter.setDiscMetrics,
      setComparison: stateSetter.setDiscComparison,
    },
    Youtube: {
      setData: stateSetter.setYoutubeData,
      setTotals: stateSetter.setYoutubeTotals,
      setMetrics: stateSetter.setYoutubeMetrics,
      setComparison: stateSetter.setYoutubeComparison,
    },
    ShoppingAds: {
      setData: stateSetter.setShoppingAdsData,
      setTotals: stateSetter.setShoppingAdsTotals,
      setMetrics: stateSetter.setShoppingAdsMetrics,
      setComparison: stateSetter.setShoppingAdsComparison,
    },
    PerformanceMax: {
      setData: stateSetter.setPerformanceMaxData,
      setTotals: stateSetter.setPerformanceMaxTotals,
      setMetrics: stateSetter.setPerformanceMaxMetrics,
      setComparison: stateSetter.setPerformanceMaxComparison,
    },
    // Social media platforms
    FacebookAudience: {
      setAudienceData: stateSetter.setFacebookAudienceData,
      setAudienceTotals: stateSetter.setFacebookAudienceTotals,
      setCreativeData: stateSetter.setFacebookCreativeData,
      setCreativeTotals: stateSetter.setFacebookCreativeTotals,
      setMetrics: stateSetter.setFacebookAudienceMetrics,
      setComparison: stateSetter.setFacebookAudienceComparison,
    },
    FBDemographic: {
      setData: stateSetter.setFBDemographicData,
      setTotals: stateSetter.setFBDemographicTotals,
      setMetrics: stateSetter.setFBDemographicMetrics,
      setComparison: null,
    },
    FacebookAwareness: {
      setAudienceData: stateSetter.setFacebookAwarenessAudienceData,
      setAudienceTotals: stateSetter.setFacebookAwarenessAudienceTotals,
      setCreativeData: stateSetter.setFacebookAwarenessCreativeData,
      setCreativeTotals: stateSetter.setFacebookAwarenessCreativeTotals,
      setMetrics: stateSetter.setFacebookAwarenessAudienceMetrics,
      setComparison: stateSetter.setFacebookAwarenessAudienceComparison,
    },
    FacebookReach: {
      setAudienceData: stateSetter.setFacebookReachAudienceData,
      setAudienceTotals: stateSetter.setFacebookReachAudienceTotals,
      setCreativeData: stateSetter.setFacebookReachCreativeData,
      setCreativeTotals: stateSetter.setFacebookReachCreativeTotals,
      setMetrics: stateSetter.setFacebookReachAudienceMetrics,
      setComparison: stateSetter.setFacebookReachAudienceComparison,
    },
    FacebookEngagement: {
      setAudienceData: stateSetter.setFacebookEngagementAudienceData,
      setAudienceTotals: stateSetter.setFacebookEngagementAudienceTotals,
      setCreativeData: stateSetter.setFacebookEngagementCreativeData,
      setCreativeTotals: stateSetter.setFacebookEngagementCreativeTotals,
      setMetrics: stateSetter.setFacebookEngagementAudienceMetrics,
      setComparison: stateSetter.setFacebookEngagementAudienceComparison,
    },
    FacebookMessage: {
      setAudienceData: stateSetter.setFacebookMessageAudienceData,
      setAudienceTotals: stateSetter.setFacebookMessageAudienceTotals,
      setCreativeData: stateSetter.setFacebookMessageCreativeData,
      setCreativeTotals: stateSetter.setFacebookMessageCreativeTotals,
      setMetrics: stateSetter.setFacebookMessageAudienceMetrics,
      setComparison: stateSetter.setFacebookMessageAudienceComparison,
    },
    // ✅ ADD FacebookLead
    FacebookLead: {
      setAudienceData: stateSetter.setFacebookLeadAudienceData,
      setAudienceTotals: stateSetter.setFacebookLeadAudienceTotals,
      setCreativeData: stateSetter.setFacebookLeadCreativeData,
      setCreativeTotals: stateSetter.setFacebookLeadCreativeTotals,
      setMetrics: stateSetter.setFacebookLeadAudienceMetrics,
      setComparison: stateSetter.setFacebookLeadAudienceComparison,
    },
    // ✅ ADD FacebookConversion
    FacebookConversion: {
      setAudienceData: stateSetter.setFacebookConversionAudienceData,
      setAudienceTotals: stateSetter.setFacebookConversionAudienceTotals,
      setCreativeData: stateSetter.setFacebookConversionCreativeData,
      setCreativeTotals: stateSetter.setFacebookConversionCreativeTotals,
      setMetrics: stateSetter.setFacebookConversionAudienceMetrics,
      setComparison: stateSetter.setFacebookConversionAudienceComparison,
    },
    FacebookTraffic: {
      setAudienceData: stateSetter.setFacebookTrafficAudienceData,
      setAudienceTotals: stateSetter.setFacebookTrafficAudienceTotals,
      setCreativeData: stateSetter.setFacebookTrafficCreativeData,
      setCreativeTotals: stateSetter.setFacebookTrafficCreativeTotals,
      setMetrics: stateSetter.setFacebookTrafficAudienceMetrics,
      setComparison: stateSetter.setFacebookTrafficAudienceComparison,
    },
    FacebookVideo: {
      setAudienceData: stateSetter.setFacebookVideoAudienceData,
      setAudienceTotals: stateSetter.setFacebookVideoAudienceTotals,
      setCreativeData: stateSetter.setFacebookVideoCreativeData,
      setCreativeTotals: stateSetter.setFacebookVideoCreativeTotals,
      setMetrics: stateSetter.setFacebookVideoAudienceMetrics,
      setComparison: stateSetter.setFacebookVideoAudienceComparison,
    },
    FacebookCatalog: {
      setAudienceData: stateSetter.setFacebookCatalogAudienceData,
      setAudienceTotals: stateSetter.setFacebookCatalogAudienceTotals,
      setCreativeData: stateSetter.setFacebookCatalogCreativeData,
      setCreativeTotals: stateSetter.setFacebookCatalogCreativeTotals,
      setMetrics: stateSetter.setFacebookCatalogAudienceMetrics,
      setComparison: stateSetter.setFacebookCatalogAudienceComparison,
    },
    TikTokAudience: {
      setAudienceData: stateSetter.setTikTokAudienceData,
      setAudienceTotals: stateSetter.setTikTokAudienceTotals,
      setCreativeData: stateSetter.setTikTokCreativeData,
      setCreativeTotals: stateSetter.setTikTokCreativeTotals,
      setMetrics: stateSetter.setTikTokAudienceMetrics,
      setComparison: stateSetter.setTikTokAudienceComparison,
    },
    InstagramAudience: {
      setAudienceData: stateSetter.setInstagramAudienceData,
      setAudienceTotals: stateSetter.setInstagramAudienceTotals,
      setCreativeData: stateSetter.setInstagramCreativeData,
      setCreativeTotals: stateSetter.setInstagramCreativeTotals,
      setMetrics: stateSetter.setInstagramAudienceMetrics,
      setComparison: stateSetter.setInstagramAudienceComparison,
    },
    // TikTok campaign types
    TikTokLead: {
      setAudienceData: stateSetter.setTikTokLeadAudienceData,
      setAudienceTotals: stateSetter.setTikTokLeadAudienceTotals,
      setCreativeData: stateSetter.setTikTokLeadCreativeData,
      setCreativeTotals: stateSetter.setTikTokLeadCreativeTotals,
      setMetrics: stateSetter.setTikTokLeadAudienceMetrics,
      setComparison: stateSetter.setTikTokLeadAudienceComparison,
    },
    TikTokReach: {
      setAudienceData: stateSetter.setTikTokReachAudienceData,
      setAudienceTotals: stateSetter.setTikTokReachAudienceTotals,
      setCreativeData: stateSetter.setTikTokReachCreativeData,
      setCreativeTotals: stateSetter.setTikTokReachCreativeTotals,
      setMetrics: stateSetter.setTikTokReachAudienceMetrics,
      setComparison: stateSetter.setTikTokReachAudienceComparison,
    },
    TikTokTraffic: {
      setAudienceData: stateSetter.setTikTokTrafficAudienceData,
      setAudienceTotals: stateSetter.setTikTokTrafficAudienceTotals,
      setCreativeData: stateSetter.setTikTokTrafficCreativeData,
      setCreativeTotals: stateSetter.setTikTokTrafficCreativeTotals,
      setMetrics: stateSetter.setTikTokTrafficAudienceMetrics,
      setComparison: stateSetter.setTikTokTrafficAudienceComparison,
    },
    TikTokConversion: {
      setAudienceData: stateSetter.setTikTokConversionAudienceData,
      setAudienceTotals: stateSetter.setTikTokConversionAudienceTotals,
      setCreativeData: stateSetter.setTikTokConversionCreativeData,
      setCreativeTotals: stateSetter.setTikTokConversionCreativeTotals,
      setMetrics: stateSetter.setTikTokConversionAudienceMetrics,
      setComparison: stateSetter.setTikTokConversionAudienceComparison,
    },
    TikTokVideo: {
      setAudienceData: stateSetter.setTikTokVideoAudienceData,
      setAudienceTotals: stateSetter.setTikTokVideoAudienceTotals,
      setCreativeData: stateSetter.setTikTokVideoCreativeData,
      setCreativeTotals: stateSetter.setTikTokVideoCreativeTotals,
      setMetrics: stateSetter.setTikTokVideoAudienceMetrics,
      setComparison: stateSetter.setTikTokVideoAudienceComparison,
    },
    TikTokFollower: {
      setAudienceData: stateSetter.setTikTokFollowerAudienceData,
      setAudienceTotals: stateSetter.setTikTokFollowerAudienceTotals,
      setCreativeData: stateSetter.setTikTokFollowerCreativeData,
      setCreativeTotals: stateSetter.setTikTokFollowerCreativeTotals,
      setMetrics: stateSetter.setTikTokFollowerAudienceMetrics,
      setComparison: stateSetter.setTikTokFollowerAudienceComparison,
    },
    LineReach: {
      setAudienceData: stateSetter.setLineReachAudienceData,
      setAudienceTotals: stateSetter.setLineReachAudienceTotals,
      setCreativeData: stateSetter.setLineReachCreativeData,
      setCreativeTotals: stateSetter.setLineReachCreativeTotals,
      setMetrics: stateSetter.setLineReachAudienceMetrics,
      setComparison: stateSetter.setLineReachAudienceComparison,
    },
    LineGainFriends: {
      setAudienceData: stateSetter.setLineGainFriendsAudienceData,
      setAudienceTotals: stateSetter.setLineGainFriendsAudienceTotals,
      setCreativeData: stateSetter.setLineGainFriendsCreativeData,
      setCreativeTotals: stateSetter.setLineGainFriendsCreativeTotals,
      setMetrics: stateSetter.setLineGainFriendsAudienceMetrics,
      setComparison: stateSetter.setLineGainFriendsAudienceComparison,
    },
    Taboola: {
      setData: stateSetter.setTaboolaData,
      setTotals: stateSetter.setTaboolaTotals,
      setMetrics: stateSetter.setTaboolaMetrics,
      setComparison: stateSetter.setTaboolaComparison,
    },
  };
};

export const metricDataProcess = (totalsData, comparisonData) => {
  const result = {
    impressionData: formatDisplayData(
      totalsData?.impressions || totalsData?.Impressions,
      comparisonData?.impressions || comparisonData?.Impressions,
      "compact"
    ),
    clicksData: formatDisplayData(
      totalsData?.clicks || totalsData?.Clicks,
      comparisonData?.clicks || comparisonData?.Clicks,
      "compact"
    ),
    ctrData: formatDisplayData(
      totalsData?.ctr,
      comparisonData?.ctr,
      "percentage"
    ),
    cpcData: formatDisplayData(totalsData?.cpc, comparisonData?.cpc, "compact"),
    conversionsData: formatDisplayData(
      totalsData?.conversions || totalsData?.Conversions,
      comparisonData?.conversions || comparisonData?.Conversions,
      "number"
    ),
    cplData: formatDisplayData(totalsData?.cpl, comparisonData?.cpl, "compact"),
    cpaData: formatDisplayData(totalsData?.cpa, comparisonData?.cpa, "compact"),
    spentData: formatDisplayData(
      totalsData?.spent || totalsData?.Spent,
      comparisonData?.spent || comparisonData?.Spent,
      "compact"
    ),
    cpmData: formatDisplayData(totalsData?.cpm, comparisonData?.cpm, "compact"),
    reachData: formatDisplayData(
      totalsData?.reach || totalsData?.Reach,
      comparisonData?.reach || comparisonData?.Reach,
      "compact"
    ),
    frequencyData: formatDisplayData(
      totalsData?.frequency || totalsData?.Frequency,
      comparisonData?.frequency || comparisonData?.Frequency,
      "compact"
    ),
    cprData: formatDisplayData(totalsData?.cpr, comparisonData?.cpr, "compact"),
    engagementData: formatDisplayData(
      totalsData?.engagements || totalsData?.Engagements,
      comparisonData?.engagements || comparisonData?.Engagements,
      "compact"
    ),
    engagementRateData: formatDisplayData(
      totalsData?.engagementRate,
      comparisonData?.engagementRate,
      "percentage"
    ),
    cpeData: formatDisplayData(totalsData?.cpe, comparisonData?.cpe, "compact"),
    viewRateData: formatDisplayData(
      totalsData?.viewRate,
      comparisonData?.viewRate,
      "percentage"
    ),
    VideoViewsData: formatDisplayData(
      totalsData["views"],
      comparisonData["views"],
      "number"
    ),
    cpvData: formatDisplayData(totalsData?.cpv, comparisonData?.cpv, "compact"),
    conRateData: formatDisplayData(
      totalsData?.cvr || totalsData?.conRate,
      comparisonData?.cvr || comparisonData?.conRate,
      "percentage"
    ),
    purchaseConValueData: formatDisplayData(
      totalsData?.purchaseConValue,
      comparisonData?.purchaseConValue,
      "compact"
    ),
    roasData: formatDisplayData(
      totalsData?.roas,
      comparisonData?.roas,
      "compact"
    ),
    purchaseData: formatDisplayData(
      totalsData?.purchase,
      comparisonData?.purchase,
      "number"
    ),
    addToCartData: formatDisplayData(
      totalsData?.addToCart,
      comparisonData?.addToCart,
      "number"
    ),
    view6secData: formatDisplayData(
      totalsData?.view6sec,
      comparisonData?.view6sec,
      "number"
    ),
  };

  return result;
};

export const chartDataProcess = (demoData, chartTemplate) => {};
