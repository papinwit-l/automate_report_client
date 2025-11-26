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

// Helper function to normalize advancedFilterBy to array
const normalizeAdvancedFilterBy = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value !== "") return [value];
  return [];
};

// Helper function to safely format number
const safeFormatNumber = (value, options = {}) => {
  const num = parseFloat(value);
  if (isNaN(num) || value === null || value === undefined) {
    return "0";
  }
  return num.toLocaleString(undefined, options);
};

function SingleTableSlideCustom(props) {
  const {
    id,
    title,
    table = [],
    metricData = [],
    metricConvLength = 0,
    dataSource,
    dataGroupBy,
    dataChannel = "All",
    advancedFilter,
    advancedFilterBy,
    advancedGroupBy,
    summaryPosition = "bottom",
    extraContentType = "none",
    demographicChart = [],
    summaryContent = [],
    FBPicturePerformBy,
  } = props;

  // Normalize advancedFilterBy to always be an array
  const normalizedAdvancedFilterBy = useMemo(
    () => normalizeAdvancedFilterBy(advancedFilterBy),
    [advancedFilterBy]
  );

  const { getDataList, enableDateRange, dateRange, FacebookAdsPicture } =
    useData();
  const { loading, error, refetch } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([14]);

  const { data, totals, comparison, demographicData, displayTable } =
    useMemo(() => {
      const emptyResult = {
        data: {},
        totals: {},
        metrics: [],
        comparison: {},
        demographicData: [],
        displayTable: table,
      };

      if (!dataSource) return emptyResult;

      const dataList = getDataList();
      if (!dataList || dataList.length === 0) return emptyResult;

      const selectedData = dataList.find((data) => data.label === dataSource);

      if (!selectedData?.value) return emptyResult;

      const { data, totals, metrics, comparison, demographicData, rawData } =
        selectedData.value;

      if (!rawData || rawData.length === 0) return emptyResult;

      let disTable = table;

      if (dataGroupBy !== "default") {
        const allFields = Object.keys(rawData[0] || {});
        if (allFields.length === 0) return emptyResult;

        let cleanedData = cleanObjectData(rawData, metrics);

        if (dataChannel !== "All") {
          cleanedData = cleanedData.filter(
            (item) => item["Channel"] === dataChannel
          );
        }

        // grouping logic - using normalized array
        let groupBy = dataGroupBy;
        if (dataGroupBy === "") {
          if (normalizedAdvancedFilterBy.length > 0) {
            cleanedData = cleanedData.filter((item) =>
              normalizedAdvancedFilterBy.includes(item[advancedFilter])
            );
          }
          groupBy = advancedGroupBy;
        }

        // Check if we have data after filtering
        if (cleanedData.length === 0) {
          return {
            ...emptyResult,
            demographicData: demographicData || [],
          };
        }

        let currentPeriodData = cleanedData;
        let previousPeriodData = [];
        let comparisonResult = {};
        let currentPeriodResults;
        let previousPeriodResults;

        const platform = dataSource === "Youtube" ? "Youtube" : "default";

        // Case 1: Date range is enabled
        if (enableDateRange && dateRange?.from && dateRange?.to) {
          currentPeriodData = filterDataByDateRange(
            cleanedData,
            dateRange.from,
            dateRange.to
          );

          // Check if current period has data
          if (currentPeriodData.length === 0) {
            return {
              ...emptyResult,
              demographicData: demographicData || [],
            };
          }

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
          if (previousPeriodData.length > 0) {
            previousPeriodResults = processAdvertisingData(
              previousPeriodData,
              allFields,
              metrics,
              groupBy,
              platform
            );

            // Calculate comparison
            comparisonResult = calculateComparison(
              currentPeriodResults?.enhancedTotals || {},
              previousPeriodResults?.enhancedTotals || {}
            );
          }

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

            if (previousPeriodData.length > 0) {
              previousPeriodResults = processSocialMediaData(
                previousPeriodData,
                allFields,
                metrics,
                config
              );
              comparisonResult = calculateComparison(
                currentPeriodResults?.enhancedTotals || {},
                previousPeriodResults?.enhancedTotals || {}
              );
            }
          }
        }
        // Case 2: No date range - process all data
        else {
          currentPeriodResults = processAdvertisingData(
            currentPeriodData,
            allFields,
            metrics,
            groupBy,
            platform
          );

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
              currentPeriodData,
              allFields,
              metrics,
              config
            );
          }
        }

        // Check if processing returned valid results
        if (!currentPeriodResults) {
          return {
            ...emptyResult,
            demographicData: demographicData || [],
          };
        }

        return {
          data: currentPeriodResults.enhancedFieldData || {},
          totals: currentPeriodResults.enhancedTotals || {},
          metrics: metrics || [],
          comparison: comparisonResult || {},
          demographicData: demographicData || [],
          displayTable: disTable,
        };
      }

      return {
        data: data || {},
        totals: totals || {},
        metrics: metrics || [],
        comparison: comparison || {},
        demographicData: demographicData || [],
        displayTable: table,
      };
    }, [
      dataSource,
      getDataList,
      dataGroupBy,
      dataChannel,
      advancedFilter,
      normalizedAdvancedFilterBy,
      advancedGroupBy,
      enableDateRange,
      dateRange,
      table,
    ]);

  const { displayPicture } = useMemo(() => {
    const emptyPicture = { name: null, url: null };
    const DATA_GROUP_BY = "Ad name";

    if (!dataSource) return { displayPicture: emptyPicture };

    const dataList = getDataList();
    if (!dataList || dataList.length === 0)
      return { displayPicture: emptyPicture };

    const selectedData = dataList.find((data) => data.label === dataSource);

    if (!selectedData?.value) return { displayPicture: emptyPicture };

    const { rawData, metrics } = selectedData.value;

    if (!rawData || rawData.length === 0 || !metrics)
      return { displayPicture: emptyPicture };

    const allFields = Object.keys(rawData[0] || {});
    if (allFields.length === 0) return { displayPicture: emptyPicture };

    let cleanedData = cleanObjectData(rawData, metrics);

    if (dataChannel !== "All") {
      cleanedData = cleanedData.filter(
        (item) => item["Channel"] === dataChannel
      );
    }

    if (cleanedData.length === 0) return { displayPicture: emptyPicture };

    let currentPeriodData = cleanedData;
    let currentPeriodResults;

    const platform = dataSource === "Youtube" ? "Youtube" : "default";

    if (enableDateRange && dateRange?.from && dateRange?.to) {
      currentPeriodData = filterDataByDateRange(
        cleanedData,
        dateRange.from,
        dateRange.to
      );

      if (currentPeriodData.length === 0)
        return { displayPicture: emptyPicture };

      currentPeriodResults = processAdvertisingData(
        currentPeriodData,
        allFields,
        metrics,
        DATA_GROUP_BY,
        platform
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
      }
    } else {
      currentPeriodResults = processAdvertisingData(
        currentPeriodData,
        allFields,
        metrics,
        DATA_GROUP_BY,
        platform
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
      }
    }

    if (!currentPeriodResults) return { displayPicture: emptyPicture };

    const { enhancedFieldData } = currentPeriodResults;

    if (!FBPicturePerformBy) return { displayPicture: emptyPicture };

    const key = dataSource.trim().toLowerCase().includes("facebook")
      ? tableUtilsMapping(FBPicturePerformBy)
      : FBPicturePerformBy;

    const dataEntries = Object.entries(enhancedFieldData || {});
    if (dataEntries.length === 0) return { displayPicture: emptyPicture };

    // Filter out entries with invalid values for the key
    const validEntries = dataEntries.filter(([_, value]) => {
      const keyValue = value?.[key];
      return keyValue !== undefined && keyValue !== null && !isNaN(keyValue);
    });

    if (validEntries.length === 0) return { displayPicture: emptyPicture };

    const topKeyData = validEntries.reduce((max, current) => {
      const currentValue = current[1]?.[key] || 0;
      const maxValue = max[1]?.[key] || 0;
      return currentValue > maxValue ? current : max;
    });

    const topKey = topKeyData[0];
    const topKeyValue = topKeyData[1]?.[key];

    if (!topKeyValue || topKeyValue === undefined || isNaN(topKeyValue)) {
      return { displayPicture: emptyPicture };
    }

    if (!FacebookAdsPicture || !Array.isArray(FacebookAdsPicture)) {
      return { displayPicture: emptyPicture };
    }

    const topKeyItem = FacebookAdsPicture.find(
      (item) => item?.["Ad name"] === topKey
    );

    if (!topKeyItem?.Ads) return { displayPicture: emptyPicture };

    return { displayPicture: { name: topKey, url: topKeyItem.Ads } };
  }, [
    FBPicturePerformBy,
    dataSource,
    FacebookAdsPicture,
    dataChannel,
    enableDateRange,
    dateRange?.from,
    dateRange?.to,
    getDataList,
  ]);

  const chartDataProcess = (demoData, chartTemplate, source) => {
    if (!demoData || !Array.isArray(demoData) || demoData.length === 0) {
      return [];
    }

    if (!chartTemplate || !Array.isArray(chartTemplate)) {
      return [];
    }

    const channelFiltered = demoData.filter((item) => {
      if (!item) return false;
      if (source === "All") return true;
      const itemChannel = item.Channel;
      if (!itemChannel) return false;
      return itemChannel.trim().toLowerCase() === source.trim().toLowerCase();
    });

    if (channelFiltered.length === 0) return [];

    const chartData = chartTemplate
      .filter((chart) => chart && chart.chartBy && chart.chartBy !== "None")
      .map((chart) => {
        const { chartBy, title, dataBy } = chart;

        if (!chartBy || !dataBy) {
          return null;
        }

        const data = channelFiltered.reduce((acc, item) => {
          if (!item) return acc;

          const key = item[chartBy];
          const value = parseFloat(item[dataBy]);

          if (key === undefined || key === null || isNaN(value)) return acc;

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

        return {
          title: title || "",
          data,
          percentageData,
          chartBy,
        };
      })
      .filter(Boolean); // Remove null entries

    return chartData;
  };

  const { chartData } = useMemo(() => {
    if (
      !demographicData ||
      !Array.isArray(demographicData) ||
      demographicData.length === 0
    ) {
      return { chartData: [] };
    }

    if (
      !demographicChart ||
      !Array.isArray(demographicChart) ||
      demographicChart.length === 0
    ) {
      return { chartData: [] };
    }

    const chartsData = chartDataProcess(
      demographicData,
      demographicChart,
      dataChannel
    );

    return { chartData: chartsData };
  }, [demographicData, demographicChart, dataChannel]);

  const { summaryData } = useMemo(() => {
    const groupBy = !dataGroupBy ? advancedGroupBy : dataGroupBy;

    if (!summaryContent || !Array.isArray(summaryContent) || !groupBy) {
      return { summaryData: [] };
    }

    if (!totals || Object.keys(totals).length === 0) {
      return { summaryData: [] };
    }

    const summaryData = summaryContent.reduce((acc, item) => {
      if (!item) return acc;

      const contentType = item.contentType;
      const dataBy = item.dataBy;

      if (!contentType || !dataBy) return acc;

      const key =
        totals[dataBy] !== undefined ? dataBy : tableUtilsMapping(dataBy);

      if (contentType === "overall") {
        const value = totals[key];
        if (value !== undefined && value !== null && !isNaN(value)) {
          const overallText = `Overall ${formatMetricName(
            key
          )}: ** ${safeFormatNumber(value, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })} ${formatMetricName(key)} **`;
          acc.push(overallText);
        }
      }

      if (contentType === "average-cpx") {
        const value = totals[key];
        if (value !== undefined && value !== null && !isNaN(value)) {
          const averageCPXText = `Average ${key.toUpperCase()}: ** ${safeFormatNumber(
            value,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )} THB **`;
          acc.push(averageCPXText);
        }
      }

      // Handle best-perform and best-potential
      if (contentType === "best-perform" || contentType === "best-potential") {
        const dataEntries = Object.entries(data || {});

        if (dataEntries.length === 0) return acc;

        // Filter valid entries
        const validEntries = dataEntries.filter(([_, value]) => {
          const keyValue = value?.[key];
          return (
            keyValue !== undefined && keyValue !== null && !isNaN(keyValue)
          );
        });

        if (validEntries.length === 0) return acc;

        const topKeyData = validEntries.reduce((max, current) => {
          const currentValue = current[1]?.[key] || 0;
          const maxValue = max[1]?.[key] || 0;
          return currentValue > maxValue ? current : max;
        });

        const topKey = topKeyData[0];
        const topKeyValue = topKeyData[1]?.[key];

        if (topKeyValue !== undefined && !isNaN(topKeyValue)) {
          const label =
            contentType === "best-perform" ? "Best perform" : "Potential";
          const topKeyText = `${label} ${groupBy.toLowerCase()}: **${topKey} (with ${safeFormatNumber(
            topKeyValue,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )} ${formatMetricName(key)})**`;
          acc.push(topKeyText);
        }
      }

      return acc;
    }, []);

    return { summaryData };
  }, [summaryContent, dataGroupBy, data, totals, advancedGroupBy]);

  const summarizeData = useCallback(() => {
    if (
      !summaryData ||
      summaryData.length === 0 ||
      !data ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" && Object.keys(data).length === 0) ||
      !totals ||
      (typeof totals === "object" && Object.keys(totals).length === 0)
    ) {
      setSummaryText("<li>No data available for the selected period</li>");
      return;
    }
    setSummaryText(
      summaryData.reduce((acc, item) => {
        return acc + `<li>${item}</li>`;
      }, "")
    );
  }, [summaryData, data, totals]);

  useEffect(() => {
    summarizeData();
  }, [summaryData, summarizeData]);

  const renderFormattedText = (text) => {
    if (!text || typeof text !== "string") return "";

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
    if (!totals || Object.keys(totals).length === 0) {
      return {};
    }

    return metricDataProcess(totals, comparison || {});
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
      <SlideHeader title={title || "Untitled Slide"} />
      <div className="grid grid-cols-16">
        <div
          className={`flex flex-col gap-2 ${
            extraContentType === "none" ? "col-span-16" : "col-span-12"
          }`}
        >
          <div className={`grid grid-cols-${metricData?.length || 1} gap-2`}>
            <h4
              className={`col-span-${
                (metricData?.length || 0) - (metricConvLength || 0)
              } text-lg font-semibold`}
            >
              Awareness & Considerations
            </h4>
            <h4
              className={`${
                metricConvLength > 0 && "col-span-" + metricConvLength
              } text-lg font-semibold ${
                !metricConvLength || metricConvLength === 0 ? "hidden" : ""
              }`}
            >
              Conversions
            </h4>

            {metricData?.map((metric, index) => {
              if (!metric) return null;
              return (
                <NumberDisplayBox
                  key={index}
                  title={metric.label || ""}
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
              firstMetric={dataGroupBy || advancedGroupBy || ""}
              channelData={data || {}}
              totalData={totals || {}}
              metrics={displayTable || []}
              formatValue={formatTableValue}
              maxRows={maxTableRows[0]}
              defaultSortBy="Conversions"
              defaultSortDirection="desc"
              enableSorting={true}
            />
          </div>
          {/* Summary */}
          {(summaryPosition === "bottom" ||
            !chartData ||
            chartData.length === 0) && (
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
        {extraContentType !== "none" && chartData && chartData.length > 0 && (
          <div className="col-span-4 flex flex-col">
            {extraContentType === "demographic" &&
              chartData.map(
                (chart, index) =>
                  chart?.chartBy !== "None" && (
                    <DonutChart
                      key={index}
                      data={chart?.percentageData || {}}
                      title={chart?.title || ""}
                      width={200}
                      height={160}
                      innerRadius={30}
                      outerRadius={60}
                      isPercentage={true}
                    />
                  )
              )}
            {extraContentType === "picture" && displayPicture?.url && (
              <div className="flex flex-col gap-2 pl-4">
                <ImageFallback
                  src={displayPicture.url}
                  alt={displayPicture.name || "Ad Image"}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="text-md font-semibold text-center">
                    {displayPicture.name || ""}
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
