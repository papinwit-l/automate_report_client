import React, { useEffect, useState, useMemo } from "react";
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
import { metricDataProcess } from "@/utils/dataUtils";

function GoogleSlideCustom(props) {
  const {
    id,
    title,
    table,
    metricData,
    metricConvLength,
    dataSource,
    summaryPosition,
    extraContentType,
  } = props;

  const { getDataList } = useData();

  const { data, totals, comparison, demographicData } = useMemo(() => {
    if (!dataSource)
      return {
        data: {},
        totals: {},
        metrics: [],
        comparison: {},
        demographicData: {},
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
      };

    const { data, totals, metrics, comparison, demographicData } =
      selectedData.value;
    return { data, totals, metrics, comparison, demographicData };
  }, [dataSource, getDataList]);

  const { loading, error, refetch } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([14]);

  const [isCPA, setIsCPA] = useState(false);

  // Memoize the chart data calculations to prevent unnecessary re-renders
  const { clicksByGender, clicksByDevice } = useMemo(() => {
    if (!demographicData || !Array.isArray(demographicData)) {
      return { clicksByGender: {}, clicksByDevice: {} };
    }

    const SEMDemographicData = demographicData.filter((item) => {
      return item.Channel.trim() === "SEM";
    });

    if (SEMDemographicData.length === 0) {
      return { clicksByGender: {}, clicksByDevice: {} };
    }

    const sumClicksByGender = SEMDemographicData.reduce((acc, item) => {
      if (item.Gender) {
        acc[item.Gender] = (acc[item.Gender] || 0) + item.Conversions;
      }
      return acc;
    }, {});

    const totalClicks = Object.values(sumClicksByGender).reduce(
      (a, b) => a + b,
      0
    );

    if (totalClicks === 0) {
      return { clicksByGender: {}, clicksByDevice: {} };
    }

    const genderPercentages = Object.entries(sumClicksByGender).reduce(
      (acc, [gender, clicks]) => {
        acc[gender] = ((clicks / totalClicks) * 100).toFixed(2) + "%";
        return acc;
      },
      {}
    );

    const sumClicksByDevice = SEMDemographicData.reduce((acc, item) => {
      if (item.Device) {
        acc[item.Device] = (acc[item.Device] || 0) + item.Conversions;
      }
      return acc;
    }, {});

    const devicePercentages = Object.entries(sumClicksByDevice).reduce(
      (acc, [device, clicks]) => {
        acc[device] = ((clicks / totalClicks) * 100).toFixed(2) + "%";
        return acc;
      },
      {}
    );

    return {
      clicksByGender: genderPercentages,
      clicksByDevice: devicePercentages,
    };
  }, [demographicData]);

  const summarizeData = () => {
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
  };

  useEffect(() => {
    summarizeData();
  }, [totals, data]);

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

  console.log("🎯 data:", data);
  // console.log("🎯 totals:", totals);
  // console.log("🎯 comparison:", comparison);
  console.log("🎯 demographicData:", demographicData);

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
              firstMetric={"Keyword"}
              channelData={data}
              totalData={totals}
              metrics={table}
              formatValue={formatTableValue}
              maxRows={maxTableRows[0]}
              defaultSortBy="Conversions"
              defaultSortDirection="desc"
              enableSorting={true}
            />
          </div>
          {/* Summary */}
          {summaryPosition === "bottom" && (
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
        {extraContentType !== "none" && (
          <div className="col-span-4 flex flex-col">
            {clicksByGender && Object.keys(clicksByGender).length > 0 && (
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
