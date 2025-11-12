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
import {
  formatMetricName,
  tableUtilsMapping,
} from "@/utils/templateDataProcessors";
import TextEditorModalCustom from "../template-manager/TextEditorModalCustom";
import ImageFallback from "../slides/utils/ImageFallback";

function SingleTableSlideCustom(props) {
  const {
    id,
    title,
    table,
    metricData,
    metricConvLength,
    dataSource,
    dataGroupBy,
    dataChannel,
    advancedFilter,
    advancedFilterBy,
    advancedGroupBy,
    summaryPosition,
    extraContentType,
    demographicChart,
    summaryContent,
    FBPicturePerformBy,
  } = props;

  const { getDataList, enableDateRange, dateRange, FacebookAdsPicture } =
    useData();
  const { loading, error, refetch } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([14]);

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

        // grouping logic
        let groupBy = dataGroupBy;
        if (dataGroupBy === "") {
          cleanedData = cleanedData.filter(
            (item) => item[advancedFilter] === advancedFilterBy
          );
          groupBy = advancedGroupBy;
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
            groupBy,
            platform
          );

          // Process previous period
          previousPeriodResults = processAdvertisingData(
            previousPeriodData,
            allFields,
            metrics,
            groupBy,
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
              audienceGroupBy: groupBy,
              creativeGroupBy: groupBy,
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
            groupBy,
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
              audienceGroupBy: groupBy,
              creativeGroupBy: groupBy,
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

        // console.log("🎯 currentPeriodResults:", currentPeriodResults);

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
      advancedFilter,
      advancedFilterBy,
      advancedGroupBy,
      enableDateRange,
      dateRange,
      table,
    ]);

  const { displayPicture } = useMemo(() => {
    const DATA_GROUP_BY = "Ad name";

    const dataList = getDataList();
    const selectedData = dataList.find((data) => data.label === dataSource);

    if (!selectedData) return { displayPicture: { name: null, url: null } };

    const { rawData, metrics } = selectedData.value;

    if (!rawData) return { displayPicture: { name: null, url: null } };

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
        DATA_GROUP_BY,
        platform
      );

      // Process previous period
      previousPeriodResults = processAdvertisingData(
        previousPeriodData,
        allFields,
        metrics,
        DATA_GROUP_BY,
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
          audienceGroupBy: DATA_GROUP_BY,
          creativeGroupBy: DATA_GROUP_BY,
          fields: dataSource.trim().toLowerCase().includes("facebook")
            ? FACEBOOK_FIELDS
            : TIKTOK_FIELDS,
          calculatedFields: dataSource.trim().toLowerCase().includes("facebook")
            ? FACEBOOK_CALCULATED_FIELDS
            : TIKTOK_CALCULATED_FIELDS,
        };

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
        DATA_GROUP_BY,
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
          audienceGroupBy: DATA_GROUP_BY,
          creativeGroupBy: DATA_GROUP_BY,
          fields: dataSource.trim().toLowerCase().includes("facebook")
            ? FACEBOOK_FIELDS
            : TIKTOK_FIELDS,
          calculatedFields: dataSource.trim().toLowerCase().includes("facebook")
            ? FACEBOOK_CALCULATED_FIELDS
            : TIKTOK_CALCULATED_FIELDS,
        };

        currentPeriodResults = processSocialMediaData(
          currentPeriodData, // This is cleanedData
          allFields,
          metrics,
          config
        );
      }
    }

    const { enhancedFieldData } = currentPeriodResults;

    // find picture part

    if (!FBPicturePerformBy)
      return { displayPicture: { name: null, url: null } };

    const key = dataSource.trim().toLowerCase().includes("facebook")
      ? tableUtilsMapping(FBPicturePerformBy)
      : FBPicturePerformBy;

    const dataEntries = Object.entries(enhancedFieldData || {});
    if (dataEntries.length === 0) {
      return { displayPicture: { name: null, url: null } };
    }

    const topKeyData = dataEntries.reduce((max, current) =>
      current[1][key] > max[1][key] ? current : max
    );

    const topKey = topKeyData[0];
    const topKeyValue = topKeyData[1][key];
    if (!topKeyValue || topKeyValue === undefined || isNaN(topKeyValue)) {
      return { displayPicture: { name: null, url: null } };
    }

    const topKeyItem = FacebookAdsPicture.find(
      (item) => item["Ad name"] === topKey
    );

    if (!topKeyItem) {
      return { displayPicture: { name: null, url: null } };
    }

    return { displayPicture: { name: topKey, url: topKeyItem.Ads } };
  }, [
    FBPicturePerformBy,
    dataSource,
    FacebookAdsPicture,
    dataChannel,
    enableDateRange,
    dateRange.from,
    dateRange.to,
    getDataList,
  ]);

  // console.log("data--", rawData);

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
    // console.log("demographicData", demographicData);
    if (!demographicData || !Array.isArray(demographicData)) {
      return { chartData: [] };
    }

    const chartsData = chartDataProcess(
      demographicData,
      demographicChart,
      dataChannel
    );

    // console.log("🎯 chartsData:", chartsData);
    return { chartData: chartsData };
  }, [demographicData, demographicChart, dataChannel]);

  // console.log("displayTable", displayTable);

  const { summaryData } = useMemo(() => {
    const groupBy = !dataGroupBy ? advancedGroupBy : dataGroupBy;
    if (!summaryContent || !groupBy) {
      return {
        summaryData: [],
      };
    }

    const summaryData = summaryContent.reduce((acc, item) => {
      const contentType = item.contentType;
      const dataBy = item.dataBy;

      if (!contentType || !dataBy) return acc;

      const key = totals[dataBy] ? dataBy : tableUtilsMapping(dataBy);
      // console.log("🎯 key:", key);

      if (contentType === "overall") {
        const overallText = `Overall ${key.toLowerCase()}: ** ${parseFloat(
          totals[key]?.toFixed(2) || 0
        )?.toLocaleString()} ${formatMetricName(key)} **`;
        acc.push(overallText);
      }

      if (contentType === "average-cpx") {
        const averageCPXText = `Average ${key.toUpperCase()}: ** ${parseFloat(
          totals[key]
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} THB **`;
        acc.push(averageCPXText);
      }

      const dataEntries = Object.entries(data || {});

      // console.log("🎯 dataEntries:", dataEntries);

      if (dataEntries.length === 0) {
        return acc;
      }

      const topKeyData = dataEntries.reduce((max, current) =>
        current[1][key] > max[1][key] ? current : max
      );

      // console.log("🎯 topKeyData:", topKeyData);

      const topKey = topKeyData[0];
      if (contentType === "best-perform") {
        const topKeyText = `Best perform ${groupBy.toLowerCase()}: **${topKey} (with ${topKeyData[1][
          key
        ]?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${formatMetricName(key)})**`;
        acc.push(topKeyText);
      }

      if (contentType === "best-potential") {
        // console.log("topKeyData", topKeyData[1][key]);
        const topKeyText = `Potential ${groupBy.toLowerCase()}: **${topKey} (with ${topKeyData[1][
          key
        ]?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${formatMetricName(key)})**`;
        acc.push(topKeyText);
      }

      return acc;
    }, []);

    return { summaryData };
  }, [summaryContent, dataGroupBy, data, totals, advancedGroupBy]);

  // console.log("🎯 summaryData:", summaryData);

  const summarizeData = useCallback(() => {
    if (!summaryData || summaryData.length === 0) {
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }
    setSummaryText(
      summaryData.reduce((acc, item) => {
        return acc + `<li>${item}</li>`;
      }, "")
    );
  }, [summaryData]);

  useEffect(() => {
    summarizeData();
  }, [summaryData, summarizeData]);

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
    // console.log("🎯 totals:", totals);
    // console.log("🎯 comparison:", comparison);

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

  // console.log("data", data);
  // console.log("displayTable", displayTable);

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
            <h4 className="text-lg font-semibold">
              Performance by {dataGroupBy || advancedGroupBy || "Keywords"}
            </h4>
            <AdvancedDataTable
              firstMetric={dataGroupBy || advancedGroupBy}
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
            {extraContentType === "demographic" &&
              chartData.map(
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
            {extraContentType === "picture" && displayPicture.url && (
              <div className="flex flex-col gap-2 pl-4">
                <ImageFallback
                  src={displayPicture.url}
                  alt={displayPicture.name}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="text-md font-semibold text-center">
                    {displayPicture.name}
                  </h4>
                </div>
              </div>
            )}
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

      <TextEditorModalCustom
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

export default SingleTableSlideCustom;
