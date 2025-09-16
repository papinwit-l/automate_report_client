import React, { useEffect, useMemo, useState, useCallback } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./utils/NumberDisplayBox";
import TextEditorModal from "./utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";

function FacebookLeadSlide01() {
  const {
    loading,
    error,
    refetch,
    FacebookLeadAudienceData,
    FacebookLeadAudienceTotals,
    FacebookLeadAudienceMetrics,
    FacebookLeadAudienceComparison,
    FacebookLeadCreativeData,
    FacebookLeadCreativeTotals,
    FBDemographicData,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([8]);
  const [isNoData, setIsNoData] = useState(false);

  const [isCPA, setIsCPA] = useState(false);

  // Fix: Memoize summarizeData to prevent unnecessary re-renders
  const summarizeData = useCallback(() => {
    try {
      // Handle "No Data" case
      if (
        Object.keys(FacebookLeadAudienceData).length === 0 ||
        Object.keys(FacebookLeadAudienceTotals).length === 0
      ) {
        setIsNoData(true);
        setSummaryText("<li>No data available for the selected period</li>");
        return;
      }

      let summaryTextTemp = "";
      const overallText = `Overall conversions: ** ${parseFloat(
        FacebookLeadAudienceTotals?.conversions?.toFixed(2) || 0
      )?.toLocaleString()} leads**`;
      summaryTextTemp = `<li>${overallText}</li>`;

      summaryTextTemp += `<li>Average CPL: **${FacebookLeadAudienceTotals.cpl?.toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )} THB (per lead)**</li>`;

      // Find top audience by conversions (with error handling)
      const topAudience = FacebookLeadAudienceData
        ? Object.entries(FacebookLeadAudienceData).reduce(
            (max, [key, value]) =>
              (value?.conversions || 0) > (max.value?.conversions || 0)
                ? { key, value }
                : max,
            { key: "", value: { conversions: 0 } }
          )
        : { key: "", value: { conversions: 0 } };

      if (topAudience.key) {
        const topAudienceText = `Top audience: **${
          topAudience.key
        } (with ${topAudience.value.conversions?.toLocaleString()} leads)**`;
        summaryTextTemp += `<li>${topAudienceText}</li>`;
      }

      // Find top creative by conversions (with error handling)
      const topCreative = FacebookLeadCreativeData
        ? Object.entries(FacebookLeadCreativeData).reduce(
            (max, [key, value]) =>
              (value?.conversions || 0) > (max.value?.conversions || 0)
                ? { key, value }
                : max,
            { key: "", value: { conversions: 0 } }
          )
        : { key: "", value: { conversions: 0 } };

      if (topCreative.key) {
        const topCreativeText = `Top creative: **${
          topCreative.key
        } (with ${topCreative.value.conversions?.toLocaleString()} leads)**`;
        // summaryTextTemp += `<li>${topCreativeText}</li>`;
      }

      setSummaryText(summaryTextTemp);
    } catch (error) {
      console.error("Error in summarizeData:", error);
      setSummaryText("<li>Error generating summary</li>");
    }
  }, [
    FacebookLeadAudienceTotals,
    FacebookLeadAudienceData,
    FacebookLeadCreativeData,
  ]);

  //Demographic for chart
  const { chartByGender, chartByAge, chartByDevice } = useMemo(() => {
    const GRAPH_KEY = "On-Facebook leads";
    const CHANNEL = "FB Lead";

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

  // Fix: Add summarizeData to dependency array
  useEffect(() => {
    summarizeData();
  }, [summarizeData]);

  // Fix: Memoize formatted metrics to prevent unnecessary recalculations
  const formattedMetrics = useMemo(() => {
    if (!FacebookLeadAudienceTotals || !FacebookLeadAudienceComparison) {
      return {};
    }

    return {
      impressionData: formatDisplayData(
        FacebookLeadAudienceTotals?.impressions,
        FacebookLeadAudienceComparison?.impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        FacebookLeadAudienceTotals?.clicks,
        FacebookLeadAudienceComparison?.clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        FacebookLeadAudienceTotals?.ctr,
        FacebookLeadAudienceComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        FacebookLeadAudienceTotals?.cpc,
        FacebookLeadAudienceComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        FacebookLeadAudienceTotals?.conversions,
        FacebookLeadAudienceComparison?.conversions,
        "number"
      ),
      cplData: formatDisplayData(
        FacebookLeadAudienceTotals?.cpl,
        FacebookLeadAudienceComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        FacebookLeadAudienceTotals?.spent,
        FacebookLeadAudienceComparison?.spent,
        "compact"
      ),
      conRate: formatDisplayData(
        FacebookLeadAudienceTotals?.cvr,
        FacebookLeadAudienceComparison?.cvr,
        "percentage"
      ),
      cpmData: formatDisplayData(
        FacebookLeadAudienceTotals?.cpm,
        FacebookLeadAudienceComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        FacebookLeadAudienceTotals?.reach,
        FacebookLeadAudienceComparison?.reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        FacebookLeadAudienceTotals?.frequency,
        FacebookLeadAudienceComparison?.frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        FacebookLeadAudienceTotals?.cpr,
        FacebookLeadAudienceComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        FacebookLeadAudienceTotals?.engagements,
        FacebookLeadAudienceComparison?.engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        FacebookLeadAudienceTotals?.engagementRate,
        FacebookLeadAudienceComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        FacebookLeadAudienceTotals?.cpe,
        FacebookLeadAudienceComparison?.cpe,
        "compact"
      ),
    };
  }, [FacebookLeadAudienceTotals, FacebookLeadAudienceComparison]);

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
      id="facebook-lead-01-component"
      data-exportable={true}
      data-export-title="Facebook Lead (1/2)"
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
      <SlideHeader title={"Facebook Lead (1/2)"} />
      <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-16">
          <div className="col-span-12 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-3 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-4 text-lg font-semibold">Conversions</h4>

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
                title={"Clicks"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.clicksData?.displayValue
                }
                compareValue={formattedMetrics.clicksData?.compareValue}
                isNegative={formattedMetrics.clicksData?.isNegative}
              />

              <NumberDisplayBox
                title={"%CTR"}
                value={
                  isNoData ? "No Data" : formattedMetrics.ctrData?.displayValue
                }
                compareValue={formattedMetrics.ctrData?.compareValue}
                isNegative={formattedMetrics.ctrData?.isNegative}
              />

              <NumberDisplayBox
                title={"Conversion"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.conversionsData?.displayValue
                }
                compareValue={formattedMetrics.conversionsData?.compareValue}
                isNegative={formattedMetrics.conversionsData?.isNegative}
                isConversion={true}
              />

              <NumberDisplayBox
                title={"%Con Rate"}
                value={
                  isNoData ? "No Data" : formattedMetrics.conRate?.displayValue
                }
                compareValue={formattedMetrics.conRate?.compareValue}
                isNegative={formattedMetrics.conRate?.isNegative}
                isConversion={true}
              />

              <NumberDisplayBox
                title={isCPA ? "CPA" : "CPL"}
                value={
                  isNoData ? "No Data" : formattedMetrics.cplData?.displayValue
                }
                isConversion={true}
                compareValue={formattedMetrics.cplData?.compareValue}
                isNegative={formattedMetrics.cplData?.isNegative}
                invertCompareColor={true}
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
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Audience</h4>

              <AdvancedDataTable
                firstMetric="Ad set name"
                channelData={FacebookLeadAudienceData}
                totalData={FacebookLeadAudienceTotals}
                metrics={[
                  "Ad set name",
                  "impressions",
                  "reach",
                  "clicks",
                  "ctr",
                  "cpc",
                  "conversions",
                  "cvr",
                  isCPA ? "cpa" : "cpl",
                  "spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="conversions"
                defaultSortOrder="desc"
                enableSorting={true}
                isLimitWidth={true}
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
          {/* Chart */}
          <div className="col-span-4 flex flex-col">
            <DonutChart
              data={chartByGender}
              title="Lead By Gender"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
            <DonutChart
              data={chartByAge}
              title="Lead By Age"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-16">
          <div className="col-span-16"></div>
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
        CPASetting={{ isCPA, setIsCPA }}
      />
    </div>
  );
}

export default FacebookLeadSlide01;
