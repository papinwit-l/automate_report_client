import React, { useEffect, useState, useMemo, useCallback } from "react";
import SlideHeader from "@/components/slides/SlideHeader";
import NumberDisplayBox from "@/components/slides/utils/NumberDisplayBox";
import TextEditorModal from "@/components/slides/utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

import { AdvancedDataTable } from "@/components/charts-tables/AdvancedDataTable";

// Import utility functions
import { formatTableValue } from "@/utils/dataDisplayUtils";
import {
  calculateComparison,
  filterDataByDateRange,
  getPreviousPeriodDates,
  metricDataProcess,
} from "@/utils/dataUtils";
import {
  cleanObjectData,
  processAdvertisingData,
  processSocialMediaData,
} from "@/utils/dataProcessors";
import {
  FACEBOOK_CALCULATED_FIELDS,
  FACEBOOK_FIELDS,
} from "@/configs/facebookDataConfigs";
import {
  TIKTOK_CALCULATED_FIELDS,
  TIKTOK_FIELDS,
} from "@/configs/tiktokDataConfigs";
import { tableUtilsMapping } from "@/utils/templateDataProcessors";

function GoogleSlideCustom(props) {
  const {
    id,
    title,
    table,
    metricData,
    metricConvLength,
    dataSource,
    dataGroupBy,
    dataChannel,
    summaryPosition,
    extraContentType,
    demographicChart,
  } = props;

  const { getDataList, enableDateRange, dateRange } = useData();

  const { data, totals, comparison, demographicData, displayTable } =
    useMemo(() => {
      if (!dataSource)
        return {
          data: {},
          totals: {},
          metrics: [],
          comparison: {},
          demographicData: {},
          displayTable: table,
        };

      const dataList = getDataList();
      const selectedData = dataList.find((data) => data.label === dataSource);

      if (!selectedData)
        return {
          data: {},
          totals: {},
          metrics: [],
          comparison: {},
          demographicData: {},
          displayTable: table,
        };

      const { data, totals, metrics, comparison, demographicData, rawData } =
        selectedData.value;

      let disTable = table;

      if (dataGroupBy !== "default") {
        const allFields = Object.keys(rawData[0]);
        // console.log("🎯 allFields:", allFields);
        let cleanedData = cleanObjectData(rawData, metrics);
        // console.log("🎯 cleanedData:", cleanedData);

        if (dataChannel !== "All") {
          cleanedData = cleanedData.filter(
            (item) => item["Channel"] === dataChannel
          );
        }

        // Declare variables outside the conditions
        let currentPeriodData = cleanedData; // Default to all cleaned data
        let previousPeriodData = [];
        let comparisonResult = {};
        let currentPeriodResults;
        let previousPeriodResults;

        const platform = dataSource === "Youtube" ? "Youtube" : "default";

        // Case 1: Date range is enabled
        if (enableDateRange && dateRange.from && dateRange.to) {
          currentPeriodData = filterDataByDateRange(
            cleanedData,
            dateRange.from,
            dateRange.to
          );

          const previousPeriodDates = getPreviousPeriodDates(
            dateRange.from,
            dateRange.to
          );

          previousPeriodData = filterDataByDateRange(
            cleanedData,
            previousPeriodDates.from,
            previousPeriodDates.to
          );

          // Process current period
          currentPeriodResults = processAdvertisingData(
            currentPeriodData,
            allFields,
            metrics,
            dataGroupBy,
            platform
          );

          // Process previous period
          previousPeriodResults = processAdvertisingData(
            previousPeriodData,
            allFields,
            metrics,
            dataGroupBy,
            platform
          );

          // Calculate comparison
          comparisonResult = calculateComparison(
            currentPeriodResults.enhancedTotals,
            previousPeriodResults.enhancedTotals
          );

          // Handle Facebook/TikTok
          if (
            dataSource.trim().toLowerCase().includes("facebook") ||
            dataSource.trim().toLowerCase().includes("tiktok")
          ) {
            const config = {
              audienceGroupBy: dataGroupBy,
              creativeGroupBy: dataGroupBy,
              fields: dataSource.trim().toLowerCase().includes("facebook")
                ? FACEBOOK_FIELDS
                : TIKTOK_FIELDS,
              calculatedFields: dataSource
                .trim()
                .toLowerCase()
                .includes("facebook")
                ? FACEBOOK_CALCULATED_FIELDS
                : TIKTOK_CALCULATED_FIELDS,
            };

            disTable = table.map((item) => tableUtilsMapping(item));

            currentPeriodResults = processSocialMediaData(
              currentPeriodData,
              allFields,
              metrics,
              config
            );
            previousPeriodResults = processSocialMediaData(
              previousPeriodData,
              allFields,
              metrics,
              config
            );
            comparisonResult = calculateComparison(
              currentPeriodResults.enhancedTotals,
              previousPeriodResults.enhancedTotals
            );
          }
        }
        // Case 2: No date range - process all data
        else {
          // Process all cleaned data
          currentPeriodResults = processAdvertisingData(
            currentPeriodData, // This is cleanedData
            allFields,
            metrics,
            dataGroupBy,
            platform
          );

          // No comparison when date range is disabled
          comparisonResult = {};

          // Handle Facebook/TikTok
          if (
            dataSource.trim().toLowerCase().includes("facebook") ||
            dataSource.trim().toLowerCase().includes("tiktok")
          ) {
            const config = {
              audienceGroupBy: dataGroupBy,
              creativeGroupBy: dataGroupBy,
              fields: dataSource.trim().toLowerCase().includes("facebook")
                ? FACEBOOK_FIELDS
                : TIKTOK_FIELDS,
              calculatedFields: dataSource
                .trim()
                .toLowerCase()
                .includes("facebook")
                ? FACEBOOK_CALCULATED_FIELDS
                : TIKTOK_CALCULATED_FIELDS,
            };

            disTable = table.map((item) => tableUtilsMapping(item));

            currentPeriodResults = processSocialMediaData(
              currentPeriodData, // This is cleanedData
              allFields,
              metrics,
              config
            );
          }
        }

        console.log("🎯 currentPeriodResults:", currentPeriodResults);

        return {
          data: currentPeriodResults.enhancedFieldData,
          totals: currentPeriodResults.enhancedTotals,
          metrics,
          comparison: comparisonResult,
          demographicData,
          displayTable: disTable,
        };
      }

      return { data, totals, metrics, comparison, demographicData, rawData };
    }, [
      dataSource,
      getDataList,
      dataGroupBy,
      dataChannel,
      enableDateRange,
      dateRange,
      table,
    ]);

  // console.log("data--", rawData);

  const { loading, error, refetch } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([14]);

  const [isCPA, setIsCPA] = useState(false);

  const chartDataProcess = (demoData, chartTemplate, source) => {
    const channelFilterd = demoData.filter((item) => {
      if (source === "All") {
        return true;
      }
      return item.Channel.trim().toLowerCase() === source.trim().toLowerCase();
    });

    if (channelFilterd.length === 0) {
      return [];
    }

    const chartData = chartTemplate.map((chart) => {
      // console.log("🎯 chart:", chart);
      const { chartBy, title, dataBy } = chart;

      const data = channelFilterd.reduce((acc, item) => {
        const key = item[chartBy];
        const value = parseFloat(item[dataBy]);

        if (key === undefined || isNaN(value)) return acc;

        acc[key] = (acc[key] || 0) + value;
        return acc;
      }, {});

      const sumData = Object.values(data).reduce((a, b) => a + b, 0);

      const percentageData = Object.entries(data).reduce(
        (acc, [key, value]) => {
          acc[key] =
            sumData > 0 ? ((value / sumData) * 100).toFixed(2) + "%" : "0%";
          return acc;
        },
        {}
      );

      // console.log("data", data);
      // console.log("sumData", sumData);
      // console.log("percentageData", percentageData);

      return {
        title,
        data,
        percentageData,
        chartBy,
      };
    });

    return chartData;
  };

  const { chartData } = useMemo(() => {
    console.log("demographicData", demographicData);
    if (!demographicData || !Array.isArray(demographicData)) {
      return { chartData: [] };
    }

    const chartsData = chartDataProcess(
      demographicData,
      demographicChart,
      dataChannel
    );

    console.log("🎯 chartsData:", chartsData);
    return { chartData: chartsData };
  }, [demographicData, demographicChart, dataChannel]);

  const summarizeData = useCallback(() => {
    // Handle "No Data" case
    if (
      totals?.Conversions === "No Data" ||
      !totals ||
      Object.keys(totals).length === 0
    ) {
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }

    let summaryTextTemp = "";
    const overallText = `Overall conversions: ** ${parseFloat(
      totals?.Conversions?.toFixed(2) || 0
    )?.toLocaleString()} conversions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    const averageCPL = totals?.cpl;

    summaryTextTemp += `<li>Average CPL: **${averageCPL?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

    let highestConversionChannelText = ``;
    let highestConversionRateChannelText = ``;

    const channelEntries = Object.entries(data || {});
    if (channelEntries.length === 0) {
      setSummaryText(summaryTextTemp);
      return;
    }

    const topConversionChannel = channelEntries.reduce((max, current) =>
      current[1].Conversions > max[1].Conversions ? current : max
    );

    const topConversionRateChannel = channelEntries.reduce((max, current) =>
      current[1].conRate > max[1].conRate ? current : max
    );

    if (channelEntries.length > 1) {
      highestConversionChannelText = `Best perform keywords: **${
        topConversionChannel[0]
      } with ${topConversionChannel[1].Conversions?.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} conversions**`;
      summaryTextTemp += `<li>${highestConversionChannelText}</li>`;
    }

    if (topConversionChannel[0] != topConversionRateChannel[0]) {
      highestConversionRateChannelText = `Potential keywords: **${
        topConversionRateChannel[0]
      } with ${topConversionRateChannel[1].conRate.toFixed(
        2
      )}% conversion rate**`;
      summaryTextTemp += `<li>${highestConversionRateChannelText}</li>`;
    }
    setSummaryText(summaryTextTemp);
  }, [totals, data]);

  useEffect(() => {
    summarizeData();
  }, [totals, data, summarizeData]);

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
    if (!totals || !comparison) {
      return {};
    }

    // console.log("🎯 overallTotals:", overallTotals);

    return metricDataProcess(totals, comparison);
  }, [totals, comparison]);

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

  console.log("data", data);
  console.log("displayTable", displayTable);

  return (
    <div
      id={id}
      data-exportable={true}
      data-export-title={title}
      className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4 relative group bg-white"
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
      <SlideHeader title={title} />
      <div className="grid grid-cols-16">
        <div
          className={`flex flex-col gap-2 ${
            extraContentType === "none" ? "col-span-16" : "col-span-12"
          }`}
        >
          <div className={`grid grid-cols-${metricData.length || 1} gap-2`}>
            <h4
              className={`col-span-${
                metricData.length - metricConvLength
              } text-lg font-semibold`}
            >
              Awareness & Considerations
            </h4>
            <h4
              className={`${
                metricConvLength > 0 && "col-span-" + metricConvLength
              } text-lg font-semibold ${metricConvLength === 0 && "hidden"}`}
            >
              Conversions
            </h4>

            {metricData.map((metric, index) => {
              return (
                <NumberDisplayBox
                  key={index}
                  title={metric.label}
                  value={formattedMetrics[metric.value]?.displayValue}
                  compareValue={formattedMetrics[metric.value]?.compareValue}
                  isNegative={formattedMetrics[metric.value]?.isNegative}
                  isConversion={metric.isConversion}
                  invertCompareColor={metric.invertCompare}
                />
              );
            })}
          </div>
          <div>
            <h4 className="text-lg font-semibold">Performance by Keywords</h4>
            <AdvancedDataTable
              firstMetric={dataGroupBy}
              channelData={data}
              totalData={totals}
              metrics={displayTable}
              formatValue={formatTableValue}
              maxRows={maxTableRows[0]}
              defaultSortBy="Conversions"
              defaultSortDirection="desc"
              enableSorting={true}
            />
          </div>
          {/* Summary */}
          {(summaryPosition === "bottom" || chartData.length === 0) && (
            <div className="p-4">
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
          )}
        </div>
        {extraContentType !== "none" && chartData.length > 0 && (
          <div className="col-span-4 flex flex-col">
            {chartData.map(
              (chart, index) =>
                chart.chartBy !== "None" && (
                  <DonutChart
                    key={index}
                    data={chart.percentageData}
                    title={chart.title}
                    width={200}
                    height={160}
                    innerRadius={30}
                    outerRadius={60}
                    isPercentage={true}
                  />
                )
            )}
            {/* {clicksByGender && Object.keys(clicksByGender).length > 0 && (
              <DonutChart
                data={clicksByGender}
                title="Conversions by Gender"
                width={200}
                height={160}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
            )}
            {clicksByDevice && Object.keys(clicksByDevice).length > 0 && (
              <DonutChart
                data={clicksByDevice}
                title="Conversions by Device"
                width={200}
                height={140}
                innerRadius={30}
                outerRadius={60}
                isPercentage={true}
              />
            )} */}

            {/* Summary */}
            {summaryPosition === "right" && (
              <div className="mt-4 p-4">
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
            )}
          </div>
        )}
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

export default GoogleSlideCustom;
