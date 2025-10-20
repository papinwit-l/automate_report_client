// contexts/DataContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  fetchDataSheet,
  fetchDataSheetEnhanced,
} from "../services/dataServices";
import { createStateSettersMap } from "../utils/dataUtils";
import { DEFAULT_METRICS } from "../configs/dataConfigs";
import { FACEBOOK_CHANNELS_MAP } from "@/configs/facebookDataConfigs";
import { TIKTOK_CHANNELS_MAP } from "@/configs/tiktokDataConfigs";
import createAxiosInstance from "../configs/axiosConfigs";

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
  const [enableProjectFilter, setEnableProjectFilter] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //template
  const [template, setTemplate] = useState("default");

  const [notFoundSheetList, setNotFoundSheetList] = useState([]);

  // Smart Slide Detection
  const [enableSmartSlideDetection, setEnableSmartSlideDetection] =
    useState(true);
  const [slideDetectedList, setSlideDetectedList] = useState([]);

  //custom slide
  const [enableCustomTemplate, setEnableCustomTemplate] = useState(false);

  //Overall Data
  const [overallData, setOverallData] = useState({});
  const [overallTotals, setOverallTotals] = useState({});
  const [overallMetrics, setOverallMetrics] = useState(DEFAULT_METRICS.overall);
  const [overallComparison, setOverallComparison] = useState({});

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

  // Youtube Data
  const [YoutubeData, setYoutubeData] = useState({});
  const [YoutubeTotals, setYoutubeTotals] = useState({});
  const [YoutubeMetrics, setYoutubeMetrics] = useState(DEFAULT_METRICS.Youtube);
  const [YoutubeComparison, setYoutubeComparison] = useState({});

  // Shopping Ads Data
  const [ShoppingAdsData, setShoppingAdsData] = useState({});
  const [ShoppingAdsTotals, setShoppingAdsTotals] = useState({});
  const [ShoppingAdsMetrics, setShoppingAdsMetrics] = useState(
    DEFAULT_METRICS.ShoppingAds
  );
  const [ShoppingAdsComparison, setShoppingAdsComparison] = useState({});

  // Performance Max Data
  const [PerformanceMaxData, setPerformanceMaxData] = useState({});
  const [PerformanceMaxTotals, setPerformanceMaxTotals] = useState({});
  const [PerformanceMaxMetrics, setPerformanceMaxMetrics] = useState(
    DEFAULT_METRICS.PerformanceMax
  );
  const [PerformanceMaxComparison, setPerformanceMaxComparison] = useState({});

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

  // Facebook Awareness Data
  const [FacebookAwarenessAudienceData, setFacebookAwarenessAudienceData] =
    useState({});
  const [FacebookAwarenessAudienceTotals, setFacebookAwarenessAudienceTotals] =
    useState({});
  const [FacebookAwarenessCreativeData, setFacebookAwarenessCreativeData] =
    useState({});
  const [FacebookAwarenessCreativeTotals, setFacebookAwarenessCreativeTotals] =
    useState({});
  const [
    FacebookAwarenessAudienceMetrics,
    setFacebookAwarenessAudienceMetrics,
  ] = useState(DEFAULT_METRICS.FacebookAwareness);
  const [
    FacebookAwarenessAudienceComparison,
    setFacebookAwarenessAudienceComparison,
  ] = useState({});

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
    useState(DEFAULT_METRICS.FacebookAudience);
  const [FacebookReachAudienceComparison, setFacebookReachAudienceComparison] =
    useState({});

  //Facebook Engagement Data
  const [FacebookEngagementAudienceData, setFacebookEngagementAudienceData] =
    useState({});
  const [
    FacebookEngagementAudienceTotals,
    setFacebookEngagementAudienceTotals,
  ] = useState({});
  const [FacebookEngagementCreativeData, setFacebookEngagementCreativeData] =
    useState({});
  const [
    FacebookEngagementCreativeTotals,
    setFacebookEngagementCreativeTotals,
  ] = useState({});
  const [
    FacebookEngagementAudienceMetrics,
    setFacebookEngagementAudienceMetrics,
  ] = useState(DEFAULT_METRICS.FacebookAudience);
  const [
    FacebookEngagementAudienceComparison,
    setFacebookEngagementAudienceComparison,
  ] = useState({});

  // Facebook Message Data
  const [FacebookMessageAudienceData, setFacebookMessageAudienceData] =
    useState({});
  const [FacebookMessageAudienceTotals, setFacebookMessageAudienceTotals] =
    useState({});
  const [FacebookMessageCreativeData, setFacebookMessageCreativeData] =
    useState({});
  const [FacebookMessageCreativeTotals, setFacebookMessageCreativeTotals] =
    useState({});
  const [FacebookMessageAudienceMetrics, setFacebookMessageAudienceMetrics] =
    useState(DEFAULT_METRICS.FacebookMessage);
  const [
    FacebookMessageAudienceComparison,
    setFacebookMessageAudienceComparison,
  ] = useState({});

  // Facebook Lead Data
  const [FacebookLeadAudienceData, setFacebookLeadAudienceData] = useState({});
  const [FacebookLeadAudienceTotals, setFacebookLeadAudienceTotals] = useState(
    {}
  );
  const [FacebookLeadCreativeData, setFacebookLeadCreativeData] = useState({});
  const [FacebookLeadCreativeTotals, setFacebookLeadCreativeTotals] = useState(
    {}
  );
  const [FacebookLeadAudienceMetrics, setFacebookLeadAudienceMetrics] =
    useState(DEFAULT_METRICS.FacebookLead);
  const [FacebookLeadAudienceComparison, setFacebookLeadAudienceComparison] =
    useState({});

  // Facebook Conversion Data
  const [FacebookConversionAudienceData, setFacebookConversionAudienceData] =
    useState({});
  const [
    FacebookConversionAudienceTotals,
    setFacebookConversionAudienceTotals,
  ] = useState({});
  const [FacebookConversionCreativeData, setFacebookConversionCreativeData] =
    useState({});
  const [
    FacebookConversionCreativeTotals,
    setFacebookConversionCreativeTotals,
  ] = useState({});
  const [
    FacebookConversionAudienceMetrics,
    setFacebookConversionAudienceMetrics,
  ] = useState(DEFAULT_METRICS.FacebookConversion);
  const [
    FacebookConversionAudienceComparison,
    setFacebookConversionAudienceComparison,
  ] = useState({});

  // Facebook Traffic Data
  const [FacebookTrafficAudienceData, setFacebookTrafficAudienceData] =
    useState({});
  const [FacebookTrafficAudienceTotals, setFacebookTrafficAudienceTotals] =
    useState({});
  const [FacebookTrafficCreativeData, setFacebookTrafficCreativeData] =
    useState({});
  const [FacebookTrafficCreativeTotals, setFacebookTrafficCreativeTotals] =
    useState({});
  const [FacebookTrafficAudienceMetrics, setFacebookTrafficAudienceMetrics] =
    useState(DEFAULT_METRICS.FacebookTraffic);
  const [
    FacebookTrafficAudienceComparison,
    setFacebookTrafficAudienceComparison,
  ] = useState({});

  // Facebook Video
  const [FacebookVideoAudienceData, setFacebookVideoAudienceData] = useState(
    {}
  );
  const [FacebookVideoAudienceTotals, setFacebookVideoAudienceTotals] =
    useState({});
  const [FacebookVideoAudienceMetrics, setFacebookVideoAudienceMetrics] =
    useState(DEFAULT_METRICS.FacebookVideo);
  const [FacebookVideoComparison, setFacebookVideoComparison] = useState({});
  const [FacebookVideoCreativeData, setFacebookVideoCreativeData] = useState(
    {}
  );
  const [FacebookVideoCreativeTotals, setFacebookVideoCreativeTotals] =
    useState({});

  const [FacebookCatalogAudienceData, setFacebookCatalogAudienceData] =
    useState({});
  const [FacebookCatalogAudienceTotals, setFacebookCatalogAudienceTotals] =
    useState({});
  const [FacebookCatalogCreativeData, setFacebookCatalogCreativeData] =
    useState({});
  const [FacebookCatalogCreativeTotals, setFacebookCatalogCreativeTotals] =
    useState({});
  const [FacebookCatalogAudienceMetrics, setFacebookCatalogAudienceMetrics] =
    useState(DEFAULT_METRICS.FacebookCatalog);
  const [
    FacebookCatalogAudienceComparison,
    setFacebookCatalogAudienceComparison,
  ] = useState({});

  // Facebook Ads
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

  // TikTok Lead Data
  const [TikTokLeadAudienceData, setTikTokLeadAudienceData] = useState({});
  const [TikTokLeadAudienceTotals, setTikTokLeadAudienceTotals] = useState({});
  const [TikTokLeadCreativeData, setTikTokLeadCreativeData] = useState({});
  const [TikTokLeadCreativeTotals, setTikTokLeadCreativeTotals] = useState({});
  const [TikTokLeadAudienceMetrics, setTikTokLeadAudienceMetrics] = useState(
    DEFAULT_METRICS.TikTokLead
  );
  const [TikTokLeadAudienceComparison, setTikTokLeadAudienceComparison] =
    useState({});

  // TikTok Reach Data
  const [TikTokReachAudienceData, setTikTokReachAudienceData] = useState({});
  const [TikTokReachAudienceTotals, setTikTokReachAudienceTotals] = useState(
    {}
  );
  const [TikTokReachCreativeData, setTikTokReachCreativeData] = useState({});
  const [TikTokReachCreativeTotals, setTikTokReachCreativeTotals] = useState(
    {}
  );
  const [TikTokReachAudienceMetrics, setTikTokReachAudienceMetrics] = useState(
    DEFAULT_METRICS.TikTokReach
  );
  const [TikTokReachAudienceComparison, setTikTokReachAudienceComparison] =
    useState({});

  // TikTok Traffic Data
  const [TikTokTrafficAudienceData, setTikTokTrafficAudienceData] = useState(
    {}
  );
  const [TikTokTrafficAudienceTotals, setTikTokTrafficAudienceTotals] =
    useState({});
  const [TikTokTrafficCreativeData, setTikTokTrafficCreativeData] = useState(
    {}
  );
  const [TikTokTrafficCreativeTotals, setTikTokTrafficCreativeTotals] =
    useState({});
  const [TikTokTrafficAudienceMetrics, setTikTokTrafficAudienceMetrics] =
    useState(DEFAULT_METRICS.TikTokTraffic);
  const [TikTokTrafficAudienceComparison, setTikTokTrafficAudienceComparison] =
    useState({});

  // TikTok Conversion Data
  const [TikTokConversionAudienceData, setTikTokConversionAudienceData] =
    useState({});
  const [TikTokConversionAudienceTotals, setTikTokConversionAudienceTotals] =
    useState({});
  const [TikTokConversionCreativeData, setTikTokConversionCreativeData] =
    useState({});
  const [TikTokConversionCreativeTotals, setTikTokConversionCreativeTotals] =
    useState({});
  const [TikTokConversionAudienceMetrics, setTikTokConversionAudienceMetrics] =
    useState(DEFAULT_METRICS.TikTokConversion);
  const [
    TikTokConversionAudienceComparison,
    setTikTokConversionAudienceComparison,
  ] = useState({});

  // TikTok Video Data
  const [TikTokVideoAudienceData, setTikTokVideoAudienceData] = useState({});
  const [TikTokVideoAudienceTotals, setTikTokVideoAudienceTotals] = useState(
    {}
  );
  const [TikTokVideoCreativeData, setTikTokVideoCreativeData] = useState({});
  const [TikTokVideoCreativeTotals, setTikTokVideoCreativeTotals] = useState(
    {}
  );
  const [TikTokVideoAudienceMetrics, setTikTokVideoAudienceMetrics] = useState(
    DEFAULT_METRICS.TikTokVideo
  );
  const [TikTokVideoAudienceComparison, setTikTokVideoAudienceComparison] =
    useState({});

  // TikTok Follower Data
  const [TikTokFollowerAudienceData, setTikTokFollowerAudienceData] = useState(
    {}
  );
  const [TikTokFollowerAudienceTotals, setTikTokFollowerAudienceTotals] =
    useState({});
  const [TikTokFollowerCreativeData, setTikTokFollowerCreativeData] = useState(
    {}
  );
  const [TikTokFollowerCreativeTotals, setTikTokFollowerCreativeTotals] =
    useState({});
  const [TikTokFollowerAudienceMetrics, setTikTokFollowerAudienceMetrics] =
    useState(DEFAULT_METRICS.TikTokFollower);
  const [
    TikTokFollowerAudienceComparison,
    setTikTokFollowerAudienceComparison,
  ] = useState({});

  // Line Reach
  const [LineReachAudienceData, setLineReachAudienceData] = useState({});
  const [LineReachAudienceTotals, setLineReachAudienceTotals] = useState({});
  const [LineReachCreativeData, setLineReachCreativeData] = useState({});
  const [LineReachCreativeTotals, setLineReachCreativeTotals] = useState({});
  const [LineReachAudienceMetrics, setLineReachAudienceMetrics] = useState(
    DEFAULT_METRICS.LineReach
  );
  const [LineReachAudienceComparison, setLineReachAudienceComparison] =
    useState({});

  //Line Gain Friends
  const [LineGainFriendsAudienceData, setLineGainFriendsAudienceData] =
    useState({});
  const [LineGainFriendsAudienceTotals, setLineGainFriendsAudienceTotals] =
    useState({});
  const [LineGainFriendsCreativeData, setLineGainFriendsCreativeData] =
    useState({});
  const [LineGainFriendsCreativeTotals, setLineGainFriendsCreativeTotals] =
    useState({});
  const [LineGainFriendsAudienceMetrics, setLineGainFriendsAudienceMetrics] =
    useState(DEFAULT_METRICS.LineGainFriends);
  const [
    LineGainFriendsAudienceComparison,
    setLineGainFriendsAudienceComparison,
  ] = useState({});

  // Taboola
  const [TaboolaData, setTaboolaData] = useState({});
  const [TaboolaTotals, setTaboolaTotals] = useState({});
  const [TaboolaMetrics, setTaboolaMetrics] = useState(DEFAULT_METRICS.Taboola);
  const [TaboolaComparison, setTaboolaComparison] = useState({});

  // Create metrics map
  const metricsMap = {
    overall: overallMetrics,
    SEM: SEMMetrics,
    GGDemographic: GGDemographicMetrics,
    GDN: GDNMetrics,
    Disc: DiscMetrics,
    Youtube: YoutubeMetrics,
    ShoppingAds: ShoppingAdsMetrics,
    PerformanceMax: PerformanceMaxMetrics,
    FacebookAudience: FacebookAudienceMetrics,
    FacebookAwareness: FacebookAwarenessAudienceMetrics,
    FacebookReach: FacebookReachAudienceMetrics, // ✅ ADDED: Missing FacebookReach entry
    FacebookEngagement: FacebookEngagementAudienceMetrics,
    FacebookMessage: FacebookMessageAudienceMetrics,
    FacebookLead: FacebookLeadAudienceMetrics,
    FacebookConversion: FacebookConversionAudienceMetrics,
    FacebookTraffic: FacebookTrafficAudienceMetrics,
    FacebookVideo: FacebookVideoAudienceMetrics,
    FacebookCatalog: FacebookCatalogAudienceMetrics,
    TikTokAudience: TikTokAudienceMetrics,
    TikTokLead: TikTokLeadAudienceMetrics,
    TikTokReach: TikTokReachAudienceMetrics,
    TikTokTraffic: TikTokTrafficAudienceMetrics,
    TikTokConversion: TikTokConversionAudienceMetrics,
    TikTokVideo: TikTokVideoAudienceMetrics,
    TikTokFollower: TikTokFollowerAudienceMetrics,
    LineReach: LineReachAudienceMetrics,
    LineGainFriends: LineGainFriendsAudienceMetrics,
    Taboola: TaboolaMetrics,
  };

  // Create setters map
  const settersMap = createStateSettersMap({
    setOverallData,
    setOverallTotals,
    setOverallMetrics,
    setOverallComparison,
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
    setYoutubeData,
    setYoutubeTotals,
    setYoutubeMetrics,
    setYoutubeComparison,
    setShoppingAdsData,
    setShoppingAdsTotals,
    setShoppingAdsMetrics,
    setShoppingAdsComparison,
    setPerformanceMaxData,
    setPerformanceMaxTotals,
    setPerformanceMaxMetrics,
    setPerformanceMaxComparison,
    setFacebookAudienceData,
    setFacebookAudienceTotals,
    setFacebookCreativeData,
    setFacebookCreativeTotals,
    setFacebookAudienceMetrics,
    setFacebookAudienceComparison,
    setFacebookAwarenessAudienceData,
    setFacebookAwarenessAudienceTotals,
    setFacebookAwarenessCreativeData,
    setFacebookAwarenessCreativeTotals,
    setFacebookAwarenessAudienceMetrics,
    setFacebookAwarenessAudienceComparison,
    setFBDemographicData,
    setFBDemographicMetrics,
    setFBDemographicTotals,
    setFacebookReachAudienceData,
    setFacebookReachAudienceTotals,
    setFacebookReachCreativeData,
    setFacebookReachCreativeTotals,
    setFacebookReachAudienceMetrics,
    setFacebookReachAudienceComparison,
    setFacebookEngagementAudienceData,
    setFacebookEngagementAudienceTotals,
    setFacebookEngagementCreativeData,
    setFacebookEngagementCreativeTotals,
    setFacebookEngagementAudienceMetrics,
    setFacebookEngagementAudienceComparison,
    setFacebookMessageAudienceData,
    setFacebookMessageAudienceTotals,
    setFacebookMessageCreativeData,
    setFacebookMessageCreativeTotals,
    setFacebookMessageAudienceMetrics,
    setFacebookMessageAudienceComparison,
    setFacebookLeadAudienceData,
    setFacebookLeadAudienceTotals,
    setFacebookLeadCreativeData,
    setFacebookLeadCreativeTotals,
    setFacebookLeadAudienceMetrics,
    setFacebookLeadAudienceComparison,
    setFacebookConversionAudienceData,
    setFacebookConversionAudienceTotals,
    setFacebookConversionCreativeData,
    setFacebookConversionCreativeTotals,
    setFacebookConversionAudienceMetrics,
    setFacebookConversionAudienceComparison,
    setFacebookTrafficAudienceData,
    setFacebookTrafficAudienceTotals,
    setFacebookTrafficCreativeData,
    setFacebookTrafficCreativeTotals,
    setFacebookTrafficAudienceMetrics,
    setFacebookTrafficAudienceComparison,
    setFacebookVideoAudienceData,
    setFacebookVideoAudienceTotals,
    setFacebookVideoCreativeData,
    setFacebookVideoCreativeTotals,
    setFacebookVideoAudienceMetrics,
    setFacebookVideoComparison,
    setFacebookCatalogAudienceData,
    setFacebookCatalogAudienceTotals,
    setFacebookCatalogCreativeData,
    setFacebookCatalogCreativeTotals,
    setFacebookCatalogAudienceMetrics,
    setFacebookCatalogAudienceComparison,
    setTikTokAudienceData,
    setTikTokAudienceTotals,
    setTikTokCreativeData,
    setTikTokCreativeTotals,
    setTikTokAudienceMetrics,
    setTikTokAudienceComparison,
    setTikTokLeadAudienceData,
    setTikTokLeadAudienceTotals,
    setTikTokLeadCreativeData,
    setTikTokLeadCreativeTotals,
    setTikTokLeadAudienceMetrics,
    setTikTokLeadAudienceComparison,
    setTikTokReachAudienceData,
    setTikTokReachAudienceTotals,
    setTikTokReachCreativeData,
    setTikTokReachCreativeTotals,
    setTikTokReachAudienceMetrics,
    setTikTokReachAudienceComparison,
    setTikTokTrafficAudienceData,
    setTikTokTrafficAudienceTotals,
    setTikTokTrafficCreativeData,
    setTikTokTrafficCreativeTotals,
    setTikTokTrafficAudienceMetrics,
    setTikTokTrafficAudienceComparison,
    setTikTokConversionAudienceData,
    setTikTokConversionAudienceTotals,
    setTikTokConversionCreativeData,
    setTikTokConversionCreativeTotals,
    setTikTokConversionAudienceMetrics,
    setTikTokConversionAudienceComparison,
    setTikTokVideoAudienceData,
    setTikTokVideoAudienceTotals,
    setTikTokVideoCreativeData,
    setTikTokVideoCreativeTotals,
    setTikTokVideoAudienceMetrics,
    setTikTokVideoAudienceComparison,
    setTikTokFollowerAudienceData,
    setTikTokFollowerAudienceTotals,
    setTikTokFollowerCreativeData,
    setTikTokFollowerCreativeTotals,
    setTikTokFollowerAudienceMetrics,
    setTikTokFollowerAudienceComparison,
    setLineReachAudienceData,
    setLineReachAudienceTotals,
    setLineReachCreativeData,
    setLineReachCreativeTotals,
    setLineReachAudienceMetrics,
    setLineReachAudienceComparison,
    setLineGainFriendsAudienceData,
    setLineGainFriendsAudienceTotals,
    setLineGainFriendsCreativeData,
    setLineGainFriendsCreativeTotals,
    setLineGainFriendsAudienceMetrics,
    setLineGainFriendsAudienceComparison,
    setTaboolaData,
    setTaboolaTotals,
    setTaboolaMetrics,
    setTaboolaComparison,
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
  const getOverallData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "overall",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("Overall Data", result);
    const { enhancedFieldData } = result;
    // console.log("🎯 getOverallData enhancedFieldData:", enhancedFieldData);
    const foundSlide = Object.keys(enhancedFieldData);
    // console.log("🎯 getOverallData foundSlide:", foundSlide);
    setSlideDetectedList(foundSlide);
    return result;
  };

  const getSEMData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "SEM",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
  };

  const getGGDemographic = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "GGDemographic",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
  };

  const getGDNData = async (id, filterBy = null, filterValue = null) => {
    return await fetchDataSheet(
      "GDN",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
  };

  const getDiscData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "Disc",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getDiscData result:", result);
    return result;
  };

  const getYoutubeData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "Youtube",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getYoutubeData result:", result);
    return result;
  };

  const getShoppingAdsData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    const result = await fetchDataSheet(
      "ShoppingAds",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getShoppingAdsData result:", result);
    return result;
  };

  const getPerformanceMaxData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    const result = await fetchDataSheet(
      "PerformanceMax",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getPerformanceMaxData result:", result);
    return result;
  };

  const getFacebookData = async (
    parameters,
    filterBy = null,
    filterValue = null
  ) => {
    const { id, endpoint } = parameters;
    const result = await fetchDataSheetEnhanced(
      FACEBOOK_CHANNELS_MAP,
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList,
      endpoint
    );

    // The result now contains all Facebook data types
    // You might want to log or handle the results appropriately
    // console.log("Enhanced Facebook Data Results:", result);

    return result;
  };

  const getTikTokData = async (
    parameters,
    filterBy = null,
    filterValue = null
  ) => {
    const { id, endpoint } = parameters;
    const result = await fetchDataSheetEnhanced(
      TIKTOK_CHANNELS_MAP,
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList,
      endpoint
    );

    // debug log
    // console.log("📊 getTikTokData result:", result);
    return result;
  };

  const getLineReachData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "LineReach",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getLineReachData result:", result);
    return result;
  };

  const getLineGainFriendsData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    const result = await fetchDataSheet(
      "LineGainFriends",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getLineGainFriendsData result:", result);
    return result;
  };

  const getTaboolaData = async (id, filterBy = null, filterValue = null) => {
    const result = await fetchDataSheet(
      "Taboola",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("🎯 getTaboolaData result:", result);
    return result;
  };

  const getFBDemographicData = async (
    id,
    filterBy = null,
    filterValue = null
  ) => {
    const result = await fetchDataSheet(
      "FBDemographic",
      id,
      buildFetchOptions(filterBy, filterValue),
      projectFilter,
      setNotFoundSheetList
    );
    // console.log("FB Demo", result);
    return result;
  };

  // Main fetch function
  const fetchData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        setNotFoundSheetList([]);
        setSlideDetectedList([]);

        await getOverallData(id);

        // Fetch all data types in parallel for better performance
        const promises = [
          getGGDemographic(id),
          getFBDemographicData(id),
          getSEMData(id),
          getGDNData(id),
          getDiscData(id),
          getYoutubeData(id),
          getShoppingAdsData(id),
          getPerformanceMaxData(id),
          getFacebookData({ id, endpoint: "facebook-data" }),
          getTikTokData({ id, endpoint: "tiktok-data" }),
          getLineReachData(id, "Channel", "Line Reach"),
          getLineGainFriendsData(id, "Channel", "Line Gain Friends"),
          getTaboolaData(id),
          fetchFacebookPicture(id),
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

  // ✅ Updated: Use centralized axios instance with relative URL
  const fetchFacebookPicture = async (id) => {
    const axiosInstance = await createAxiosInstance();
    const response = await axiosInstance.get(
      `/data-sheets/facebook-picture/${id}`
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
    // const resultData = removeDuplicateByColumnMap(dateFilteredData, "Ad name");
    const resultData = removeDuplicateByColumn(dateFilteredData, "Ad name");
    // console.log("resultData:", resultData);
    const finalResult = resultData.map((item) => {
      const allKeys = Object.keys(item);
      const keyIndex = allKeys.findIndex((keyItem) => keyItem.includes("URL"));
      const key = allKeys[keyIndex];
      return { ...item, Ads: item?.Ads || item[key] };
    });

    // console.log("finalResult:", finalResult);

    setFacebookAdsPicture(finalResult);
  };

  const getFBPicture = (data) => {};

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
    // console.log("🎯 filterDataByDate", from, to);
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

    const result = data.filter((item) => {
      const itemDate = item["Updated Date"] || item["Date"];
      return itemDate >= fromDateStr && itemDate <= toDateStr;
    });

    if (result.length === 0) {
      return data;
    }

    return result;
  }

  const removeDuplicateByColumn = (data, column) => {
    const map = {};

    // debug log
    // console.log("🎯 removeDuplicateByColumn data:", data);

    // check item in data that contain item.Date
    const dateColumn = Object.keys(data[0]).find(
      (key) =>
        key.trim().toLowerCase() === "date" ||
        key.trim().toLowerCase() === "updated date"
    );
    // console.log("🎯 removeDuplicateByColumn dateColumn:", dateColumn);

    // if contains Date, then sort by latest date
    // Date format: YYYY-MM-DD
    if (dateColumn) {
      data.sort((a, b) => {
        const dateA = new Date(a[dateColumn]);
        const dateB = new Date(b[dateColumn]);
        return dateB - dateA; // Latest first
      });
      // console.log("🎯 removeDuplicateByColumn sorted data:", data);
    }

    // Remove duplicates - keep first occurrence (latest if sorted by date)
    for (const item of data) {
      const key = item[column];
      if (key !== undefined && key !== null) {
        if (!map[key]) {
          map[key] = item; // Keep only the first occurrence
        }
      }
    }

    return Object.values(map);
  };

  const value = {
    // Global state
    loading,
    error,
    enableDateRange,
    setEnableDateRange,
    dateRange,
    setDateRange,
    enableProjectFilter,
    setEnableProjectFilter,
    projectList,
    setProjectList,
    projectFilter,
    setProjectFilter,

    // Smart Slide Detection
    enableSmartSlideDetection,
    setEnableSmartSlideDetection,
    slideDetectedList,
    setSlideDetectedList,

    // Custom Slide
    enableCustomTemplate,
    setEnableCustomTemplate,

    // sheet not found list
    notFoundSheetList,
    setNotFoundSheetList,

    // Fetch functions
    fetchData,

    // Overall
    overallData,
    overallTotals,
    overallMetrics,
    overallComparison,

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

    // Youtube
    YoutubeData,
    YoutubeTotals,
    YoutubeMetrics,
    YoutubeComparison,

    // Shopping Ads
    ShoppingAdsData,
    ShoppingAdsTotals,
    ShoppingAdsMetrics,
    ShoppingAdsComparison,

    // PerformanceMax
    PerformanceMaxData,
    PerformanceMaxTotals,
    PerformanceMaxMetrics,
    PerformanceMaxComparison,

    // Facebook
    FacebookAudienceData,
    FacebookAudienceTotals,
    FacebookCreativeData,
    FacebookCreativeTotals,
    FacebookAudienceMetrics,
    FacebookAudienceComparison,
    FacebookAdsPicture,
    FBDemographicData,

    // Facebook Awareness
    FacebookAwarenessAudienceData,
    FacebookAwarenessAudienceTotals,
    FacebookAwarenessCreativeData,
    FacebookAwarenessCreativeTotals,
    FacebookAwarenessAudienceMetrics,
    FacebookAwarenessAudienceComparison,

    // Facebook Reach (filtered data)
    FacebookReachAudienceData,
    FacebookReachAudienceTotals,
    FacebookReachCreativeData,
    FacebookReachCreativeTotals,
    FacebookReachAudienceMetrics,
    FacebookReachAudienceComparison,

    // Facebook Engagement
    FacebookEngagementAudienceData,
    FacebookEngagementAudienceTotals,
    FacebookEngagementCreativeData,
    FacebookEngagementCreativeTotals,
    FacebookEngagementAudienceMetrics,
    FacebookEngagementAudienceComparison,

    // Facebook Message
    FacebookMessageAudienceData,
    FacebookMessageAudienceTotals,
    FacebookMessageCreativeData,
    FacebookMessageCreativeTotals,
    FacebookMessageAudienceMetrics,
    FacebookMessageAudienceComparison,

    // Facebook Lead
    FacebookLeadAudienceData,
    FacebookLeadAudienceTotals,
    FacebookLeadCreativeData,
    FacebookLeadCreativeTotals,
    FacebookLeadAudienceMetrics,
    FacebookLeadAudienceComparison,

    // Facebook Conversion
    FacebookConversionAudienceData,
    FacebookConversionAudienceTotals,
    FacebookConversionCreativeData,
    FacebookConversionCreativeTotals,
    FacebookConversionAudienceMetrics,
    FacebookConversionAudienceComparison,

    // Facebook Traffic
    FacebookTrafficAudienceData,
    FacebookTrafficAudienceTotals,
    FacebookTrafficCreativeData,
    FacebookTrafficCreativeTotals,
    FacebookTrafficAudienceMetrics,
    FacebookTrafficAudienceComparison,

    // Facebook Video
    FacebookVideoAudienceData,
    FacebookVideoAudienceTotals,
    FacebookVideoCreativeData,
    FacebookVideoCreativeTotals,
    FacebookVideoAudienceMetrics,
    FacebookVideoComparison,

    // Facebook Catalog
    FacebookCatalogAudienceData,
    FacebookCatalogAudienceTotals,
    FacebookCatalogCreativeData,
    FacebookCatalogCreativeTotals,
    FacebookCatalogAudienceMetrics,
    FacebookCatalogAudienceComparison,

    // TikTok
    TikTokAudienceData,
    TikTokAudienceTotals,
    TikTokCreativeData,
    TikTokCreativeTotals,
    TikTokAudienceMetrics,
    TikTokAudienceComparison,

    // TikTok Lead
    TikTokLeadAudienceData,
    TikTokLeadAudienceTotals,
    TikTokLeadCreativeData,
    TikTokLeadCreativeTotals,
    TikTokLeadAudienceMetrics,
    TikTokLeadAudienceComparison,

    // TikTok Reach
    TikTokReachAudienceData,
    TikTokReachAudienceTotals,
    TikTokReachCreativeData,
    TikTokReachCreativeTotals,
    TikTokReachAudienceMetrics,
    TikTokReachAudienceComparison,

    // TikTok Traffic
    TikTokTrafficAudienceData,
    TikTokTrafficAudienceTotals,
    TikTokTrafficCreativeData,
    TikTokTrafficCreativeTotals,
    TikTokTrafficAudienceMetrics,
    TikTokTrafficAudienceComparison,

    // TikTok Conversion
    TikTokConversionAudienceData,
    TikTokConversionAudienceTotals,
    TikTokConversionCreativeData,
    TikTokConversionCreativeTotals,
    TikTokConversionAudienceMetrics,
    TikTokConversionAudienceComparison,

    // TikTok Video
    TikTokVideoAudienceData,
    TikTokVideoAudienceTotals,
    TikTokVideoCreativeData,
    TikTokVideoCreativeTotals,
    TikTokVideoAudienceMetrics,
    TikTokVideoAudienceComparison,

    // TikTok Follower
    TikTokFollowerAudienceData,
    TikTokFollowerAudienceTotals,
    TikTokFollowerCreativeData,
    TikTokFollowerCreativeTotals,
    TikTokFollowerAudienceMetrics,
    TikTokFollowerAudienceComparison,

    // Line Reach
    LineReachAudienceData,
    LineReachAudienceTotals,
    LineReachCreativeData,
    LineReachCreativeTotals,
    LineReachAudienceMetrics,
    LineReachAudienceComparison,

    // Line Gain Friends
    LineGainFriendsAudienceData,
    LineGainFriendsAudienceTotals,
    LineGainFriendsCreativeData,
    LineGainFriendsCreativeTotals,
    LineGainFriendsAudienceMetrics,
    LineGainFriendsAudienceComparison,

    // Taboola
    TaboolaData,
    TaboolaTotals,
    TaboolaMetrics,
    TaboolaComparison,

    //function
    fetchFacebookPicture,

    //template
    template,
    setTemplate,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
