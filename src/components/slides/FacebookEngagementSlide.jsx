import React, { useEffect, useState } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./NumberDisplayBox";
import TextEditorModal from "./TextEditorModal";
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

function FacebookEngagementSlide() {
  const {
    loading,
    error,
    refetch,
    GGDemographicData,
    FacebookAudienceData,
    FacebookAudienceTotals,
    FacebookAudienceMetrics,
    FacebookAudienceComparison,
    FacebookCreativeData,
    FacebookCreativeTotals,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([5, 4]);

  const summarizeData = () => {
    // Handle "No Data" case
    if (
      FacebookAudienceTotals?.clicks === "No Data" ||
      !FacebookAudienceTotals ||
      Object.keys(FacebookAudienceTotals).length === 0
    ) {
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall Engagements: ** ${parseFloat(
      FacebookAudienceTotals?.engagements?.toFixed(2) || 0
    )?.toLocaleString()} post engagements**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    summaryTextTemp += `<li>Average CPE: **${FacebookAudienceTotals.cpe?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

    // Find top audience by engagements (simpler approach)
    const topAudience = Object.entries(FacebookAudienceData).reduce(
      (max, [key, value]) =>
        (value.engagements || 0) > (max.value.engagements || 0)
          ? { key, value }
          : max,
      { key: "", value: { engagements: 0 } }
    );

    const topAudienceText = `Top Audience: **${
      topAudience.key
    } (with ${topAudience.value.engagements?.toLocaleString()} post engagements)**`;
    summaryTextTemp += `<li>${topAudienceText}</li>`;

    // Find top creative by impressions (simpler approach)
    const topCreative = Object.entries(FacebookCreativeData).reduce(
      (max, [key, value]) =>
        (value.engagements || 0) > (max.value.engagements || 0)
          ? { key, value }
          : max,
      { key: "", value: { engagements: 0 } }
    );
    const topCreativeText = `Top Creative: **${
      topCreative.key
    } (with ${topCreative.value.engagements?.toLocaleString()} post engagements**`;
    summaryTextTemp += `<li>${topCreativeText}</li>`;

    setSummaryText(summaryTextTemp);
  };

  useEffect(() => {
    summarizeData();
  }, [FacebookAudienceTotals, FacebookAudienceData, GGDemographicData]);

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
    FacebookAudienceTotals?.impressions,
    FacebookAudienceComparison?.impressions,
    "compact"
  );
  const clicksData = formatDisplayData(
    FacebookAudienceTotals?.clicks,
    FacebookAudienceComparison?.clicks,
    "compact"
  );
  const ctrData = formatDisplayData(
    FacebookAudienceTotals?.ctr,
    FacebookAudienceComparison?.ctr,
    "percentage"
  );
  const cpcData = formatDisplayData(
    FacebookAudienceTotals?.cpc,
    FacebookAudienceComparison?.cpc,
    "compact"
  );
  const conversionsData = formatDisplayData(
    FacebookAudienceTotals?.conversions,
    FacebookAudienceComparison?.conversions,
    "number"
  );
  const cplData = formatDisplayData(
    FacebookAudienceTotals?.cpl,
    FacebookAudienceComparison?.cpl,
    "compact"
  );
  const spentData = formatDisplayData(
    FacebookAudienceTotals?.spent,
    FacebookAudienceComparison?.spent,
    "compact"
  );
  const conRate = formatDisplayData(
    FacebookAudienceTotals?.cvr, // Changed from conRate to cvr
    FacebookAudienceComparison?.cvr,
    "percentage"
  );
  const cpmData = formatDisplayData(
    FacebookAudienceTotals?.cpm,
    FacebookAudienceComparison?.cpm,
    "compact"
  );
  const reachData = formatDisplayData(
    FacebookAudienceTotals?.reach,
    FacebookAudienceComparison?.reach,
    "compact"
  );
  const frequencyData = formatDisplayData(
    FacebookAudienceTotals?.frequency,
    FacebookAudienceComparison?.frequency,
    "compact"
  );
  const cprData = formatDisplayData(
    FacebookAudienceTotals?.cpr,
    FacebookAudienceComparison?.cpr,
    "compact"
  );
  const engagementData = formatDisplayData(
    FacebookAudienceTotals?.engagements,
    FacebookAudienceComparison?.engagements,
    "compact"
  );
  const engagementRateData = formatDisplayData(
    FacebookAudienceTotals?.engagementRate,
    FacebookAudienceComparison?.engagementRate,
    "percentage"
  );
  const cpeData = formatDisplayData(
    FacebookAudienceTotals?.cpe,
    FacebookAudienceComparison?.cpe,
    "compact"
  );

  // Alternative: Batch formatting approach (safer for useState data)
  // const formattedMetrics = formatMetricsData(DiscTotals, DiscComparison, METRIC_CONFIGS);
  // console.log("facebookMEtrics", FacebookAudienceMetrics);
  // console.log("data", FacebookAudienceData);
  return (
    <div
      id="facebook-engagement-component"
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
      <SlideHeader title={"Facebook Engagement"} />
      <div className="flex flex-col h-full gap-2">
        <div className="grid grid-cols-16">
          <div className="col-span-13 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-7 text-lg font-semibold">
                Awareness & Considerations
              </h4>

              <NumberDisplayBox
                title={"Impression"}
                value={impressionData.displayValue}
                compareValue={impressionData.compareValue}
                isNegative={impressionData.isNegative}
              />
              <NumberDisplayBox
                title={"Reach"}
                value={reachData.displayValue}
                compareValue={reachData.compareValue}
                isNegative={reachData.isNegative}
              />

              <NumberDisplayBox
                title={"Post Engagement"}
                value={engagementData.displayValue}
                compareValue={engagementData.compareValue}
                isNegative={engagementData.isNegative}
              />

              <NumberDisplayBox
                title={"% Engagement Rate"}
                value={engagementRateData.displayValue}
                compareValue={engagementRateData.compareValue}
                isNegative={engagementRateData.isNegative}
              />

              <NumberDisplayBox
                title={"CPE"}
                value={cpeData.displayValue}
                compareValue={cpeData.compareValue}
                isNegative={cpeData.isNegative}
                invertCompareColor={true}
              />

              <NumberDisplayBox
                title={"Conversions"}
                value={conversionsData.displayValue}
                isConversion={true}
                compareValue={conversionsData.compareValue}
                isNegative={conversionsData.isNegative}
              />

              <NumberDisplayBox
                title={"Spent"}
                value={spentData.displayValue}
                isConversion={true}
                compareValue={spentData.compareValue}
                isNegative={spentData.isNegative}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Audience</h4>

              <AdvancedDataTable
                firstMetric="Ad set name"
                channelData={FacebookAudienceData}
                totalData={FacebookAudienceTotals}
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
                defaultSortBy="reach"
                defaultSortOrder="desc"
                enableSorting={true} // Can disable sorting if needed
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-16">
          <div className="col-span-11">
            <h4 className="text-lg font-semibold">Performance by Creative</h4>

            <AdvancedDataTable
              firstMetric="Ad name"
              channelData={FacebookCreativeData}
              totalData={FacebookCreativeTotals}
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
              maxRows={maxTableRows[1]}
              defaultSortBy="reach"
              defaultSortOrder="desc"
              enableSorting={true} // Can disable sorting if needed
            />
          </div>
          <div className="col-span-5">
            {/* Summary */}
            <div className="px-4 mt-6">
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

export default FacebookEngagementSlide;
