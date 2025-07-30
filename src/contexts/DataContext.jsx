// Add to DataContext.js - FacebookLead state variables (add after FacebookMessage states)

// Facebook Lead Data
const [FacebookLeadAudienceData, setFacebookLeadAudienceData] = useState({});
const [FacebookLeadAudienceTotals, setFacebookLeadAudienceTotals] = useState(
  {}
);
const [FacebookLeadCreativeData, setFacebookLeadCreativeData] = useState({});
const [FacebookLeadCreativeTotals, setFacebookLeadCreativeTotals] = useState(
  {}
);
const [FacebookLeadAudienceMetrics, setFacebookLeadAudienceMetrics] = useState(
  DEFAULT_METRICS.FacebookLead
);
const [FacebookLeadAudienceComparison, setFacebookLeadAudienceComparison] =
  useState({});

// Add to metricsMap (add after FacebookMessage entry)
const metricsMap = {
  overall: overallMetrics,
  SEM: SEMMetrics,
  GGDemographic: GGDemographicMetrics,
  GDN: GDNMetrics,
  Disc: DiscMetrics,
  FacebookAudience: FacebookAudienceMetrics,
  FacebookReach: FacebookReachAudienceMetrics,
  FacebookEngagement: FacebookEngagementAudienceMetrics,
  FacebookMessage: FacebookMessageAudienceMetrics,
  FacebookLead: FacebookLeadAudienceMetrics, // ✅ ADD THIS
  TikTokAudience: TikTokAudienceMetrics,
  InstagramAudience: InstagramAudienceMetrics,
};

// Add to settersMap (add after FacebookMessage setters)
const settersMap = createStateSettersMap({
  // ... existing setters ...
  setFacebookMessageAudienceData,
  setFacebookMessageAudienceTotals,
  setFacebookMessageCreativeData,
  setFacebookMessageCreativeTotals,
  setFacebookMessageAudienceMetrics,
  setFacebookMessageAudienceComparison,
  // ✅ ADD THESE FacebookLead setters
  setFacebookLeadAudienceData,
  setFacebookLeadAudienceTotals,
  setFacebookLeadCreativeData,
  setFacebookLeadCreativeTotals,
  setFacebookLeadAudienceMetrics,
  setFacebookLeadAudienceComparison,
  // ... remaining setters ...
});

// Add FacebookLead fetch function (add after getFacebookMessageData)
const getFacebookLeadData = async (id, filterBy = null, filterValue = null) => {
  const result = await fetchDataSheet(
    "FacebookLead",
    id,
    buildFetchOptions(filterBy, filterValue)
  );
  return result;
};

// Update fetchData function - add FacebookLead to promises array
const fetchData = useCallback(
  async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data types in parallel for better performance
      const promises = [
        getOverallData(id),
        getSEMData(id),
        getGGDemographic(id),
        getGDNData(id),
        getDiscData(id),
        getFacebookData(id),
        getFacebookReachData(id, "Channel", "FB Reach"),
        getFacebookEngagementData(id, "Channel", "FB Engagement"),
        getFacebookMessageData(id, "Channel", "FB Messages"),
        getFacebookLeadData(id, "Channel", "FB Lead"), // ✅ ADD THIS
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

// Update fetchDataType function - add FacebookLead mapping
const fetchDataType = useCallback(
  async (dataType, id, filterBy = null, filterValue = null) => {
    try {
      setLoading(true);
      setError(null);

      const fetchFunction = {
        overall: getOverallData,
        SEM: getSEMData,
        GGDemographic: getGGDemographic,
        GDN: getGDNData,
        Disc: getDiscData,
        FacebookAudience: getFacebookData,
        FacebookReach: getFacebookReachData,
        FacebookEngagement: getFacebookEngagementData,
        FacebookMessage: getFacebookMessageData,
        FacebookLead: getFacebookLeadData, // ✅ ADD THIS
        TikTokAudience: getTikTokData,
        InstagramAudience: getInstagramData,
      }[dataType];

      if (!fetchFunction) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      return await fetchFunction(id, filterBy, filterValue);
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

// Add to context value object (add after FacebookMessage values)
const value = {
  // ... existing values ...

  // Facebook Message
  FacebookMessageAudienceData,
  FacebookMessageAudienceTotals,
  FacebookMessageCreativeData,
  FacebookMessageCreativeTotals,
  FacebookMessageAudienceMetrics,
  FacebookMessageAudienceComparison,

  // Facebook Lead - ✅ ADD THESE
  FacebookLeadAudienceData,
  FacebookLeadAudienceTotals,
  FacebookLeadCreativeData,
  FacebookLeadCreativeTotals,
  FacebookLeadAudienceMetrics,
  FacebookLeadAudienceComparison,

  // ... remaining values ...
};
