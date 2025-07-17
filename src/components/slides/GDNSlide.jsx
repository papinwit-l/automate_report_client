import React, { useEffect, useState } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./NumberDisplayBox";
import TextEditorModal from "./TextEditorModal";
import { useData } from "@/contexts/dataContext";
import SEMDataTable from "../charts-tables/SEMDataTable";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import DataTable from "../charts-tables/DataTable";

function GDNSlide() {
  const {
    loading,
    error,
    refetch,
    SEMData,
    SEMTotals,
    SEMMetrics,
    SEMComparison,
    GGDemographicData,
    GDNData,
    GDNTotals,
    GDNMetrics,
    GDNComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [clicksByGender, setClicksByGender] = useState({});
  const [clicksByDevice, setClicksByDevice] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState(0);

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
    console.log("GDNTotals:", GDNTotals);
    const overallText = `Overall clicks: ** ${parseFloat(
      GDNTotals?.Clicks?.toFixed(2) || 0
    )?.toLocaleString()} ckicks**`;
    summaryTextTemp = `<li>${overallText}</li>`;

    const averageCPC = GDNTotals?.cpc;

    summaryTextTemp += `<li>Average CPC: **${averageCPC?.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} THB**</li>`;

    let highestConversionChannelText = ``;
    let highestConversionRateChannelText = ``;

    const channelEntries = Object.entries(GDNData);
    if (channelEntries.length === 0) return null;

    const topConversionChannel = channelEntries.reduce((max, current) =>
      current[1].Clicks > max[1].Clicks ? current : max
    );

    const topConversionRateChannel = channelEntries.reduce((max, current) =>
      current[1].ctr > max[1].ctr ? current : max
    );

    if (channelEntries.length > 1) {
      highestConversionChannelText = `Best perform Ad: **${
        topConversionChannel[0]
      } with ${topConversionChannel[1].Clicks?.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} clicks**`;
      summaryTextTemp += `<li>${highestConversionChannelText}</li>`;
    }

    if (topConversionChannel[0] != topConversionRateChannel[0]) {
      highestConversionRateChannelText = `Potential Ad: **${
        topConversionRateChannel[0]
      } with ${topConversionRateChannel[1].ctr.toFixed(2)} %CTR**`;
      summaryTextTemp += `<li>${highestConversionRateChannelText}</li>`;
    }
    setSummaryText(summaryTextTemp);
  };

  const prepareChartData = () => {
    const GDNDemographicData = GGDemographicData.filter((item) => {
      return item.Channel.trim() === "GDN";
    });
    const sumClicksByGender = GDNDemographicData.reduce((acc, item) => {
      if (item.Gender) {
        acc[item.Gender] = (acc[item.Gender] || 0) + item.Clicks;
      }
      return acc;
    }, {});
    const totalClicks = Object.values(sumClicksByGender).reduce(
      (a, b) => a + b,
      0
    );
    const genderPercentages = Object.entries(sumClicksByGender).reduce(
      (acc, [gender, clicks]) => {
        acc[gender] = ((clicks / totalClicks) * 100).toFixed(2) + "%";
        return acc;
      },
      {}
    );
    console.log(genderPercentages);
    setClicksByGender(genderPercentages);
    const sumClicksByDevice = GDNDemographicData.reduce((acc, item) => {
      if (item.Device) {
        acc[item.Device] = (acc[item.Device] || 0) + item.Clicks;
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
    console.log(devicePercentages);
    setClicksByDevice(devicePercentages);
  };

  useEffect(() => {
    console.log("GDNTotals:", GDNTotals);
    if (GDNTotals && Object.keys(GDNTotals).length > 0) {
      summarizeData();
    }
    if (GGDemographicData && Object.keys(GGDemographicData).length > 0) {
      prepareChartData();
    }
  }, [GDNTotals, GDNData, GGDemographicData]);

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
      className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-2 relative group"
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
      <SlideHeader title={"GDN"} />
      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-16">
          <div className="col-span-12 flex flex-col gap-2">
            <div className="grid grid-cols-7 gap-2">
              <h4 className="col-span-3 text-lg font-semibold">
                Awareness & Considerations
              </h4>
              <h4 className="col-span-4 text-lg font-semibold">Conversions</h4>
              <NumberDisplayBox
                title={"Impression"}
                value={convertToBMK(GDNTotals.Impressions)}
                compareValue={
                  GDNComparison.Impressions &&
                  `${GDNComparison.Impressions.toFixed(2)}%`
                }
                isNegative={GDNComparison?.Impressions < 0}
              />
              <NumberDisplayBox
                title={"Clicks"}
                value={convertToBMK(GDNTotals.Clicks)}
                compareValue={
                  GDNComparison.Clicks && `${GDNComparison.Clicks.toFixed(2)}%`
                }
                isNegative={GDNComparison?.Clicks < 0}
              />
              <NumberDisplayBox
                title={"%CTR"}
                value={`${GDNTotals.ctr?.toFixed(2)}%`}
                compareValue={
                  GDNComparison.ctr && `${GDNComparison.ctr.toFixed(2)}%`
                }
                isNegative={GDNComparison?.ctr < 0}
              />
              <NumberDisplayBox
                title={"CPC"}
                value={convertToBMK(GDNTotals.cpc)}
                compareValue={
                  GDNComparison.cpc && `${GDNComparison.cpc.toFixed(2)}%`
                }
                isNegative={GDNComparison?.cpc < 0}
                isConversion={true}
              />
              <NumberDisplayBox
                title={"Conversions"}
                value={GDNTotals.Conversions?.toLocaleString() || "0"}
                isConversion={true}
                compareValue={
                  GDNComparison.Conversions &&
                  `${GDNComparison.Conversions.toFixed(2)}%`
                }
                isNegative={GDNComparison?.Conversions < 0}
              />
              <NumberDisplayBox
                title={"CPL"}
                value={convertToBMK(GDNTotals.cpl)}
                isConversion={true}
                compareValue={
                  GDNComparison.cpl && `${GDNComparison.cpl.toFixed(2)}%`
                }
                isNegative={GDNComparison?.cpl < 0}
              />
              <NumberDisplayBox
                title={"Spent"}
                value={convertToBMK(GDNTotals.Spent)}
                isConversion={true}
                compareValue={
                  GDNComparison.Spent && `${GDNComparison.Spent.toFixed(2)}%`
                }
                isNegative={GDNComparison?.Spent < 0}
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                Performance by Ad Group Name
              </h4>
              <DataTable
                firstMetric={"Ad group name"}
                channelData={GDNData}
                totalData={GDNTotals}
                metrics={GDNMetrics}
                formatValue={formatValue}
                maxRows={maxTableRows}
              />
            </div>
          </div>
          <div className="col-span-4 flex flex-col">
            {/* AD Preview Picture */}
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="col-span-1 flex flex-col">
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
          <div className="col-span-2 flex">
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

export default GDNSlide;
