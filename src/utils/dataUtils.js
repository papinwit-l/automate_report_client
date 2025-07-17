// utils/dataUtils.js

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
export const filterDataByDateRange = (data, from, to) => {
  if (!from || !to) return data;

  const formatDateLocal = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  const fromStr = formatDateLocal(from);
  const toStr = formatDateLocal(to);

  const filtered = data.filter((item) => {
    const itemDate = item["Updated Date"];
    if (!itemDate) return false;

    const itemDateStr = itemDate.toString().trim();
    return itemDateStr >= fromStr && itemDateStr <= toStr;
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
    // Social media platforms
    FacebookAudience: {
      setAudienceData: stateSetter.setFacebookAudienceData,
      setAudienceTotals: stateSetter.setFacebookAudienceTotals,
      setCreativeData: stateSetter.setFacebookCreativeData,
      setCreativeTotals: stateSetter.setFacebookCreativeTotals,
      setMetrics: stateSetter.setFacebookAudienceMetrics,
      setComparison: stateSetter.setFacebookAudienceComparison,
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
  };
};
