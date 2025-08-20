import React, { useEffect, useMemo, useState } from "react";
import SlideHeader from "./SlideHeader";
import NumberDisplayBox from "./utils/NumberDisplayBox";
import TextEditorModal from "./utils/TextEditorModal";
import { useData } from "@/contexts/dataContext";
import DonutChart from "../charts-tables/DonutChart";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

// Import utility functions
import {
  formatDisplayData,
  formatTableValue,
  formatMetricsData,
  METRIC_CONFIGS,
} from "@/utils/dataDisplayUtils";
import { AdvancedDataTable } from "../charts-tables/AdvancedDataTable";
import HorizontalStackedBar from "../charts-tables/HorizontalStackedBar";
import HorizontalBrandChart from "../charts-tables/HorizontalBrandChart";

// Color palette for channels
const CHANNEL_COLORS = {
  Facebook: "#1877F2",
  Google: "#4285F4",
  YouTube: "#FF0000",
  Line: "#00C300",
  Other: "#9CA3AF",
};

function OverallGraph() {
  const {
    loading,
    error,
    refetch,
    GGDemographicData,
    overallData,
    overallTotals,
    overallMetrics,
    overallComparison,
  } = useData();

  const [summaryText, setSummaryText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [maxTableRows, setMaxTableRows] = useState([0]);

  // Memoized graphData calculation
  const graphData = useMemo(() => {
    // Early return if no data
    if (!overallData || Object.keys(overallData).length === 0) {
      return [];
    }

    console.log("Calculating graphData with overallData:", overallData);

    // Fix the property name mapping - use capital letters to match your data structure
    const data = Object.entries(overallData).map(([key, value]) => ({
      name: key,
      reach: value.Reach || 0, // Capital R
      impressions: value.Impressions || 0, // Capital I
      engagements: value.engagements || 0, // This might not exist in your data
      clicks: value.Clicks || 0, // Capital C
      spent: value.Spent || 0, // Capital S
      cpr: value.cpr || 0, // lowercase (matches your data)
      conversions: value.Conversions || 0, // Capital C
      cpl: value.cpl || 0, // lowercase (matches your data)
      conRate: value.conRate || 0, // camelCase (matches your data)
    }));

    console.log("Processed data:", data);

    // Summarize data by channel
    const channelMap = {};

    data.forEach((item) => {
      // Determine channel
      let channel;
      if (item.name.includes("FB")) {
        channel = "Facebook";
      } else if (
        item.name.includes("SEM") ||
        item.name.includes("GDN") ||
        item.name.includes("Discovery")
      ) {
        channel = "Google";
      } else if (item.name.includes("YouTube")) {
        channel = "YouTube";
      } else if (item.name.includes("Line")) {
        channel = "Line";
      } else {
        channel = "Other";
      }

      // Initialize or update channel data
      if (!channelMap[channel]) {
        channelMap[channel] = {
          name: channel,
          reach: 0,
          impressions: 0,
          engagements: 0,
          clicks: 0,
          spent: 0,
          cpr: 0,
          conversions: 0,
          cpl: 0,
          conRate: 0,
        };
      }

      // Add all metrics
      channelMap[channel].reach += item.reach;
      channelMap[channel].impressions += item.impressions;
      channelMap[channel].engagements += item.engagements;
      channelMap[channel].clicks += item.clicks;
      channelMap[channel].spent += item.spent;
      channelMap[channel].cpr += item.cpr;
      channelMap[channel].conversions += item.conversions;
      channelMap[channel].cpl += item.cpl;
      channelMap[channel].conRate += item.conRate;
    });

    const channelData = Object.values(channelMap);
    console.log("Final channel data:", channelData);

    return channelData;
  }, [overallData]); // Only recalculate when overallData changes

  // Transform data for HorizontalStackedBar - focusing on impressions as the main metric
  const barChartData = useMemo(() => {
    return graphData.map((channel) => ({
      name: channel.name,
      value: channel.impressions, // Use impressions as the main value
      color: CHANNEL_COLORS[channel.name] || CHANNEL_COLORS.Other,
      // Include other metrics for tooltip or additional info
      clicks: channel.clicks,
      conversions: channel.conversions,
      spent: channel.spent,
      reach: channel.reach,
    }));
  }, [graphData]);

  // Optional: Separate useMemo for debugging/logging (remove in production)
  useEffect(() => {
    console.log("graphData updated:", graphData);
    console.log("barChartData updated:", barChartData);
  }, [graphData, barChartData]);

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

  // Format display data with safe fallbacks
  const impressionData = formatDisplayData(
    overallTotals?.Impressions,
    overallComparison?.Impressions,
    "compact"
  );
  const clicksData = formatDisplayData(
    overallTotals?.Clicks,
    overallComparison?.Clicks,
    "compact"
  );
  const ctrData = formatDisplayData(
    overallTotals?.ctr,
    overallComparison?.ctr,
    "percentage"
  );
  const reachData = formatDisplayData(
    overallTotals?.Reach,
    overallComparison?.Reach,
    "compact"
  );
  const conversionsData = formatDisplayData(
    overallTotals?.Conversions,
    overallComparison?.Conversions,
    "number"
  );
  const conRateData = formatDisplayData(
    overallTotals?.conRate,
    overallComparison?.conRate,
    "percentage"
  );
  const cplData = formatDisplayData(
    overallTotals?.cpl,
    overallComparison?.cpl,
    "compact"
  );
  const spentData = formatDisplayData(
    overallTotals?.Spent,
    overallComparison?.Spent,
    "compact"
  );

  return (
    <div
      id="overall-graph-component"
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
      <SlideHeader title={"Overall Graph"} />
      <div className="flex flex-col justify-between h-full">
        <div className="grid grid-cols-16">
          <div className="col-span-16 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <HorizontalStackedBar data={barChartData} title="Impressions" />
              <HorizontalBrandChart
                data={graphData}
                title="Performance by Channel"
              />
            </div>
          </div>
        </div>
      </div>
      <TextEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(newText) => setSummaryText(newText)}
        initialText={summaryText}
        revertText={() => {}} // Remove the old summarizeData function call
        title="Edit Summary Text"
        placeholder="Enter your summary text..."
        maxTableRows={maxTableRows}
        setMaxTableRows={setMaxTableRows}
      />
    </div>
  );
}

export default OverallGraph;
