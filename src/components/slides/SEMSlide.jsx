import React, { useEffect, useState } from "react";
import SlideHeader from "./SlideHeader";
import PerformanceDataTable from "../charts-tables/PerformanceDataTable";
import NumberDisplayBox from "./NumberDisplayBox";
import TextEditorModal from "./TextEditorModal";
import { useData } from "@/contexts/dataContext";
import SEMDataTable from "../charts-tables/SEMDataTable";

function SEMSlide({ isOverallEditModalOpen, setIsOverallEditModalOpen }) {
  const {
    totalData,
    channelData,
    loading,
    error,
    metrics,
    refetch,
    SEMData,
    SEMTotals,
    SEMMetrics,
  } = useData();

  const [summaryText, setSummaryText] = useState("");

  const formatValue = (value, metric) => {
    if (metric === "ctr" || metric === "conRate") {
      return `${value.toFixed(2)}%`;
    }
    if (metric === "cpl") {
      return parseFloat(value.toFixed(2)).toLocaleString();
    }
    return value?.toLocaleString();
  };

  const convertToBMK = (value) => {
    if (!value || value === 0) return "0";
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixIndex = 0;
    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
      value /= 1000;
      suffixIndex++;
    }
    return `${value?.toFixed(1)}${suffixes[suffixIndex]}`;
  };

  const summarizeData = () => {
    let summaryTextTemp = "";
    const overallText = `Overall converions: **CPL ${parseFloat(
      SEMTotals?.cpl?.toFixed(2) || 0
    )?.toLocaleString()} THB with ${SEMTotals.Conversions || 0} conversions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    let highestConversionChannelText = ``;
    let highestConversionRateChannelText = ``;

    const channelEntries = Object.entries(SEMData);
    if (channelEntries.length === 0) return null;

    const topConversionChannel = channelEntries.reduce((max, current) =>
      current[1].Conversions > max[1].Conversions ? current : max
    );

    const topConversionRateChannel = channelEntries.reduce((max, current) =>
      current[1].conRate > max[1].conRate ? current : max
    );

    if (channelEntries.length > 1) {
      highestConversionChannelText = `Best perform keywords: **${
        topConversionChannel[0]
      } with ${topConversionChannel[1].Conversions} conversions (${(
        (topConversionChannel[1].Conversions / SEMTotals.Conversions) *
        100
      ).toFixed(2)}% of total conversions)**`;
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
    if (SEMTotals && Object.keys(SEMTotals).length > 0) {
      summarizeData();
    }
  }, [SEMTotals, SEMData]);

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
        '<span class="text-sm text-gray-600">$1</span>'
      );
  };

  return (
    <div
      id="overall-component"
      className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4"
    >
      <SlideHeader title={"SEM"} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Performance by Keywords</h4>
          {/* <PerformanceDataTable
            channelData={channelData}
            totalData={totalData}
            metrics={metrics}
            formatValue={formatValue}
          /> */}
          <SEMDataTable
            channelData={SEMData}
            totalData={SEMTotals}
            metrics={SEMMetrics}
            formatValue={formatValue}
          />
        </div>

        <div className="mt-4 border-1 rounded-xl shadow-lg p-4">
          <h4 className="text-lg font-semibold">Summary</h4>
          <ul className="list-disc pl-6">
            <div
              dangerouslySetInnerHTML={{
                __html: renderFormattedText(summaryText),
              }}
            />
          </ul>
        </div>
      </div>

      <TextEditorModal
        isOpen={isOverallEditModalOpen}
        onClose={() => setIsOverallEditModalOpen(false)}
        onSave={(newText) => setSummaryText(newText)}
        initialText={summaryText}
        revertText={summarizeData}
        title="Edit Summary Text"
        placeholder="Enter your summary text..."
      />
    </div>
  );
}

export default SEMSlide;
