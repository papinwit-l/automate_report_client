import React, { useEffect, useMemo, useState, useCallback } from "react";
import SlideHeader from "../SlideHeader";
import NumberDisplayBox from "../utils/NumberDisplayBox";
import TextEditorModal from "../utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "@/components/charts-tables/DonutChart";
import { Edit, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "@/components/charts-tables/AdvancedDataTable";

function AsiaHotelFBVideo01() {
  const {
    loading,
    error,
    refetch,
    FacebookAdsPicture,
    FBDemographicData,
    FacebookVideoAudienceData,
    FacebookVideoAudienceTotals,
    FacebookVideoCreativeData,
    FacebookVideoCreativeTotals,
    FacebookVideoAudienceMetrics,
    FacebookVideoComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([0]);
  const [isNoData, setIsNoData] = useState(false);

  // Fix: Memoize summarizeData to prevent unnecessary re-renders
  const summarizeData = useCallback(() => {
    const KEY = "views";
    const ENABLE_CONVERSION = false;
    try {
      // Handle "No Data" case
      if (
        Object.keys(FacebookVideoAudienceData).length === 0 ||
        Object.keys(FacebookVideoAudienceTotals).length === 0
      ) {
        setIsNoData(true);
        setSummaryText("<li>No data available for the selected period</li>");
        return;
      }

      let summaryTextTemp = "";
      const averageCPV = FacebookVideoAudienceTotals.cpv?.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );
      const overallText = `Overall video view: ** ${parseFloat(
        FacebookVideoAudienceTotals[KEY]?.toFixed(2) || 0
      )?.toLocaleString()} views**`;
      summaryTextTemp = `<li>${overallText}</li>`;
      summaryTextTemp += `<li>Average CPV: **${averageCPV} THB**</li>`;

      // Find top audience by reach (with error handling)
      const topAudience = FacebookVideoAudienceData
        ? Object.entries(FacebookVideoAudienceData).reduce(
            (max, [key, value]) =>
              (value[KEY] || 0) > (max.value[KEY] || 0) ? { key, value } : max,
            { key: "", value: { KEY: 0 } }
          )
        : { key: "", value: { KEY: 0 } };

      if (topAudience.key) {
        const topAudienceText = `Top audience: **${
          topAudience.key
        } (with ${topAudience.value[KEY]?.toLocaleString()} views)**`;
        summaryTextTemp += `<li>${topAudienceText}</li>`;
      }

      // Find top creative by reach (with error handling)
      const topCreative = FacebookVideoAudienceData
        ? Object.entries(FacebookVideoAudienceData).reduce(
            (max, [key, value]) =>
              (value?.viewRate || 0) > (max.value?.viewRate || 0)
                ? { key, value }
                : max,
            { key: "", value: { viewRate: 0 } }
          )
        : { key: "", value: { viewRate: 0 } };

      // if (topCreative.key) {
      // Fix: Added missing closing parenthesis
      const topCreativeText = `Potential ad group: **${
        topCreative.key
      } (with ${topCreative.value.viewRate?.toLocaleString()} %view rate)**`;
      // summaryTextTemp += `<li>${topCreativeText}</li>`;
      // }

      const totalConversions = FacebookVideoAudienceTotals?.Conversions;
      if (totalConversions > 0 && ENABLE_CONVERSION) {
        summaryTextTemp += `<li>Total conversion: **${totalConversions?.toLocaleString(
          undefined,
          { minimumFractionDigits: 0, maximumFractionDigits: 0 }
        )} conversions**</li>`;
      }

      setSummaryText(summaryTextTemp);
    } catch (error) {
      console.error("Error in summarizeData:", error);
      setSummaryText("<li>Error generating summary</li>");
    }
  }, [FacebookVideoAudienceTotals, FacebookVideoAudienceData]);

  //Demographic for chart
  const { chartByGender, chartByAge, chartByDevice } = useMemo(() => {
    const GRAPH_KEY = "Video views";
    const CHANNEL = "FB Video View";

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
    if (!FacebookVideoAudienceTotals || !FacebookVideoComparison) {
      return {};
    }

    return {
      impressionData: formatDisplayData(
        FacebookVideoAudienceTotals?.impressions,
        FacebookVideoComparison?.impressions,
        "compact"
      ),
      clicksData: formatDisplayData(
        FacebookVideoAudienceTotals?.clicks,
        FacebookVideoComparison?.clicks,
        "compact"
      ),
      ctrData: formatDisplayData(
        FacebookVideoAudienceTotals?.ctr,
        FacebookVideoComparison?.ctr,
        "percentage"
      ),
      cpcData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpc,
        FacebookVideoComparison?.cpc,
        "compact"
      ),
      conversionsData: formatDisplayData(
        FacebookVideoAudienceTotals?.conversions,
        FacebookVideoComparison?.conversions,
        "number"
      ),
      cplData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpl,
        FacebookVideoComparison?.cpl,
        "compact"
      ),
      spentData: formatDisplayData(
        FacebookVideoAudienceTotals?.spent,
        FacebookVideoComparison?.spent,
        "compact"
      ),
      cpmData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpm,
        FacebookVideoComparison?.cpm,
        "compact"
      ),
      reachData: formatDisplayData(
        FacebookVideoAudienceTotals?.reach,
        FacebookVideoComparison?.reach,
        "compact"
      ),
      frequencyData: formatDisplayData(
        FacebookVideoAudienceTotals?.frequency,
        FacebookVideoComparison?.frequency,
        "compact"
      ),
      cprData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpr,
        FacebookVideoComparison?.cpr,
        "compact"
      ),
      engagementData: formatDisplayData(
        FacebookVideoAudienceTotals?.engagements,
        FacebookVideoComparison?.engagements,
        "compact"
      ),
      engagementRateData: formatDisplayData(
        FacebookVideoAudienceTotals?.engagementRate,
        FacebookVideoComparison?.engagementRate,
        "percentage"
      ),
      cpeData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpe,
        FacebookVideoComparison?.cpe,
        "compact"
      ),
      viewRateData: formatDisplayData(
        FacebookVideoAudienceTotals?.viewRate,
        FacebookVideoComparison?.viewRate,
        "percentage"
      ),
      VideoViewsData: formatDisplayData(
        FacebookVideoAudienceTotals["views"],
        FacebookVideoComparison["views"],
        "number"
      ),
      cpvData: formatDisplayData(
        FacebookVideoAudienceTotals?.cpv,
        FacebookVideoComparison?.cpv,
        "compact"
      ),
      conRateData: formatDisplayData(
        FacebookVideoAudienceTotals?.conRate ||
          FacebookVideoAudienceTotals?.cvr,
        FacebookVideoComparison?.conRate || FacebookVideoComparison?.cvr,
        "percentage"
      ),
      conversionValueData: formatDisplayData(
        FacebookVideoAudienceTotals?.conversionValue,
        FacebookVideoComparison?.conversionValue,
        "compact"
      ),
    };
  }, [FacebookVideoAudienceTotals, FacebookVideoComparison]);

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
      id="facebook-video-01-component"
      data-exportable={true}
      data-export-title="Facebook VDO View (1/2)"
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
      <SlideHeader title={"Facebook VDO View (1/2)"} />
      <div className="flex flex-col h-full gap-2">
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
                title={"Video View"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.VideoViewsData?.displayValue
                }
                compareValue={formattedMetrics.VideoViewsData?.compareValue}
                isNegative={formattedMetrics.VideoViewsData?.isNegative}
              />

              <NumberDisplayBox
                title={"%View Rate"}
                value={
                  isNoData
                    ? "No Data"
                    : formattedMetrics.viewRateData?.displayValue
                }
                compareValue={formattedMetrics.viewRateData?.compareValue}
                isNegative={formattedMetrics.viewRateData?.isNegative}
              />
              <NumberDisplayBox
                title={"CPV"}
                value={
                  isNoData ? "No Data" : formattedMetrics.cpvData?.displayValue
                }
                compareValue={formattedMetrics.cpvData?.compareValue}
                isNegative={formattedMetrics.cpvData?.isNegative}
              />
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
                channelData={FacebookVideoAudienceData}
                totalData={FacebookVideoAudienceTotals}
                metrics={[
                  "Ad set name",
                  "impressions",
                  "reach",
                  "clicks",
                  "views",
                  "viewRate",
                  "cpv",
                  "conversions",
                  "conversionValue",
                  "spent",
                ]}
                formatValue={formatTableValue}
                maxRows={maxTableRows[0]}
                defaultSortBy="impressions"
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
          {/* Chart */}
          <div className="col-span-4 flex flex-col">
            <DonutChart
              data={chartByGender}
              title="Views By Gender"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
            <DonutChart
              data={chartByAge}
              title="Views By Gender"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
            {/* <DonutChart
              data={chartByDevice}
              title="Clicks By Device"
              width={220}
              height={160}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            /> */}
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
      />
    </div>
  );
}

export default AsiaHotelFBVideo01;
