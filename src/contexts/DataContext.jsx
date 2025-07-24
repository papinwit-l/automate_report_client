// contexts/DataContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import { fetchDataSheet } from "../services/dataServices";
import { createStateSettersMap } from "../utils/dataUtils";
import { DEFAULT_METRICS } from "../configs/dataConfigs";
import axios from "axios";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Global state
  const [enableDateRange, setEnableDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // SEM Data
  const [SEMData, setSEMData] = useState({});
  const [SEMTotals, setSEMTotals] = useState({});
  const [SEMMetrics, setSEMMetrics] = useState(DEFAULT_METRICS.SEM);
  const [SEMComparison, setSEMComparison] = useState({});

  // GG Demographic Data
  const [GGDemographicData, setGGDemographicData] = useState({});
  const [GGDemographicTotals, setGGDemographicTotals] = useState({});
  const [GGDemographicMetrics, setGGDemographicMetrics] = useState(
    DEFAULT_METRICS.GGDemographic
  );

  // GDN Data
  const [GDNData, setGDNData] = useState({});
  const [GDNTotals, setGDNTotals] = useState({});
  const [GDNMetrics, setGDNMetrics] = useState(DEFAULT_METRICS.GDN);
  const [GDNComparison, setGDNComparison] = useState({});

  // Disc Data
  const [DiscData, setDiscData] = useState({});
  const [DiscTotals, setDiscTotals] = useState({});
  const [DiscMetrics, setDiscMetrics] = useState(DEFAULT_METRICS.Disc);
  const [DiscComparison, setDiscComparison] = useState({});

  // Facebook Data
  const [FacebookAudienceData, setFacebookAudienceData] = useState({});
  const [FacebookAudienceTotals, setFacebookAudienceTotals] = useState({});
  const [FacebookCreativeData, setFacebookCreativeData] = useState({});
  const [FacebookCreativeTotals, setFacebookCreativeTotals] = useState({});
  const [FacebookAudienceMetrics, setFacebookAudienceMetrics] = useState(
    DEFAULT_METRICS.FacebookAudience
  );
  const [FacebookAudienceComparison, setFacebookAudienceComparison] = useState(
    {}
  );

  const [FBDemographicData, setFBDemographicData] = useState({});
  const [FBDemographicTotals, setFBDemographicTotals] = useState({});
  const [FBDemographicMetrics, setFBDemographicMetrics] = useState(
    DEFAULT_METRICS.FBDemographic
  );

  // Facebook Reach Data (separate state for filtered data)
  const [FacebookReachAudienceData, setFacebookReachAudienceData] = useState(
    {}
  );
  const [FacebookReachAudienceTotals, setFacebookReachAudienceTotals] =
    useState({});
  const [FacebookReachCreativeData, setFacebookReachCreativeData] = useState(
    {}
  );
  const [FacebookReachCreativeTotals, setFacebookReachCreativeTotals] =
    useState({});
  const [FacebookReachAudienceMetrics, setFacebookReachAudienceMetrics] =
    useState(
      DEFAULT_METRICS.FacebookAudience // ✅ FIXED: Use FacebookAudience instead of FacebookReach
    );
  const [FacebookReachAudienceComparison, setFacebookReachAudienceComparison] =
    useState({});

  const [FacebookAdsPicture, setFacebookAdsPicture] = useState({});

  // TikTok Data
  const [TikTokAudienceData, setTikTokAudienceData] = useState({});
  const [TikTokAudienceTotals, setTikTokAudienceTotals] = useState({});
  const [TikTokCreativeData, setTikTokCreativeData] = useState({});
  const [TikTokCreativeTotals, setTikTokCreativeTotals] = useState({});
  const [TikTokAudienceMetrics, setTikTokAudienceMetrics] = useState(
    DEFAULT_METRICS.TikTokAudience
  );
  const [TikTokAudienceComparison, setTikTokAudienceComparison] = useState({});

  // Instagram Data
  const [InstagramAudienceData, setInstagramAudienceData] = useState({});
  const [InstagramAudienceTotals, setInstagramAudienceTotals] = useState({});
  const [InstagramCreativeData, setInstagramCreativeData] = useState({});
  const [InstagramCreativeTotals, setInstagramCreativeTotals] = useState({});
  const [InstagramAudienceMetrics, setInstagramAudienceMetrics] = useState(
    DEFAULT_METRICS.InstagramAudience
  );
  const [InstagramAudienceComparison, setInstagramAudienceComparison] =
    useState({});

  // Create metrics map
  const metricsMap = {
    SEM: SEMMetrics,
    GGDemographic: GGDemographicMetrics,
    GDN: GDNMetrics,
    Disc: DiscMetrics,
    FacebookAudience: FacebookAudienceMetrics,
    FacebookReach: FacebookReachAudienceMetrics, // ✅ ADDED: Missing FacebookReach entry
    TikTokAudience: TikTokAudienceMetrics,
    InstagramAudience: InstagramAudienceMetrics,
  };

  // Create setters map
  const settersMap = createStateSettersMap({
    setSEMData,
    setSEMTotals,
    setSEMMetrics,
    setSEMComparison,
    setGGDemographicData,
    setGGDemographicTotals,
    setGGDemographicMetrics,
    setGDNData,
    setGDNTotals,
    setGDNMetrics,
    setGDNComparison,
    setDiscData,
    setDiscTotals,
    setDiscMetrics,
    setDiscComparison,
    setFacebookAudienceData,
    setFacebookAudienceTotals,
    setFacebookCreativeData,
    setFacebookCreativeTotals,
    setFacebookAudienceMetrics,
    setFacebookAudienceComparison,
    setFBDemographicData,
    setFBDemographicMetrics,
    setFBDemographicTotals,
    setFacebookReachAudienceData,
    setFacebookReachAudienceTotals,
    setFacebookReachCreativeData,
    setFacebookReachCreativeTotals,
    setFacebookReachAudienceMetrics,
    setFacebookReachAudienceComparison,
    setTikTokAudienceData,
    setTikTokAudienceTotals,
    setTikTokCreativeData,
    setTikTokCreativeTotals,
    setTikTokAudienceMetrics,
    setTikTokAudienceComparison,
    setInstagramAudienceData,
    setInstagramAudienceTotals,
    setInstagramCreativeData,
    setInstagramCreativeTotals,
    setInstagramAudienceMetrics,
    setInstagramAudienceComparison,
  });

  // Helper function to build fetch options
  const buildFetchOptions = (filterBy = null, filterValue = null) => ({
    enableDateRange,
    dateRange,
    metricsMap,
    settersMap,
    filterBy,
    filterValue,
  });

  // Individual data fetching functions
  const getSEMData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "SEM",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getGGDemographic = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "GGDemographic",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getGDNData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "GDN",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getDiscData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "Disc",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
    // console.log("🎯 getDiscData result:", result);
    return result;
  };

  const getFacebookData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "FacebookAudience",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getFacebookReachData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    // console.log("🎯 getFacebookReachData called with:", {
    //   id,
    //   filterBy,
    //   filterValue,
    // });

    const result = await fetchDataSheet(
      "FacebookReach",
      id,
      buildFetchOptions(filterBy, filterValue)
    );

    // console.log("📊 getFacebookReachData result:", result);
    return result;
  };

  const getTikTokData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "TikTokAudience",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getInstagramData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "InstagramAudience",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
  };

  const getFBDemographicData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    const result = await fetchDataSheet(
      "FBDemographic",
      id,
      buildFetchOptions(filterBy, filterValue)
    );
    console.log("FB Demo", result);
    return result;
  };

  // Main fetch function
  const fetchData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data types in parallel for better performance
        const promises = [
          getSEMData(id),
          getGGDemographic(id),
          getGDNData(id),
          getDiscData(id),
          getFacebookData(id),
          getFacebookReachData(id, "Channel", "FB Reach"),
          getFBDemographicData(id),
          fetchFacebookPicture(id),
          // getTikTokData(id),
          // getInstagramData(id),
        ];

        await Promise.all(promises);
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "Failed to fetch data. Please try again.";
        alert(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [enableDateRange, dateRange, metricsMap]
  );

  // ✅ FIXED: Updated fetchDataType to support filtering
  const fetchDataType = useCallback(
    async (dataType, id, filterBy = null, filterValue = null) => {
      try {
        setLoading(true);
        setError(null);

        const fetchFunction = {
          SEM: getSEMData,
          GGDemographic: getGGDemographic,
          GDN: getGDNData,
          Disc: getDiscData,
          FacebookAudience: getFacebookData,
          FacebookReach: getFacebookReachData, // ✅ ADDED: Missing FacebookReach mapping
          TikTokAudience: getTikTokData,
          InstagramAudience: getInstagramData,
        }[dataType];

        if (!fetchFunction) {
          throw new Error(`Unknown data type: ${dataType}`);
        }

        return await fetchFunction(id, filterBy, filterValue); // ✅ FIXED: Pass filter parameters
      } catch (err) {
        console.error(`Error fetching ${dataType} data:`, err);
        const errorMessage =
          err?.response?.data?.message ||
          `Failed to fetch ${dataType} data. Please try again.`;
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [enableDateRange, dateRange, metricsMap]
  );

  // const getFBDemographic = async (id) => {
  //   const rawData = await fetchDemographic(id, "fb-demographic");
  // };

  // const fetchDemographic = async (id, endpoint) => {
  //   const response = await axios.get(
  //     `http://localhost:8000/data-sheets/${endpoint}/${id}`
  //   );
  //   const rawData = response.data.data;
  //   const headers = rawData[0];
  //   const dataRows = rawData.slice(1);
  //   const dataObjects = dataRows.map((row) =>
  //     Object.fromEntries(headers.map((header, index) => [header, row[index]]))
  //   );
  //   const dateFilteredData = filterDataByDate(dataObjects, dateRange);
  //   return dateFilteredData;
  // };

  const fetchFacebookPicture = async (id) => {
    const response = await axios.get(
      `http://localhost:8000/data-sheets/facebook-picture/${id}`
    );
    const rawData = response.data.data;
    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    // Transform raw data to objects
    const dataObjects = dataRows.map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index]]))
    );
    // console.log("dataObjects", dataObjects);
    const dateFilteredData = filterDataByDate(dataObjects, dateRange);
    // console.log("data:", dateFilteredData);
    const resultData = removeDuplicateByColumnMap(dateFilteredData, "Ad name");
    // console.log("resultData:", resultData);
    setFacebookAdsPicture(resultData);
  };

  const filterDataByColumn = (data, column, columnValue, options = {}) => {
    if (!Array.isArray(data)) return [];

    return data.filter((item) => {
      const value = item?.[column];
      return options.strictEquality
        ? value === columnValue
        : value == columnValue;
    });
  };

  function filterDataByDate(data, dateRange) {
    const { from, to } = dateRange;
    if (!from || !to) {
      return data;
    }

    // Convert filter dates from UTC to UTC+7 for comparison
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Add 7 hours to convert UTC to UTC+7
    const fromDateUTC7 = new Date(fromDate.getTime() + 7 * 60 * 60 * 1000);
    const toDateUTC7 = new Date(toDate.getTime() + 7 * 60 * 60 * 1000);

    // Format to YYYY-MM-DD for comparison
    const fromDateStr = fromDateUTC7.toISOString().split("T")[0];
    const toDateStr = toDateUTC7.toISOString().split("T")[0];

    return data.filter((item) => {
      const itemDate = item["Updated Date"];
      return itemDate >= fromDateStr && itemDate <= toDateStr;
    });
  }

  const removeDuplicateByColumnMap = (data, column) => {
    const map = new Map();

    for (const item of data) {
      const key = item[column];
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    return Array.from(map.values());
  };

  const value = {
    // Global state
    loading,
    error,
    enableDateRange,
    setEnableDateRange,
    dateRange,
    setDateRange,

    // Fetch functions
    fetchData,
    fetchDataType,

    // SEM
    SEMData,
    SEMTotals,
    SEMMetrics,
    SEMComparison,

    // GG Demographic
    GGDemographicData,
    GGDemographicTotals,
    GGDemographicMetrics,

    // GDN
    GDNData,
    GDNTotals,
    GDNMetrics,
    GDNComparison,

    // Disc
    DiscData,
    DiscTotals,
    DiscMetrics,
    DiscComparison,

    // Facebook
    FacebookAudienceData,
    FacebookAudienceTotals,
    FacebookCreativeData,
    FacebookCreativeTotals,
    FacebookAudienceMetrics,
    FacebookAudienceComparison,
    FacebookAdsPicture,
    FBDemographicData,

    // Facebook Reach (filtered data)
    FacebookReachAudienceData,
    FacebookReachAudienceTotals,
    FacebookReachCreativeData,
    FacebookReachCreativeTotals,
    FacebookReachAudienceMetrics,
    FacebookReachAudienceComparison,

    // TikTok
    TikTokAudienceData,
    TikTokAudienceTotals,
    TikTokCreativeData,
    TikTokCreativeTotals,
    TikTokAudienceMetrics,
    TikTokAudienceComparison,

    // Instagram
    InstagramAudienceData,
    InstagramAudienceTotals,
    InstagramCreativeData,
    InstagramCreativeTotals,
    InstagramAudienceMetrics,
    InstagramAudienceComparison,

    //function
    fetchFacebookPicture,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
