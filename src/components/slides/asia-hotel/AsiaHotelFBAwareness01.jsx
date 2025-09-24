import React, { useEffect, useMemo, useState } from "react";
import SlideHeader from "@/components/slides/SlideHeader";
import NumberDisplayBox from "@/components/slides/utils/NumberDisplayBox";
import TextEditorModal from "@/components/slides/utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "@/components/charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "@/components/charts-tables/AdvancedDataTable";

function AsiaHotelFBAwareness01() {
  const {
    loading,
    error,
    refetch,
    GGDemographicData,
    FBDemographicData,
    FacebookAudienceData,
    FacebookAudienceTotals,
    FacebookAudienceMetrics,
    FacebookAudienceComparison,
    FacebookCreativeData,
    FacebookCreativeTotals,
    FacebookAdsPicture,
    FacebookAwarenessAudienceData,
    FacebookAwarenessAudienceTotals,
    FacebookAwarenessCreativeData,
    FacebookAwarenessCreativeTotals,
    FacebookAwarenessAudienceMetrics,
    FacebookAwarenessAudienceComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([5]);
  const [adsPicture, setAdsPicture] = useState(null);
  const [topAds, setTopAds] = useState(null);
  const [isNoData, setIsNoData] = useState(false);

  const summarizeData = () => {
    // Handle "No Data" case

    if (
      Object.keys(FacebookAwarenessAudienceData).length === 0 ||
      Object.keys(FacebookAwarenessAudienceTotals).length === 0
    ) {
      setIsNoData(true);
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall impression: ** ${parseFloat(
      FacebookAwarenessAudienceTotals?.impressions?.toFixed(2) || 0
    )?.toLocaleString()} impressions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    summaryTextTemp += `<li>Average CPM: **${FacebookAwarenessAudienceTotals.cpm?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB (per 1000 impressions)**</li>`;

    // Find top audience by impressions (simpler approach)
    const topAudience = Object.entries(FacebookAwarenessAudienceData).reduce(
      (max, [key, value]) =>
        (value.impressions || 0) > (max.value.impressions || 0)
          ? { key, value }
          : max,
      { key: "", value: { impressions: 0 } }
    );

    const topAudienceText = `Top audience: **${
      topAudience.key
    } (with ${topAudience.value.impressions?.toLocaleString()} impressions)**`;
    summaryTextTemp += `<li>${topAudienceText}</li>`;

    // Find top creative by impressions (simpler approach)
    const topCreative = Object.entries(FacebookAwarenessCreativeData).reduce(
      (max, [key, value]) =>
        (value.impressions || 0) > (max.value.impressions || 0)
          ? { key, value }
          : max,
      { key: "", value: { impressions: 0 } }
    );
    const topCreativeText = `Top creative: **${
      topCreative.key
    } (with ${topCreative.value.impressions?.toLocaleString()} impressions**`;
    // summaryTextTemp += `<li>${topCreativeText}</li>`;

    prepareAdsPicture(topCreative.key);
    setTopAds(topCreative.key);
    setSummaryText(summaryTextTemp);
  };

  const prepareAdsPicture = (adsName) => {
    const adsPicture = FacebookAdsPicture.filter((item) => {
      return item["Ad name"] == adsName;
    });
    if (adsPicture.length === 0) return;
    // console.log("Ads Picture", adsPicture);
    setAdsPicture(adsPicture[0]["Ads"]);
  };

  //Demographic for chart
  const { chartByGender, chartByAge, chartByDevice } = useMemo(() => {
    const GRAPH_KEY = "Impressions";
    const CHANNEL = "FB Awareness";

    try {
      if (!FBDemographicData || FBDemographicData.length === 0) {
        return {
          chartByGender: {},
          chartByAge: {},
          chartByDevice: {},
        };
      }

      // Filter for FB Channel data
      const filteredDemographicData = FBDemographicData.filter((item) => {
        return (
          item?.Channel?.trim() === CHANNEL ||
          item?.Channel?.trim() === `${CHANNEL}s`
        );
      });
      // console.log(filteredDemographicData);

      if (filteredDemographicData.length === 0) {
        return {
          chartByGender: {},
          chartByAge: {},
          chartByDevice: {},
        };
      }

      // Helper function for consistent parsing
      const parseKey = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Gender chart
      const sumChartByGender = filteredDemographicData.reduce((acc, item) => {
        if (item?.Gender && item[GRAPH_KEY] !== undefined) {
          acc[item.Gender] =
            (acc[item.Gender] || 0) + parseKey(item[GRAPH_KEY]);
        }
        return acc;
      }, {});

      const totalGenderKey = Object.values(sumChartByGender).reduce(
        (a, b) => a + b,
        0
      );

      // Age chart
      const sumChartByAge = filteredDemographicData.reduce((acc, item) => {
        if (item?.Age && item[GRAPH_KEY] !== undefined) {
          acc[item.Age] = (acc[item.Age] || 0) + parseKey(item[GRAPH_KEY]);
        }
        return acc;
      }, {});

      const totalAgeKey = Object.values(sumChartByAge).reduce(
        (a, b) => a + b,
        0
      );

      // Device chart
      const sumChartByDevice = filteredDemographicData.reduce((acc, item) => {
        if (item?.Device && item[GRAPH_KEY] !== undefined) {
          acc[item.Device] =
            (acc[item.Device] || 0) + parseKey(item[GRAPH_KEY]);
        }
        return acc;
      }, {});

      const totalDeviceKey = Object.values(sumChartByDevice).reduce(
        (a, b) => a + b,
        0
      );

      // Early return if no key data
      if (totalGenderKey === 0 && totalAgeKey === 0 && totalDeviceKey === 0) {
        return {
          chartByGender: {},
          chartByAge: {},
          chartByDevice: {},
        };
      }

      // Calculate percentages with correct totals
      const genderPercentages =
        totalGenderKey > 0
          ? Object.entries(sumChartByGender).reduce((acc, [gender, key]) => {
              acc[gender] = ((key / totalGenderKey) * 100).toFixed(2) + "%";
              return acc;
            }, {})
          : {};

      const agePercentages =
        totalAgeKey > 0
          ? Object.entries(sumChartByAge).reduce((acc, [age, key]) => {
              acc[age] = ((key / totalAgeKey) * 100).toFixed(2) + "%";
              return acc;
            }, {})
          : {};

      const devicePercentages =
        totalDeviceKey > 0
          ? Object.entries(sumChartByDevice).reduce((acc, [device, key]) => {
              acc[device] = ((key / totalDeviceKey) * 100).toFixed(2) + "%";
              return acc;
            }, {})
          : {};

      return {
        chartByGender: genderPercentages,
        chartByAge: agePercentages,
        chartByDevice: devicePercentages,
      };
    } catch (error) {
      console.error("Error processing demographic data:", error);
      return {
        chartByGender: {},
        chartByAge: {},
        chartByDevice: {},
      };
    }
  }, [FBDemographicData]);

  useEffect(() => {
    summarizeData();
  }, [FacebookAwarenessAudienceTotals, FacebookAwarenessAudienceData]);

  const renderFormattedText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold">$1</span>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/~~(.*?)~~/g, '<span class="text-red-500">$1</span>')
      .replace(/\+\+(.*?)\+\+/g, '<span class="text-green-500">$1</span>')
      .replace(
        /\[\[(.*?)\]\]/g,
        '<span class="text-blue-500 font-semibold">$1</span>'
      )
      .replace(/\{\{(.*?)\}\}/g, '<span class="text-lg font-bold">$1</span>')
      .replace(
        /\(\((.*?)\)\)/g,
        '<span class="text-xs text-gray-600">$1</span>'
      );
  };

  const formattedMetrics = useMemo(() => {
    if (
      !FacebookAwarenessAudienceTotals ||
      !FacebookAwarenessAudienceComparison
    ) {
      return {};
    }

    return {
      impressionData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.impressions,
        FacebookAwarenessAudienceComparison?.impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.clicks,
        FacebookAwarenessAudienceComparison?.clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.ctr,
        FacebookAwarenessAudienceComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpc,
        FacebookAwarenessAudienceComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.conversions,
        FacebookAwarenessAudienceComparison?.conversions,
        "number"
      ),
      cplData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpl,
        FacebookAwarenessAudienceComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.spent,
        FacebookAwarenessAudienceComparison?.spent,
        "compact"
      ),
      cpmData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpm,
        FacebookAwarenessAudienceComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.reach,
        FacebookAwarenessAudienceComparison?.reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.frequency,
        FacebookAwarenessAudienceComparison?.frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpr,
        FacebookAwarenessAudienceComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.engagements,
        FacebookAwarenessAudienceComparison?.engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.engagementRate,
        FacebookAwarenessAudienceComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpe,
        FacebookAwarenessAudienceComparison?.cpe,
        "compact"
      ),
      viewRateData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.viewRate,
        FacebookAwarenessAudienceComparison?.viewRate,
        "percentage"
      ),
      VideoViewsData: formatDisplayData(
        FacebookAwarenessAudienceTotals["views"],
        FacebookAwarenessAudienceComparison["views"],
        "number"
      ),
      cpvData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.cpv,
        FacebookAwarenessAudienceComparison?.cpv,
        "compact"
      ),
      conRateData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.conRate ||
          FacebookAwarenessAudienceTotals?.cvr,
        FacebookAwarenessAudienceComparison?.conRate ||
          FacebookAwarenessAudienceComparison?.cvr,
        "percentage"
      ),
      conversionValueData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.conversionValue,
        FacebookAwarenessAudienceComparison?.conversionValue,
        "compact"
      ),
      purchaseConValueData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.purchaseConValue,
        FacebookAwarenessAudienceComparison?.purchaseConValue,
        "compact"
      ),
      roasData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.roas,
        FacebookAwarenessAudienceComparison?.roas,
        "compact"
      ),
      purchaseData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.purchase,
        FacebookAwarenessAudienceComparison?.purchase,
        "number"
      ),
      addToCartData: formatDisplayData(
        FacebookAwarenessAudienceTotals?.addToCart,
        FacebookAwarenessAudienceComparison?.addToCart,
        "number"
      ),
    };
  }, [FacebookAwarenessAudienceTotals, FacebookAwarenessAudienceComparison]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4 items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id="facebook-awareness-01-component"
      data-exportable={true}
      data-export-title="Facebook Awareness (1/2)"
      className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-2 relative group bg-white"
    >
      {/* EDIT BUTTON */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={() => {
            setIsEditModalOpen(true);
          }}
        >
          <Edit />
        </Button>
      </div>
      <SlideHeader title={"Facebook Awareness (1/2)"} />
      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-16">
          <div className="col-span-12 flex flex-col gap-2">
            <div className="grid grid-cols-8 gap-2">
              <h4 className="col-span-5 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-3 text-lg font-semibold">Conversions</h4>

              <NumberDisplayBox
                title={"Impression"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.impressionData?.displayValue
                }
                compareValue={formattedMetrics.impressionData?.compareValue}
                isNegative={formattedMetrics.impressionData?.isNegative}
              />
              <NumberDisplayBox
                title={"CPM"}
                value={
                  isNoData ? "No Data" : formattedMetrics.cpmData?.displayValue
                }
                compareValue={formattedMetrics.cpmData?.compareValue}
                isNegative={formattedMetrics.cpmData?.isNegative}
                invertCompareColor={true}
              />
              <NumberDisplayBox
                title={"Reach"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.reachData?.displayValue
                }
                compareValue={formattedMetrics.reachData?.compareValue}
                isNegative={formattedMetrics.reachData?.isNegative}
              />
              <NumberDisplayBox
                title={"Engagements"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.engagementData?.displayValue
                }
                compareValue={formattedMetrics.engagementData?.compareValue}
                isNegative={formattedMetrics.engagementData?.isNegative}
              />
              <NumberDisplayBox
                title={"%Engage Rate"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.engagementRateData?.displayValue
                }
                compareValue={formattedMetrics.engagementRateData?.compareValue}
                isNegative={formattedMetrics.engagementRateData?.isNegative}
              />
              {/* <NumberDisplayBox
                title={"CPE"}
                value={cpeData.displayValue}
                compareValue={cpeData.compareValue}
                isNegative={cpeData.isNegative}
                invertCompareColor={true}
              /> */}
              <NumberDisplayBox
                title={"Conversions"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.conversionsData?.displayValue
                }
                isConversion={true}
                compareValue={formattedMetrics.conversionsData?.compareValue}
                isNegative={formattedMetrics.conversionsData?.isNegative}
              />
              <NumberDisplayBox
                title={"Con value"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.conversionValueData?.displayValue
                }
                isConversion={true}
                compareValue={
                  formattedMetrics.conversionValueData?.compareValue
                }
                isNegative={formattedMetrics.conversionValueData?.isNegative}
              />
              <NumberDisplayBox
                title={"Spent"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.spentData?.displayValue
                }
                isConversion={true}
                compareValue={formattedMetrics.spentData?.compareValue}
                isNegative={formattedMetrics.spentData?.isNegative}
                invertCompareColor={true}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Audience</h4>

              <AdvancedDataTable
                firstMetric="Ad set name"
                channelData={FacebookAwarenessAudienceData}
                totalData={FacebookAwarenessAudienceTotals}
                metrics={[
                  "Ad set name",
                  "impressions",
                  "cpm",
                  "reach",
                  "clicks",
                  "ctr",
                  "cpc",
                  "engagements",
                  "engagementRate",
                  "conversions",
                  "conversionValue",
                  "spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="impressions"
                defaultSortOrder="desc"
                enableSorting={true} // Can disable sorting if needed
              />
            </div>
            {/* <div>
              <h4 className="text-lg font-semibold">Performance by Creative</h4>

              <AdvancedDataTable
                firstMetric="Ad name"
                channelData={FacebookAwarenessCreativeData}
                totalData={FacebookCreativeTotals}
                metrics={[
                  "Ad name",
                  "impressions", // lowercase
                  "cpm",
                  "reach", // lowercase
                  "spent", // lowercase
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[1]}
                defaultSortBy="impressions"
                defaultSortOrder="desc"
                enableSorting={true} // Can disable sorting if needed
              />
            </div> */}
            <div className="grid grid-cols-2">
              <div className="col-span-1">
                {/* Summary */}
                <div className="px-4">
                  <h4 className="text-lg font-semibold">Summary</h4>
                  <ul className="list-disc pl-6">
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: renderFormattedText(summaryText),
                      }}
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex flex-col ml-2 mt-8 justify-between items-center">
            {/* Ads Preview
            <div className="p-6 flex flex-col gap-2">
              <img
                src={adsPicture}
                alt="ads preview"
                className="max-h-[300px] max-w-full object-contain w-auto"
              />
              <p className="mx-auto">{topAds}</p>
            </div> */}
            {/* Chart */}
            <div className="col-span-3">
              <DonutChart
                data={chartByGender}
                title="Impression By Gender"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
              <DonutChart
                data={chartByAge}
                title="Impression By Age"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
                isLegendWrap={false}
              />
            </div>
          </div>
        </div>
      </div>
      <TextEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(newText) => setSummaryText(newText)}
        initialText={summaryText}
        revertText={summarizeData}
        title="Edit Summary Text"
        placeholder="Enter your summary text..."
        maxTableRows={maxTableRows}
        setMaxTableRows={setMaxTableRows}
      />
    </div>
  );
}

export default AsiaHotelFBAwareness01;
