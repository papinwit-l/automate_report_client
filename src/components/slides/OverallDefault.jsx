import React, { useEffect, useMemo, useState } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./utils/NumberDisplayBox";
import TextEditorModal from "./utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

// Import utility functions
import { formatDisplayData, formatTableValue } from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";
import OverallTextEditorModal from "./utils/OverallTextEditorModal";

function OverallDefault() {
  const {
    loading,
    error,
    refetch,
    GGDemographicData,
    overallData,
    overallTotals,
    overallComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([10]);
  const [isCPA, setIsCPA] = useState(false);

  const summarizeData = () => {
    // Handle "No Data" case
    if (
      overallTotals?.Clicks === "No Data" ||
      !overallTotals ||
      Object.keys(overallTotals).length === 0
    ) {
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall: **CPL ${parseFloat(
      overallTotals?.cpl?.toFixed(2) || 0
    )?.toLocaleString()} THB with ${
      overallTotals.Conversions || 0
    } conversions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    // Find top channel by conversions
    const topConversionChannel = Object.entries(overallData).reduce(
      (max, [key, value]) =>
        (value.Conversions || 0) > (max.value.Conversions || 0)
          ? { key, value }
          : max,
      { key: "", value: { Conversions: 0 } }
    );

    if (topConversionChannel.key) {
      const topChannelText = `Highest conversion channel: **${
        topConversionChannel.key
      } with ${topConversionChannel.value.Conversions?.toLocaleString()} conversions (${(
        (topConversionChannel.value.Conversions / overallTotals.Conversions) *
        100
      ).toFixed(2)}% of total conversions)**`;
      summaryTextTemp += `<li>${topChannelText}</li>`;
    }

    // Find top channel by conversion rate
    const topConversionRateChannel = Object.entries(overallData).reduce(
      (max, [key, value]) =>
        (value.conRate || 0) > (max.value.conRate || 0) ? { key, value } : max,
      { key: "", value: { conRate: 0 } }
    );

    if (
      topConversionRateChannel.key &&
      topConversionRateChannel.key !== topConversionChannel.key
    ) {
      const topRateText = `Highest conversion rate channel: **${
        topConversionRateChannel.key
      } with ${topConversionRateChannel.value.conRate?.toFixed(
        2
      )}% conversion rate**`;
      summaryTextTemp += `<li>${topRateText}</li>`;
    }

    setSummaryText(summaryTextTemp);
  };

  useEffect(() => {
    // console.log("Overall data", overallData);
    summarizeData();
  }, [overallTotals, overallData]);

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
  const formattedMetrics = useMemo(() => {
    if (!overallTotals || !overallComparison) {
      return {};
    }

    // console.log("🎯 overallTotals:", overallTotals);

    return {
      impressionData: formatDisplayData(
        overallTotals?.impressions || overallTotals?.Impressions,
        overallComparison?.impressions || overallComparison?.Impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        overallTotals?.clicks || overallTotals?.Clicks,
        overallComparison?.clicks || overallComparison?.Clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        overallTotals?.ctr,
        overallComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        overallTotals?.cpc,
        overallComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        overallTotals?.conversions || overallTotals?.Conversions,
        overallComparison?.conversions || overallComparison?.Conversions,
        "number"
      ),
      cplData: formatDisplayData(
        overallTotals?.cpl,
        overallComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        overallTotals?.spent || overallTotals?.Spent,
        overallComparison?.spent || overallComparison?.Spent,
        "compact"
      ),
      cpmData: formatDisplayData(
        overallTotals?.cpm,
        overallComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        overallTotals?.reach || overallTotals?.Reach,
        overallComparison?.reach || overallComparison?.Reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        overallTotals?.frequency || overallTotals?.Frequency,
        overallComparison?.frequency || overallComparison?.Frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        overallTotals?.cpr,
        overallComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        overallTotals?.engagements || overallTotals?.Engagements,
        overallComparison?.engagements || overallComparison?.Engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        overallTotals?.engagementRate,
        overallComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        overallTotals?.cpe,
        overallComparison?.cpe,
        "compact"
      ),
      viewRateData: formatDisplayData(
        overallTotals?.viewRate,
        overallComparison?.viewRate,
        "percentage"
      ),
      VideoViewsData: formatDisplayData(
        overallTotals["views"],
        overallComparison["views"],
        "number"
      ),
      cpvData: formatDisplayData(
        overallTotals?.cpv,
        overallComparison?.cpv,
        "compact"
      ),
      conRateData: formatDisplayData(
        overallTotals?.cvr || overallTotals?.conRate,
        overallComparison?.cvr || overallComparison?.conRate,
        "percentage"
      ),
      purchaseConValueData: formatDisplayData(
        overallTotals?.purchaseConValue,
        overallComparison?.purchaseConValue,
        "compact"
      ),
      roasData: formatDisplayData(
        overallTotals?.roas,
        overallComparison?.roas,
        "compact"
      ),
      purchaseData: formatDisplayData(
        overallTotals?.purchase,
        overallComparison?.purchase,
        "number"
      ),
      addToCartData: formatDisplayData(
        overallTotals?.addToCart,
        overallComparison?.addToCart,
        "number"
      ),
      view6secData: formatDisplayData(
        overallTotals?.view6sec,
        overallComparison?.view6sec,
        "number"
      ),
    };
  }, [overallTotals, overallComparison]);

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
      id="overall-component"
      data-exportable={true}
      data-export-title="Overall"
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
      <SlideHeader title={"Overall"} />
      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-16">
          <div className="col-span-16 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-3 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-4 text-lg font-semibold">Conversions</h4>

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
                title={"Conversions"}
                value={formattedMetrics.conversionsData?.displayValue}
                isConversion={true}
                compareValue={formattedMetrics.conversionsData?.compareValue}
                isNegative={formattedMetrics.conversionsData?.isNegative}
              />
              <NumberDisplayBox
                title={"%Con Rate"}
                value={formattedMetrics.conRateData?.displayValue}
                compareValue={formattedMetrics.conRateData?.compareValue}
                isConversion={true}
                isNegative={formattedMetrics.conRateData?.isNegative}
              />
              <NumberDisplayBox
                title={isCPA ? "CPA" : "CPL"}
                value={formattedMetrics.cplData?.displayValue}
                compareValue={formattedMetrics.cplData?.compareValue}
                isConversion={true}
                isNegative={formattedMetrics.cplData?.isNegative}
                invertCompareColor={true}
              />
              <NumberDisplayBox
                title={"Spent"}
                value={formattedMetrics.spentData?.displayValue}
                compareValue={formattedMetrics.spentData?.compareValue}
                isConversion={true}
                isNegative={formattedMetrics.spentData?.isNegative}
                invertCompareColor={true}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Performance by Channel</h4>

              <AdvancedDataTable
                firstMetric="Channel"
                channelData={overallData}
                totalData={overallTotals}
                metrics={[
                  "Impressions",
                  "Clicks",
                  "ctr",
                  "Conversions",
                  "conRate",
                  isCPA ? "cpa" : "cpl",
                  "Spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="Conversions"
                defaultSortOrder="desc"
                enableSorting={true}
              />
            </div>
            <div className="grid grid-cols-2">
              <div className="col-span-2">
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
            {/* Chart */}
            {/* <div className="col-span-3">
              <DonutChart
                data={impressionsByGender}
                title="Impression By Gender"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
              <DonutChart
                data={impressionsByAge}
                title="Impression By Age"
                width={220}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
                isLegendWrap={false}
              />
            </div> */}
          </div>
        </div>
      </div>
      {/* <TextEditorModal
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
      /> */}
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

export default OverallDefault;
