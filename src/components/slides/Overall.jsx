import React, { useEffect, useState } from "react";
import SlideHeader from "./SlideHeader";
import PerformanceDataTable from "../charts-tables/PerformanceDataTable";
import NumberDisplayBox from "./NumberDisplayBox";
import TextEditorModal from "./TextEditorModal";
import { useData } from "@/contexts/dataContext";

function Overall({ isOverallEditModalOpen, setIsOverallEditModalOpen }) {
  const { totalData, channelData, loading, error, metrics, refetch } =
    useData();

  const [summaryOverallText, setSummaryOverallText] = useState("");
  const [highestConversionChannelText, setHighestConversionChannelText] =
    useState("");
  const [hasPotentialChannel, setHasPotentialChannel] = useState(false);
  const [potentialChannelText, setPotentialChannelText] = useState("");
  const [summaryText, setSummaryText] = useState("");

  const formatValue = (value, metric) => {
    if (metric === "ctr" || metric === "conRate") {
      return `${value.toFixed(2)}%`;
    }
    if (metric === "cpl") {
      return parseFloat(value.toFixed(2)).toLocaleString();
    }
    return value.toLocaleString();
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

  const getChannelStats = () => {
    const channelEntries = Object.entries(channelData);
    if (channelEntries.length === 0) return null;

    const topConversionChannel = channelEntries.reduce((max, current) =>
      current[1].Conversions > max[1].Conversions ? current : max
    );

    const topConversionRateChannel = channelEntries.reduce((max, current) =>
      current[1].conRate > max[1].conRate ? current : max
    );

    return {
      topConversionChannel,
      topConversionRateChannel,
      isTopConversionAlsoTopRate:
        topConversionChannel[0] === topConversionRateChannel[0],
    };
  };

  const summarizeData = () => {
    let summaryTextTemp = "";
    const overallText = `Overall: **CPL ${parseFloat(
      totalData?.cpl?.toFixed(2) || 0
    )?.toLocaleString()} THB with ${totalData.Conversions || 0} conversions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    let highestConversionChannelText = ``;
    let highestConversionRateChannelText = ``;

    setSummaryOverallText(overallText);

    const channelEntries = Object.entries(channelData);
    if (channelEntries.length === 0) return null;

    const topConversionChannel = channelEntries.reduce((max, current) =>
      current[1].Conversions > max[1].Conversions ? current : max
    );

    const topConversionRateChannel = channelEntries.reduce((max, current) =>
      current[1].conRate > max[1].conRate ? current : max
    );

    if (channelEntries.length > 1) {
      highestConversionChannelText = `Highest conversion channel: **${
        topConversionChannel[0]
      } with ${topConversionChannel[1].Conversions} conversions (${(
        (topConversionChannel[1].Conversions / totalData.Conversions) *
        100
      ).toFixed(2)}% of total conversions)**`;
      setHighestConversionChannelText(highestConversionChannelText);
      summaryTextTemp += `<li>${highestConversionChannelText}</li>`;
    }

    if (topConversionChannel[0] != topConversionRateChannel[0]) {
      highestConversionRateChannelText = `Highest conversion rate channel: **${
        topConversionRateChannel[0]
      } with ${topConversionRateChannel[1].conRate.toFixed(
        2
      )}% conversion rate**`;
      setHasPotentialChannel(true);
      setPotentialChannelText(highestConversionRateChannelText);
      summaryTextTemp += `<li>${highestConversionRateChannelText}</li>`;
    }
    setSummaryText(summaryTextTemp);
  };

  useEffect(() => {
    if (totalData && Object.keys(totalData).length > 0) {
      summarizeData();
    }
  }, [totalData, channelData]);

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

  const channelStats = getChannelStats();

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
      <SlideHeader title={"Overall"} />
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-8 gap-2">
          <h4 className="col-span-4 text-lg font-semibold">
            Awareness & Considerations
          </h4>
          <h4 className="col-span-4 text-lg font-semibold">Conversions</h4>
          <NumberDisplayBox
            title={"Impression"}
            value={convertToBMK(totalData.Impressions)}
          />
          <NumberDisplayBox
            title={"Reach"}
            value={convertToBMK(totalData.Reach)}
          />
          <NumberDisplayBox
            title={"Clicks"}
            value={convertToBMK(totalData.Clicks)}
          />
          <NumberDisplayBox
            title={"%CTR"}
            value={`${totalData.ctr?.toFixed(2)}%`}
          />
          <NumberDisplayBox
            title={"Conversions"}
            value={totalData.Conversions?.toLocaleString() || "0"}
            isConversion={true}
          />
          <NumberDisplayBox
            title={"%Con Rate"}
            value={`${totalData.conRate?.toFixed(2)}%`}
            isConversion={true}
          />
          <NumberDisplayBox
            title={"CPL"}
            value={convertToBMK(totalData.cpl)}
            isConversion={true}
          />
          <NumberDisplayBox
            title={"Spent"}
            value={convertToBMK(totalData.Spent)}
            isConversion={true}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Performance by Channel</h4>
          <PerformanceDataTable
            channelData={channelData}
            totalData={totalData}
            metrics={metrics}
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

export default Overall;
