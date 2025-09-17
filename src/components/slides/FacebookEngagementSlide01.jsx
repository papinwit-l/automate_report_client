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

function FacebookEngagementSlide01() {
  const {
    loading,
    error,
    refetch,
    FBDemographicData,
    FacebookEngagementAudienceData,
    FacebookEngagementAudienceTotals,
    FacebookEngagementCreativeData,
    FacebookEngagementCreativeTotals,
    FacebookEngagementAudienceMetrics,
    FacebookEngagementAudienceComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([5, 4]);
  const [isNoData, setIsNoData] = useState(false);

  const summarizeData = () => {
    // Handle "No Data" case
    if (
      !FacebookEngagementAudienceData ||
      !FacebookEngagementAudienceTotals ||
      Object.keys(FacebookEngagementAudienceData).length === 0 ||
      Object.keys(FacebookEngagementAudienceTotals).length === 0
    ) {
      setIsNoData(true);
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall engagements: ** ${parseFloat(
      FacebookEngagementAudienceTotals?.engagements?.toFixed(2) || 0
    )?.toLocaleString()} post engagements**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    summaryTextTemp += `<li>Average CPE: **${FacebookEngagementAudienceTotals.cpe?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

    // Find top audience by engagements (simpler approach)
    const topAudience = Object.entries(FacebookEngagementAudienceData).reduce(
      (max, [key, value]) =>
        (value.engagements || 0) > (max.value.engagements || 0)
          ? { key, value }
          : max,
      { key: "", value: { engagements: 0 } }
    );

    const topAudienceText = `Top audience: **${
      topAudience.key
    } (with ${topAudience.value.engagements?.toLocaleString()} post engagements)**`;
    summaryTextTemp += `<li>${topAudienceText}</li>`;

    // Find top creative by impressions (simpler approach)
    const topCreative = Object.entries(FacebookEngagementCreativeData).reduce(
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
    const GRAPH_KEY = "Engagements";
    const CHANNEL = "FB Engagement";

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
  }, [FacebookEngagementAudienceTotals, FacebookEngagementAudienceData]);

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
    FacebookEngagementAudienceTotals?.impressions,
    FacebookEngagementAudienceComparison?.impressions,
    "compact"
  );
  const clicksData = formatDisplayData(
    FacebookEngagementAudienceTotals?.clicks,
    FacebookEngagementAudienceComparison?.clicks,
    "compact"
  );
  const ctrData = formatDisplayData(
    FacebookEngagementAudienceTotals?.ctr,
    FacebookEngagementAudienceComparison?.ctr,
    "percentage"
  );
  const cpcData = formatDisplayData(
    FacebookEngagementAudienceTotals?.cpc,
    FacebookEngagementAudienceComparison?.cpc,
    "compact"
  );
  const conversionsData = formatDisplayData(
    FacebookEngagementAudienceTotals?.conversions,
    FacebookEngagementAudienceComparison?.conversions,
    "number"
  );
  const cplData = formatDisplayData(
    FacebookEngagementAudienceTotals?.cpl,
    FacebookEngagementAudienceComparison?.cpl,
    "compact"
  );
  const spentData = formatDisplayData(
    FacebookEngagementAudienceTotals?.spent,
    FacebookEngagementAudienceComparison?.spent,
    "compact"
  );
  const conRate = formatDisplayData(
    FacebookEngagementAudienceTotals?.cvr, // Changed from conRate to cvr
    FacebookEngagementAudienceComparison?.cvr,
    "percentage"
  );
  const cpmData = formatDisplayData(
    FacebookEngagementAudienceTotals?.cpm,
    FacebookEngagementAudienceComparison?.cpm,
    "compact"
  );
  const reachData = formatDisplayData(
    FacebookEngagementAudienceTotals?.reach,
    FacebookEngagementAudienceComparison?.reach,
    "compact"
  );
  const frequencyData = formatDisplayData(
    FacebookEngagementAudienceTotals?.frequency,
    FacebookEngagementAudienceComparison?.frequency,
    "compact"
  );
  const cprData = formatDisplayData(
    FacebookEngagementAudienceTotals?.cpr,
    FacebookEngagementAudienceComparison?.cpr,
    "compact"
  );
  const engagementData = formatDisplayData(
    FacebookEngagementAudienceTotals?.engagements,
    FacebookEngagementAudienceComparison?.engagements,
    "compact"
  );
  const engagementRateData = formatDisplayData(
    FacebookEngagementAudienceTotals?.engagementRate,
    FacebookEngagementAudienceComparison?.engagementRate,
    "percentage"
  );
  const cpeData = formatDisplayData(
    FacebookEngagementAudienceTotals?.cpe,
    FacebookEngagementAudienceComparison?.cpe,
    "compact"
  );

  // Alternative: Batch formatting approach (safer for useState data)
  // const formattedMetrics = formatMetricsData(DiscTotals, DiscComparison, METRIC_CONFIGS);
  // console.log("facebookMEtrics", FacebookAudienceMetrics);
  // console.log("data", FacebookAudienceData);
  return (
    <div
      id="facebook-engagement-01-component"
      data-exportable={true}
      data-export-title="Facebook Engagement (1/2)"
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
      <SlideHeader title={"Facebook Engagement (1/2)"} />
      <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-16">
          <div className="col-span-12 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-5 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-2 text-lg font-semibold">Conversions</h4>

              <NumberDisplayBox
                title={"Impression"}
                value={isNoData ? "No Data" : impressionData.displayValue}
                compareValue={impressionData.compareValue}
                isNegative={impressionData.isNegative}
              />
              <NumberDisplayBox
                title={"Reach"}
                value={isNoData ? "No Data" : reachData.displayValue}
                compareValue={reachData.compareValue}
                isNegative={reachData.isNegative}
              />

              <NumberDisplayBox
                title={"Engagement"}
                value={isNoData ? "No Data" : engagementData.displayValue}
                compareValue={engagementData.compareValue}
                isNegative={engagementData.isNegative}
              />

              <NumberDisplayBox
                title={"%Engage Rate"}
                value={isNoData ? "No Data" : engagementRateData.displayValue}
                compareValue={engagementRateData.compareValue}
                isNegative={engagementRateData.isNegative}
              />

              <NumberDisplayBox
                title={"CPE"}
                value={isNoData ? "No Data" : cpeData.displayValue}
                compareValue={cpeData.compareValue}
                isNegative={cpeData.isNegative}
                invertCompareColor={true}
              />

              <NumberDisplayBox
                title={"Conversions"}
                value={isNoData ? "No Data" : conversionsData.displayValue}
                isConversion={true}
                compareValue={conversionsData.compareValue}
                isNegative={conversionsData.isNegative}
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
                channelData={FacebookEngagementAudienceData}
                totalData={FacebookEngagementAudienceTotals}
                metrics={[
                  "Ad set name",
                  "impressions",
                  "reach",
                  "engagements",
                  "engagementRate",
                  "cpe",
                  "conversions",
                  "spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="impressions"
                defaultSortOrder="desc"
                enableSorting={true} // Can disable sorting if needed
              />
            </div>
            {/* Summary */}
            <div className="px-4 ">
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
      />
    </div>
  );
}

export default FacebookEngagementSlide01;
