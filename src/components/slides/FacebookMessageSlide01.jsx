import React, { useEffect, useMemo, useState } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./utils/NumberDisplayBox";
import TextEditorModal from "./utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import DataTable from "../charts-tables/DataTable";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";

function FacebookMessageSlide01() {
  const {
    loading,
    error,
    refetch,
    FBDemographicData,
    FacebookMessageAudienceData,
    FacebookMessageAudienceTotals,
    FacebookMessageCreativeData,
    FacebookMessageCreativeTotals,
    FacebookMessageAudienceMetrics,
    FacebookMessageAudienceComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([0]);
  const [isNoData, setIsNoData] = useState(false);

  const [isCPA, setIsCPA] = useState(true);

  const summarizeData = () => {
    // Handle "No Data" case
    if (
      !FacebookMessageAudienceData ||
      !FacebookMessageAudienceTotals ||
      Object.keys(FacebookMessageAudienceData).length === 0 ||
      Object.keys(FacebookMessageAudienceTotals).length === 0
    ) {
      setIsNoData(true);
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall messages: ** ${parseFloat(
      FacebookMessageAudienceTotals?.messages?.toFixed(2) || 0
    )?.toLocaleString()} messages**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    summaryTextTemp += `<li>Average CPA: **${FacebookMessageAudienceTotals.cpa?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

    // Find top audience by engagements (simpler approach)
    const topAudience = Object.entries(FacebookMessageAudienceData).reduce(
      (max, [key, value]) =>
        (value.messages || 0) > (max.value.messages || 0)
          ? { key, value }
          : max,
      { key: "", value: { messages: 0 } }
    );

    const topAudienceText = `Top audience: **${
      topAudience.key
    } (with ${topAudience.value.messages?.toLocaleString()} messages)**`;
    summaryTextTemp += `<li>${topAudienceText}</li>`;

    // Find top creative by impressions (simpler approach)
    const topCreative = Object.entries(FacebookMessageCreativeData).reduce(
      (max, [key, value]) =>
        (value.engagements || 0) > (max.value.engagements || 0)
          ? { key, value }
          : max,
      { key: "", value: { engagements: 0 } }
    );
    const topCreativeText = `Top creative: **${
      topCreative.key
    } (with ${topCreative.value.engagements?.toLocaleString()} post engagements)**`;
    // summaryTextTemp += `<li>${topCreativeText}</li>`;

    setSummaryText(summaryTextTemp);
  };

  //Demographic for chart
  const { chartByGender, chartByAge, chartByDevice } = useMemo(() => {
    const GRAPH_KEY = "Messaging conversations started";
    const CHANNEL = "FB Message";

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
  }, [FacebookMessageAudienceTotals, FacebookMessageAudienceData]);

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

  // Format display data with safe fallbacks
  // Using optional chaining to handle undefined/null values from useState
  const impressionData = formatDisplayData(
    FacebookMessageAudienceTotals?.impressions,
    FacebookMessageAudienceComparison?.impressions,
    "compact"
  );
  const clicksData = formatDisplayData(
    FacebookMessageAudienceTotals?.clicks,
    FacebookMessageAudienceComparison?.clicks,
    "compact"
  );
  const ctrData = formatDisplayData(
    FacebookMessageAudienceTotals?.ctr,
    FacebookMessageAudienceComparison?.ctr,
    "percentage"
  );
  const cpcData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpc,
    FacebookMessageAudienceComparison?.cpc,
    "compact"
  );
  const conversionsData = formatDisplayData(
    FacebookMessageAudienceTotals?.conversions,
    FacebookMessageAudienceComparison?.conversions,
    "number"
  );
  const cplData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpl,
    FacebookMessageAudienceComparison?.cpl,
    "compact"
  );
  const spentData = formatDisplayData(
    FacebookMessageAudienceTotals?.spent,
    FacebookMessageAudienceComparison?.spent,
    "compact"
  );
  const conRate = formatDisplayData(
    FacebookMessageAudienceTotals?.cvr, // Changed from conRate to cvr
    FacebookMessageAudienceComparison?.cvr,
    "percentage"
  );
  const cpmData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpm,
    FacebookMessageAudienceComparison?.cpm,
    "compact"
  );
  const reachData = formatDisplayData(
    FacebookMessageAudienceTotals?.reach,
    FacebookMessageAudienceComparison?.reach,
    "compact"
  );
  const frequencyData = formatDisplayData(
    FacebookMessageAudienceTotals?.frequency,
    FacebookMessageAudienceComparison?.frequency,
    "compact"
  );
  const cprData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpr,
    FacebookMessageAudienceComparison?.cpr,
    "compact"
  );
  const engagementData = formatDisplayData(
    FacebookMessageAudienceTotals?.engagements,
    FacebookMessageAudienceComparison?.engagements,
    "compact"
  );
  const engagementRateData = formatDisplayData(
    FacebookMessageAudienceTotals?.engagementRate,
    FacebookMessageAudienceComparison?.engagementRate,
    "percentage"
  );
  const cpeData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpe,
    FacebookMessageAudienceComparison?.cpe,
    "compact"
  );
  const cpaData = formatDisplayData(
    FacebookMessageAudienceTotals?.cpa,
    FacebookMessageAudienceComparison?.cpa,
    "compact"
  );

  // Alternative: Batch formatting approach (safer for useState data)
  // const formattedMetrics = formatMetricsData(DiscTotals, DiscComparison, METRIC_CONFIGS);
  // console.log("facebookMEtrics", FacebookAudienceMetrics);
  // console.log("data", FacebookAudienceData);
  return (
    <div
      id="facebook-message-01-component"
      data-exportable={true}
      data-export-title="Facebook Message (1/2)"
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
      <SlideHeader title={"Facebook Message (1/2)"} />
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
                value={isNoData ? "No Data" : impressionData.displayValue}
                compareValue={impressionData.compareValue}
                isNegative={impressionData.isNegative}
              />
              <NumberDisplayBox
                title={"Link Clicks"}
                value={isNoData ? "No Data" : clicksData.displayValue}
                compareValue={clicksData.compareValue}
                isNegative={clicksData.isNegative}
              />

              <NumberDisplayBox
                title={"%CTR"}
                value={isNoData ? "No Data" : ctrData.displayValue}
                compareValue={ctrData.compareValue}
                isNegative={ctrData.isNegative}
              />

              <NumberDisplayBox
                title={"Conversions"}
                value={isNoData ? "No Data" : conversionsData.displayValue}
                isConversion={true}
                compareValue={conversionsData.compareValue}
                isNegative={conversionsData.isNegative}
              />

              <NumberDisplayBox
                title={"%Con Rate"}
                value={isNoData ? "No Data" : conRate.displayValue}
                compareValue={conRate.compareValue}
                isConversion={true}
                isNegative={conRate.isNegative}
              />

              <NumberDisplayBox
                title={isCPA ? "CPA" : "CPL"}
                value={isNoData ? "No Data" : cpaData.displayValue}
                compareValue={cpaData.compareValue}
                isConversion={true}
                isNegative={cpaData.isNegative}
                invertCompareColor={true}
              />

              <NumberDisplayBox
                title={"Spent"}
                value={isNoData ? "No Data" : spentData.displayValue}
                isConversion={true}
                compareValue={spentData.compareValue}
                isNegative={spentData.isNegative}
                invertCompareColor={true}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Audience</h4>

              <AdvancedDataTable
                firstMetric="Ad set name"
                channelData={FacebookMessageAudienceData}
                totalData={FacebookMessageAudienceTotals}
                metrics={[
                  "Ad set name",
                  "impressions",
                  "reach",
                  "clicks",
                  // "messages",
                  "ctr",
                  "conversions",
                  "cvr",
                  isCPA ? "cpa" : "cpl",
                  "spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="conversions"
                defaultSortOrder="desc"
                enableSorting={true} // Can disable sorting if needed
              />
            </div>
            {/* Summary */}
            <div className="">
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
          {/* Chart */}
          <div className="col-span-4">
            <DonutChart
              data={chartByGender}
              title="Messages By Gender"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
            <DonutChart
              data={chartByAge}
              title="Messages
               By Age"
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

export default FacebookMessageSlide01;
