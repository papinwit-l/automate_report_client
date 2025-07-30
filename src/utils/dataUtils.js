// Add to dataUtils.js - Update createStateSettersMap function

export const createStateSettersMap = (stateSetter) => {
  return {
    overall: {
      setData: stateSetter.setOverallData,
      setTotals: stateSetter.setOverallTotals,
      setMetrics: stateSetter.setOverallMetrics,
      setComparison: stateSetter.setOverallComparison,
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
