import React, { useEffect, useMemo, useState, useCallback } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./utils/NumberDisplayBox";
import TextEditorModal from "./utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit, Video } from "lucide-react";
import { Button } from "../ui/button";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";

function ShoppingAdsSlide() {
  const {
    loading,
    error,
    refetch,
    FacebookAdsPicture,
    LineReachAudienceData,
    LineReachAudienceTotals,
    LineReachCreativeData,
    LineReachCreativeTotals,
    LineReachAudienceMetrics,
    LineReachAudienceComparison,
    ShoppingAdsData,
    ShoppingAdsTotals,
    ShoppingAdsMetrics,
    ShoppingAdsComparison,
    GGDemographicData,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([5]);

  // Fix: Memoize summarizeData to prevent unnecessary re-renders
  const summarizeData = useCallback(() => {
    const KEY = "Conversions";
    const ENABLE_CONVERSION = false;
    try {
      // Handle "No Data" case
      if (
        ShoppingAdsTotals[KEY] === "No Data" ||
        !ShoppingAdsTotals ||
        Object.keys(ShoppingAdsTotals).length === 0
      ) {
        setSummaryText("<li>No data available for the selected period</li>");
        return;
      }

      let summaryTextTemp = "";
      const averageCPR = ShoppingAdsTotals.cpr?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const overallText = `Total conversion: ** ${parseFloat(
        ShoppingAdsTotals[KEY]?.toFixed(2) || 0
      )?.toLocaleString()} conversions`;
      summaryTextTemp = `<li>${overallText}**</li>`;
      summaryTextTemp += `<li>Total conversion Value: **${parseFloat(
        ShoppingAdsTotals["Conversion value"]?.toFixed(2) || 0
      )?.toLocaleString()} THB with ${parseFloat(
        ShoppingAdsTotals["roas"]?.toFixed(2) || 0
      )?.toLocaleString()} of ROAS**</li>`;
      // summaryTextTemp += `<li>Average CPR: **${averageCPR} THB (per 1,000 reaches)**</li>`;

      // Find top audience by reach (with error handling)
      const topAudience = ShoppingAdsData
        ? Object.entries(ShoppingAdsData).reduce(
            (max, [key, value]) =>
              (value[KEY] || 0) > (max.value[KEY] || 0) ? { key, value } : max,
            { key: "", value: { KEY: 0 } }
          )
        : { key: "", value: { KEY: 0 } };

      if (topAudience.key) {
        const topAudienceText = `Top Product sold: **${
          topAudience.key
        } with ${topAudience.value[KEY]?.toLocaleString()} conversions**`;
        summaryTextTemp += `<li>${topAudienceText}</li>`;
      }

      // Find top creative by reach (with error handling)
      const topCreative = LineReachCreativeData
        ? Object.entries(LineReachCreativeData).reduce(
            (max, [key, value]) =>
              (value[KEY] || 0) > (max.value[KEY] || 0) ? { key, value } : max,
            { key: "", value: { KEY: 0 } }
          )
        : { key: "", value: { KEY: 0 } };

      // if (topCreative.key) {
      // Fix: Added missing closing parenthesis
      const topCreativeText = `Top Creative: **${
        topCreative.key
      } with ${topCreative.value[KEY]?.toLocaleString()} reaches**`;
      // summaryTextTemp += `<li>${topCreativeText}</li>`;
      // }

      const totalConversions = ShoppingAdsTotals?.Conversions;
      // if (totalConversions > 0 && ENABLE_CONVERSION) {
      //   summaryTextTemp += `<li>Total conversion: **${totalConversions?.toLocaleString(
      //     undefined,
      //     { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      //   )} conversions**</li>`;
      // }

      setSummaryText(summaryTextTemp);
    } catch (error) {
      console.error("Error in summarizeData:", error);
      setSummaryText("<li>Error generating summary</li>");
    }
  }, [ShoppingAdsTotals, ShoppingAdsData, LineReachCreativeData]);

  //Demographic for chart
  const { chartByGender, chartByDevice } = useMemo(() => {
    const GRAPH_KEY = "conversions";
    const CHANNEL = "Shopping";
    try {
      if (!GGDemographicData || GGDemographicData.length === 0) {
        return {
          chartByGender: {},
          chartByDevice: {},
        };
      }

      // Filter Channel
      const filteredDemographicData = GGDemographicData.filter((item) => {
        return item?.Channel?.trim() === CHANNEL;
      });

      if (filteredDemographicData.length === 0) {
        return {
          chartByGender: {},
          chartByDevice: {},
        };
      }

      // Helper function for consistent parsing
      const parseHelper = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Group by the specified field
      const sumGraphHelper = (key, graphBy) => {
        return filteredDemographicData.reduce((acc, item) => {
          if (item[graphBy] && item[key] !== undefined) {
            acc[item[graphBy]] =
              (acc[item[graphBy]] || 0) + parseHelper(item[key]);
          }
          return acc;
        }, {});
      };

      // By Gender
      const sumGraphByGender = sumGraphHelper(GRAPH_KEY, "Gender");
      const totalGraphByGender = Object.values(sumGraphByGender).reduce(
        (a, b) => a + b,
        0
      );

      // By Device
      const sumGraphByDevice = sumGraphHelper(GRAPH_KEY, "Device");
      const totalGraphByDevice = Object.values(sumGraphByDevice).reduce(
        (a, b) => a + b,
        0
      );

      // Early return if no impressions
      if (totalGraphByGender === 0 && totalGraphByDevice === 0) {
        return {
          chartByGender: {},
          chartByDevice: {},
        };
      }

      // Calculate percentages with correct totals
      const genderPercentages =
        totalGraphByGender > 0
          ? Object.entries(sumGraphByGender).reduce((acc, [gender, key]) => {
              acc[gender] = ((key / totalGraphByGender) * 100).toFixed(2) + "%";
              return acc;
            }, {})
          : {};

      const agePercentages =
        totalGraphByDevice > 0
          ? Object.entries(sumGraphByDevice).reduce((acc, [age, key]) => {
              acc[age] = ((key / totalGraphByDevice) * 100).toFixed(2) + "%";
              return acc;
            }, {})
          : {};

      return {
        chartByGender: genderPercentages,
        chartByDevice: agePercentages,
      };
    } catch (error) {
      console.error("Error processing demographic data:", error);
      return {
        chartByGender: {},
        chartByDevice: {},
      };
    }
  }, [GGDemographicData]);
  // Fix: Add summarizeData to dependency array
  useEffect(() => {
    summarizeData();
  }, [summarizeData]);

  // Fix: Memoize formatted metrics to prevent unnecessary recalculations
  const formattedMetrics = useMemo(() => {
    if (!ShoppingAdsTotals || !ShoppingAdsComparison) {
      return {};
    }

    return {
      impressionData: formatDisplayData(
        ShoppingAdsTotals?.Impressions,
        ShoppingAdsComparison?.Impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        ShoppingAdsTotals?.Clicks,
        ShoppingAdsComparison?.Clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        ShoppingAdsTotals?.ctr,
        ShoppingAdsComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        ShoppingAdsTotals?.cpc,
        ShoppingAdsComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        ShoppingAdsTotals?.Conversions,
        ShoppingAdsComparison?.Conversions,
        "number"
      ),
      cplData: formatDisplayData(
        ShoppingAdsTotals?.cpl,
        ShoppingAdsComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        ShoppingAdsTotals?.Spent,
        ShoppingAdsComparison?.Spent,
        "compact"
      ),
      conRate: formatDisplayData(
        ShoppingAdsTotals?.cvr,
        ShoppingAdsComparison?.cvr,
        "percentage"
      ),
      cpmData: formatDisplayData(
        ShoppingAdsTotals?.cpm,
        ShoppingAdsComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        ShoppingAdsTotals?.reach,
        ShoppingAdsComparison?.reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        ShoppingAdsTotals?.frequency,
        ShoppingAdsComparison?.frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        ShoppingAdsTotals?.cpr,
        ShoppingAdsComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        ShoppingAdsTotals?.engagements,
        ShoppingAdsComparison?.engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        ShoppingAdsTotals?.engagementRate,
        ShoppingAdsComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        ShoppingAdsTotals?.cpe,
        ShoppingAdsComparison?.cpe,
        "compact"
      ),
      viewRateData: formatDisplayData(
        ShoppingAdsTotals?.viewRate,
        ShoppingAdsComparison?.viewRate,
        "percentage"
      ),
      VideoViewsData: formatDisplayData(
        ShoppingAdsTotals["views"],
        ShoppingAdsComparison["views"],
        "number"
      ),
      cpvData: formatDisplayData(
        ShoppingAdsTotals?.cpv,
        ShoppingAdsComparison?.cpv,
        "compact"
      ),
      conRateData: formatDisplayData(
        ShoppingAdsTotals?.cvr,
        ShoppingAdsComparison?.cvr,
        "percentage"
      ),
      purchaseConValueData: formatDisplayData(
        ShoppingAdsTotals?.purchaseConValue,
        ShoppingAdsComparison?.purchaseConValue,
        "compact"
      ),
      roasData: formatDisplayData(
        ShoppingAdsTotals?.roas,
        ShoppingAdsComparison?.roas,
        "compact"
      ),
      purchaseData: formatDisplayData(
        ShoppingAdsTotals?.purchase,
        ShoppingAdsComparison?.purchase,
        "number"
      ),
      addToCartData: formatDisplayData(
        ShoppingAdsTotals?.addToCart,
        ShoppingAdsComparison?.addToCart,
        "number"
      ),
      view6secData: formatDisplayData(
        ShoppingAdsTotals?.view6sec,
        ShoppingAdsComparison?.view6sec,
        "number"
      ),
      conversionValueData: formatDisplayData(
        ShoppingAdsTotals["Conversion value"],
        ShoppingAdsComparison["Conversion value"],
        "compact"
      ),
    };
  }, [ShoppingAdsTotals, ShoppingAdsComparison]);

  // Memoize text formatter
  const renderFormattedText = useCallback((text) => {
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
  }, []);

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
      id="shopping-ads-component"
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
      <SlideHeader title={"Shopping Ads"} />
      <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-20 h-full">
          <div className="col-span-20 flex flex-col gap-2">
            <div className="grid grid-cols-9 gap-2">
              <h4 className="col-span-3 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-6 text-lg font-semibold">Conversions</h4>

              <NumberDisplayBox
                title={"Impression"}
                value={formattedMetrics.impressionData?.displayValue}
                compareValue={formattedMetrics.impressionData?.compareValue}
                isNegative={formattedMetrics.impressionData?.isNegative}
              />

              <NumberDisplayBox
                title={"Clicks"}
                value={formattedMetrics.clicksData?.displayValue}
                compareValue={formattedMetrics.clicksData?.compareValue}
                isNegative={formattedMetrics.clicksData?.isNegative}
              />

              <NumberDisplayBox
                title={"%CTR"}
                value={formattedMetrics.ctrData?.displayValue}
                compareValue={formattedMetrics.ctrData?.compareValue}
                isNegative={formattedMetrics.ctrData?.isNegative}
              />

              <NumberDisplayBox
                title={"CPC"}
                value={formattedMetrics.cpcData?.displayValue}
                compareValue={formattedMetrics.cpcData?.compareValue}
                isNegative={formattedMetrics.cpcData?.isNegative}
                isConversion={true}
                invertCompareColor={true}
              />

              <NumberDisplayBox
                title={"Conversions"}
                value={formattedMetrics.conversionsData?.displayValue}
                compareValue={formattedMetrics.conversionsData?.compareValue}
                isNegative={formattedMetrics.conversionsData?.isNegative}
                isConversion={true}
              />

              <NumberDisplayBox
                title={"CPL"}
                value={formattedMetrics.cplData?.displayValue}
                compareValue={formattedMetrics.cplData?.compareValue}
                isNegative={formattedMetrics.cplData?.isNegative}
                isConversion={true}
                invertCompareColor={true}
              />

              <NumberDisplayBox
                title={"Con value"}
                value={formattedMetrics.conversionValueData?.displayValue}
                compareValue={
                  formattedMetrics.conversionValueData?.compareValue
                }
                isNegative={formattedMetrics.conversionValueData?.isNegative}
                isConversion={true}
              />

              <NumberDisplayBox
                title={"Spent"}
                value={formattedMetrics.spentData?.displayValue}
                isConversion={true}
                compareValue={formattedMetrics.spentData?.compareValue}
                isNegative={formattedMetrics.spentData?.isNegative}
              />

              <NumberDisplayBox
                title={"ROAS"}
                value={formattedMetrics.roasData?.displayValue}
                isConversion={true}
                compareValue={formattedMetrics.roasData?.compareValue}
                isNegative={formattedMetrics.roasData?.isNegative}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Keywords</h4>

              <AdvancedDataTable
                firstMetric="Product Title"
                channelData={ShoppingAdsData}
                totalData={ShoppingAdsTotals}
                metrics={[
                  "Impressions",
                  "Clicks",
                  "ctr",
                  "cpc",
                  "Conversions",
                  "conRate",
                  "cpl",
                  "Conversion value",
                  "Spent",
                  "roas",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="Conversions"
                defaultSortOrder="desc"
                enableSorting={true}
              />
            </div>
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
          {/* <div className="col-span-4 flex flex-col justify-between"> */}
          {/* Chart */}
          {/* <div className="col-span-4 flex flex-col">
              <DonutChart
                data={chartByGender}
                title="Conversions By Gender"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
              <DonutChart
                data={chartByDevice}
                title="Conversions By Device"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
            </div> */}
          {/* </div> */}
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

export default ShoppingAdsSlide;
