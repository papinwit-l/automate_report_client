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

function PerformanceMaxSlide() {
  const {
    loading,
    error,
    refetch,
    ShoppingAdsMetrics,
    PerformanceMaxData,
    PerformanceMaxTotals,
    PerformanceMaxMetrics,
    PerformanceMaxComparison,
    GGDemographicData,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([10]);

  // Fix: Memoize summarizeData to prevent unnecessary re-renders
  const summarizeData = useCallback(() => {
    const KEY = "Clicks";
    const ENABLE_CONVERSION = false;
    try {
      // Handle "No Data" case
      if (
        PerformanceMaxTotals[KEY] === "No Data" ||
        !PerformanceMaxTotals ||
        Object.keys(PerformanceMaxTotals).length === 0
      ) {
        setSummaryText("<li>No data available for the selected period</li>");
        return;
      }

      let summaryTextTemp = "";
      const averageCPC = PerformanceMaxTotals.cpc?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const overallText = `Overall clicks: ** ${parseFloat(
        PerformanceMaxTotals[KEY]?.toFixed(2) || 0
      )?.toLocaleString()} clicks`;
      summaryTextTemp = `<li>${overallText}**</li>`;
      summaryTextTemp += `<li>Average %CTR: **${parseFloat(
        PerformanceMaxTotals["ctr"]?.toFixed(2) || 0
      )?.toLocaleString()}%**</li>`;
      summaryTextTemp += `<li>Average CPC: **${averageCPC} THB**</li>`;

      // Find top audience by reach (with error handling)
      const topAudience = PerformanceMaxData
        ? Object.entries(PerformanceMaxData).reduce(
            (max, [key, value]) =>
              (value[KEY] || 0) > (max.value[KEY] || 0) ? { key, value } : max,
            { key: "", value: { KEY: 0 } }
          )
        : { key: "", value: { KEY: 0 } };

      if (topAudience.key) {
        // const topAudienceText = `Top Product sold: **${
        //   topAudience.key
        // } with ${topAudience.value[KEY]?.toLocaleString()} conversions**`;
        // summaryTextTemp += `<li>${topAudienceText}</li>`;
      }

      const totalConversions = PerformanceMaxTotals?.Conversions;
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
  }, [PerformanceMaxTotals, PerformanceMaxData]);

  //Demographic for chart
  // const { chartByGender, chartByDevice } = useMemo(() => {
  //   const GRAPH_KEY = "conversions";
  //   const CHANNEL = "Shopping";
  //   try {
  //     if (!GGDemographicData || GGDemographicData.length === 0) {
  //       return {
  //         chartByGender: {},
  //         chartByDevice: {},
  //       };
  //     }

  //     // Filter Channel
  //     const filteredDemographicData = GGDemographicData.filter((item) => {
  //       return item?.Channel?.trim() === CHANNEL;
  //     });

  //     if (filteredDemographicData.length === 0) {
  //       return {
  //         chartByGender: {},
  //         chartByDevice: {},
  //       };
  //     }

  //     // Helper function for consistent parsing
  //     const parseHelper = (value) => {
  //       if (value === null || value === undefined || value === "") return 0;
  //       const parsed = parseInt(value);
  //       return isNaN(parsed) ? 0 : parsed;
  //     };

  //     // Group by the specified field
  //     const sumGraphHelper = (key, graphBy) => {
  //       return filteredDemographicData.reduce((acc, item) => {
  //         if (item[graphBy] && item[key] !== undefined) {
  //           acc[item[graphBy]] =
  //             (acc[item[graphBy]] || 0) + parseHelper(item[key]);
  //         }
  //         return acc;
  //       }, {});
  //     };

  //     // By Gender
  //     const sumGraphByGender = sumGraphHelper(GRAPH_KEY, "Gender");
  //     const totalGraphByGender = Object.values(sumGraphByGender).reduce(
  //       (a, b) => a + b,
  //       0
  //     );

  //     // By Device
  //     const sumGraphByDevice = sumGraphHelper(GRAPH_KEY, "Device");
  //     const totalGraphByDevice = Object.values(sumGraphByDevice).reduce(
  //       (a, b) => a + b,
  //       0
  //     );

  //     // Early return if no impressions
  //     if (totalGraphByGender === 0 && totalGraphByDevice === 0) {
  //       return {
  //         chartByGender: {},
  //         chartByDevice: {},
  //       };
  //     }

  //     // Calculate percentages with correct totals
  //     const genderPercentages =
  //       totalGraphByGender > 0
  //         ? Object.entries(sumGraphByGender).reduce((acc, [gender, key]) => {
  //             acc[gender] = ((key / totalGraphByGender) * 100).toFixed(2) + "%";
  //             return acc;
  //           }, {})
  //         : {};

  //     const agePercentages =
  //       totalGraphByDevice > 0
  //         ? Object.entries(sumGraphByDevice).reduce((acc, [age, key]) => {
  //             acc[age] = ((key / totalGraphByDevice) * 100).toFixed(2) + "%";
  //             return acc;
  //           }, {})
  //         : {};

  //     return {
  //       chartByGender: genderPercentages,
  //       chartByDevice: agePercentages,
  //     };
  //   } catch (error) {
  //     console.error("Error processing demographic data:", error);
  //     return {
  //       chartByGender: {},
  //       chartByDevice: {},
  //     };
  //   }
  // }, [GGDemographicData]);

  // Fix: Add summarizeData to dependency array
  useEffect(() => {
    summarizeData();
  }, [summarizeData]);

  // Fix: Memoize formatted metrics to prevent unnecessary recalculations
  const formattedMetrics = useMemo(() => {
    if (!PerformanceMaxTotals || !PerformanceMaxComparison) {
      return {};
    }

    return {
      impressionData: formatDisplayData(
        PerformanceMaxTotals?.Impressions,
        PerformanceMaxComparison?.Impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        PerformanceMaxTotals?.Clicks,
        PerformanceMaxComparison?.Clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        PerformanceMaxTotals?.ctr,
        PerformanceMaxComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        PerformanceMaxTotals?.cpc,
        PerformanceMaxComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        PerformanceMaxTotals?.Conversions,
        PerformanceMaxComparison?.Conversions,
        "number"
      ),
      cplData: formatDisplayData(
        PerformanceMaxTotals?.cpl,
        PerformanceMaxComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        PerformanceMaxTotals?.Spent,
        PerformanceMaxComparison?.Spent,
        "compact"
      ),
      conRate: formatDisplayData(
        PerformanceMaxTotals?.cvr,
        PerformanceMaxComparison?.cvr,
        "percentage"
      ),
      cpmData: formatDisplayData(
        PerformanceMaxTotals?.cpm,
        PerformanceMaxComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        PerformanceMaxTotals?.reach,
        PerformanceMaxComparison?.reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        PerformanceMaxTotals?.frequency,
        PerformanceMaxComparison?.frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        PerformanceMaxTotals?.cpr,
        PerformanceMaxComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        PerformanceMaxTotals?.engagements,
        PerformanceMaxComparison?.engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        PerformanceMaxTotals?.engagementRate,
        PerformanceMaxComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        PerformanceMaxTotals?.cpe,
        PerformanceMaxComparison?.cpe,
        "compact"
      ),
      viewRateData: formatDisplayData(
        PerformanceMaxTotals?.viewRate,
        PerformanceMaxComparison?.viewRate,
        "percentage"
      ),
      VideoViewsData: formatDisplayData(
        PerformanceMaxTotals["views"],
        PerformanceMaxComparison["views"],
        "number"
      ),
      cpvData: formatDisplayData(
        PerformanceMaxTotals?.cpv,
        PerformanceMaxComparison?.cpv,
        "compact"
      ),
      conRateData: formatDisplayData(
        PerformanceMaxTotals?.conRate,
        PerformanceMaxComparison?.conRate,
        "percentage"
      ),
      purchaseConValueData: formatDisplayData(
        PerformanceMaxTotals?.purchaseConValue,
        PerformanceMaxComparison?.purchaseConValue,
        "compact"
      ),
      roasData: formatDisplayData(
        PerformanceMaxTotals?.roas,
        PerformanceMaxComparison?.roas,
        "compact"
      ),
      purchaseData: formatDisplayData(
        PerformanceMaxTotals?.purchase,
        PerformanceMaxComparison?.purchase,
        "number"
      ),
      addToCartData: formatDisplayData(
        PerformanceMaxTotals?.addToCart,
        PerformanceMaxComparison?.addToCart,
        "number"
      ),
      view6secData: formatDisplayData(
        PerformanceMaxTotals?.view6sec,
        PerformanceMaxComparison?.view6sec,
        "number"
      ),
      conversionValueData: formatDisplayData(
        PerformanceMaxTotals["Conversion value"],
        PerformanceMaxComparison["Conversion value"],
        "compact"
      ),
    };
  }, [PerformanceMaxTotals, PerformanceMaxComparison]);

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
      id="performance-max-component"
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
      <SlideHeader title={"Performance Max"} />
      <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-20 h-full">
          <div className="col-span-16 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-4 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-3 text-lg font-semibold">Conversions</h4>

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
                title={"%Con Rate"}
                value={formattedMetrics.conRateData?.displayValue}
                compareValue={formattedMetrics.conRateData?.compareValue}
                isNegative={formattedMetrics.conRateData?.isNegative}
                isConversion={true}
              />

              <NumberDisplayBox
                title={"Spent"}
                value={formattedMetrics.spentData?.displayValue}
                isConversion={true}
                compareValue={formattedMetrics.spentData?.compareValue}
                isNegative={formattedMetrics.spentData?.isNegative}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Keywords</h4>

              <AdvancedDataTable
                firstMetric="Date"
                channelData={PerformanceMaxData}
                totalData={PerformanceMaxTotals}
                metrics={[
                  "Impressions",
                  "Clicks",
                  "ctr",
                  "cpc",
                  "Conversions",
                  "conRate",
                  "cpl",
                  "Spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="Updated Date"
                defaultSortOrder="asc"
                enableSorting={true}
              />
            </div>
          </div>
          <div className="col-span-4 flex flex-col justify-between">
            {/* Images */}
            <div className="col-span-4 flex flex-col"></div>
          </div>
          {/* Summary */}
          <div className="px-4 mt-6 col-span-10">
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

export default PerformanceMaxSlide;
