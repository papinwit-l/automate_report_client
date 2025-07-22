import React, { useEffect, useState, useMemo } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./NumberDisplayBox";
import TextEditorModal from "./TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import DataTable from "../charts-tables/DataTable";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";

function SEMSlide() {
  const {
    loading,
    error,
    refetch,
    SEMData,
    SEMTotals,
    SEMMetrics,
    SEMComparison,
    GGDemographicData,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([12]);

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

  // Memoize the chart data calculations to prevent unnecessary re-renders
  const { clicksByGender, clicksByDevice } = useMemo(() => {
    if (!GGDemographicData || !Array.isArray(GGDemographicData)) {
      return { clicksByGender: {}, clicksByDevice: {} };
    }

    const SEMDemographicData = GGDemographicData.filter((item) => {
      return item.Channel.trim() === "SEM";
    });

    if (SEMDemographicData.length === 0) {
      return { clicksByGender: {}, clicksByDevice: {} };
    }

    const sumClicksByGender = SEMDemographicData.reduce((acc, item) => {
      if (item.Gender) {
        acc[item.Gender] = (acc[item.Gender] || 0) + item.Clicks;
      }
      return acc;
    }, {});

    const totalClicks = Object.values(sumClicksByGender).reduce(
      (a, b) => a + b,
      0
    );

    const genderPercentages =
      totalClicks > 0
        ? Object.entries(sumClicksByGender).reduce((acc, [gender, clicks]) => {
            acc[gender] = ((clicks / totalClicks) * 100).toFixed(2) + "%";
            return acc;
          }, {})
        : {};

    const sumClicksByDevice = SEMDemographicData.reduce((acc, item) => {
      if (item.Device) {
        acc[item.Device] = (acc[item.Device] || 0) + item.Clicks;
      }
      return acc;
    }, {});

    const devicePercentages =
      totalClicks > 0
        ? Object.entries(sumClicksByDevice).reduce((acc, [device, clicks]) => {
            acc[device] = ((clicks / totalClicks) * 100).toFixed(2) + "%";
            return acc;
          }, {})
        : {};

    return {
      clicksByGender: genderPercentages,
      clicksByDevice: devicePercentages,
    };
  }, [GGDemographicData]);

  const summarizeData = () => {
    let summaryTextTemp = "";
    const overallText = `Overall converions: ** ${parseFloat(
      SEMTotals?.Conversions?.toFixed(2) || 0
    )?.toLocaleString()} conversions**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    const averageCPL = SEMTotals?.cpl;

    summaryTextTemp += `<li>Average CPL: **${averageCPL?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

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
      highestConversionChannelText = `Best perform keywords: **${topConversionChannel[0]} with ${topConversionChannel[1].Conversions} conversions**`;
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
        '<span class="text-xs text-gray-600">$1</span>'
      );
  };

  return (
    <div
      id="sem-component"
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
      <SlideHeader title={"SEM"} />
      <div className="grid grid-cols-16">
        <div className="col-span-12 flex flex-col gap-2">
          <div className="grid grid-cols-8 gap-2">
            <h4 className="col-span-4 text-lg font-semibold">
              Awareness & Considerations
            </h4>
            <h4 className="col-span-4 text-lg font-semibold">Conversions</h4>
            <NumberDisplayBox
              title={"Impression"}
              value={convertToBMK(SEMTotals.Impressions)}
              compareValue={
                SEMComparison.Impressions &&
                `${SEMComparison.Impressions.toFixed(2)}%`
              }
              isNegative={SEMComparison?.Impressions < 0}
            />
            <NumberDisplayBox
              title={"Clicks"}
              value={convertToBMK(SEMTotals.Clicks)}
              compareValue={
                SEMComparison.Clicks && `${SEMComparison.Clicks.toFixed(2)}%`
              }
              isNegative={SEMComparison?.Clicks < 0}
            />
            <NumberDisplayBox
              title={"%CTR"}
              value={`${SEMTotals.ctr?.toFixed(2)}%`}
              compareValue={
                SEMComparison.ctr && `${SEMComparison.ctr.toFixed(2)}%`
              }
              isNegative={SEMComparison?.ctr < 0}
            />
            <NumberDisplayBox
              title={"CPC"}
              value={convertToBMK(SEMTotals.cpc)}
              compareValue={
                SEMComparison.cpc && `${SEMComparison.cpc.toFixed(2)}%`
              }
              isNegative={SEMComparison?.cpc < 0}
            />
            <NumberDisplayBox
              title={"Conversions"}
              value={SEMTotals.Conversions?.toLocaleString() || "0"}
              isConversion={true}
              compareValue={
                SEMComparison.Conversions &&
                `${SEMComparison.Conversions.toFixed(2)}%`
              }
              isNegative={SEMComparison?.Conversions < 0}
            />
            <NumberDisplayBox
              title={"%Con Rate"}
              value={`${SEMTotals.conRate?.toFixed(2)}%`}
              isConversion={true}
              compareValue={
                SEMComparison.conRate && `${SEMComparison.conRate.toFixed(2)}%`
              }
              isNegative={SEMComparison?.conRate < 0}
            />
            <NumberDisplayBox
              title={"CPL"}
              value={convertToBMK(SEMTotals.cpl)}
              isConversion={true}
              compareValue={
                SEMComparison.cpl && `${SEMComparison.cpl.toFixed(2)}%`
              }
              isNegative={SEMComparison?.cpl < 0}
            />
            <NumberDisplayBox
              title={"Spent"}
              value={convertToBMK(SEMTotals.Spent)}
              isConversion={true}
              compareValue={
                SEMComparison.Spent && `${SEMComparison.Spent.toFixed(2)}%`
              }
              isNegative={SEMComparison?.Spent < 0}
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Performance by Keywords</h4>
            <AdvancedDataTable
              firstMetric={"Keyword"}
              channelData={SEMData}
              totalData={SEMTotals}
              metrics={SEMMetrics}
              formatValue={formatValue}
              maxRows={maxTableRows[0]}
              defaultSortBy="Conversions"
            />
          </div>
        </div>
        <div className="col-span-4 flex flex-col">
          {clicksByGender && Object.keys(clicksByGender).length > 0 && (
            <DonutChart
              data={clicksByGender}
              title="Clicks by Gender"
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
              title="Clicks by Device"
              width={200}
              height={140}
              innerRadius={30}
              outerRadius={60}
              isPercentage={true}
            />
          )}
          {/* Summary */}
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

export default SEMSlide;
