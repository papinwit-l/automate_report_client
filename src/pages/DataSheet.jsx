import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";

function DataSheet() {
  const [data, setData] = React.useState(null);
  const [dataHeader, setDataHeader] = React.useState([]);
  const [totalData, setTotalData] = React.useState({});
  const [channelData, setChannelData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [metrics, setMetrics] = React.useState([
    "Impressions",
    "Reach",
    "Clicks",
    "Conversions",
    "Spent",
    "Post Engagement",
    "Value",
    "Count Lead",
    "Count Walk",
    "Count Book",
  ]);

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:8000/data-sheets/overall-data"
      );
      const rawData = response.data.data;
      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const dataObjects = dataRows.map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      );

      const cleanedData = dataObjects.map((entry) => {
        const cleaned = { ...entry };
        for (const key of metrics) {
          cleaned[key] =
            parseFloat(cleaned[key]?.toString().replace(/,/g, "")) || 0;
        }
        return cleaned;
      });

      setDataHeader(headers);
      setData(cleanedData);

      // Group by channel
      const summaryByChannel = cleanedData.reduce((acc, item) => {
        const channel = item.Channel || "Unknown";
        if (!acc[channel]) {
          acc[channel] = Object.fromEntries(metrics.map((m) => [m, 0]));
        }
        for (const key of metrics) {
          acc[channel][key] += item[key];
        }
        return acc;
      }, {});

      // Add calculations for each channel
      const enhancedChannelData = {};
      Object.entries(summaryByChannel).forEach(([channel, data]) => {
        const ctr =
          data.Impressions > 0 ? (data.Clicks / data.Impressions) * 100 : 0;
        const conRate =
          data.Clicks > 0 ? (data.Conversions / data.Clicks) * 100 : 0;
        const cpl = data.Conversions > 0 ? data.Spent / data.Conversions : 0;

        enhancedChannelData[channel] = {
          ...data,
          ctr,
          conRate,
          cpl,
        };
      });

      // Calculate totals
      const totals = Object.fromEntries(metrics.map((m) => [m, 0]));
      Object.values(summaryByChannel).forEach((channelValues) => {
        for (const key of metrics) {
          totals[key] += channelValues[key];
        }
      });

      // Add calculated totals
      const totalCtr =
        totals.Impressions > 0 ? (totals.Clicks / totals.Impressions) * 100 : 0;
      const totalConRate =
        totals.Clicks > 0 ? (totals.Conversions / totals.Clicks) * 100 : 0;
      const totalCpl =
        totals.Conversions > 0 ? totals.Spent / totals.Conversions : 0;

      const enhancedTotals = {
        ...totals,
        ctr: totalCtr,
        conRate: totalConRate,
        cpl: totalCpl,
      };

      // Update metrics to include calculated fields in desired order
      const allMetrics = [
        "Impressions",
        "Reach",
        "Clicks",
        "ctr",
        "Conversions",
        "conRate",
        "cpl",
        "Spent",
      ];

      setMetrics(allMetrics);
      setChannelData(enhancedChannelData);
      setTotalData(enhancedTotals);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, metric) => {
    if (metric === "ctr" || metric === "conRate") {
      return `${value.toFixed(2)}%`;
    }
    if (metric === "cpl") {
      return value.toFixed(2);
    }
    return value.toLocaleString();
  };

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-xl font-bold mb-4">DATA SHEET</h1>
      <div className="flex gap-4 mb-6">
        <Button onClick={handleGetData} disabled={loading}>
          {loading ? "Loading..." : "GET DATA"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {Object.keys(channelData).length > 0 && (
        <div className="overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Summary by Channel</h2>
          <table className="min-w-max table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-2 border">Channel</th>
                {metrics.map((metric) => (
                  <th key={metric} className="px-3 py-2 border text-right">
                    {metric === "ctr"
                      ? "%CTR"
                      : metric === "conRate"
                      ? "%Con Rate"
                      : metric === "cpl"
                      ? "CPL"
                      : metric}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(channelData)
                .sort(([, a], [, b]) => b["Conversions"] - a["Conversions"])
                .map(([channel, values]) => (
                  <tr key={channel} className="hover:bg-gray-100">
                    <td className="px-3 py-2 border">{channel}</td>
                    {metrics.map((metric) => (
                      <td key={metric} className="px-3 py-2 border text-right">
                        {formatValue(values[metric], metric)}
                      </td>
                    ))}
                  </tr>
                ))}
              {Object.keys(totalData).length > 0 && (
                <tr className="bg-gray-200 font-semibold">
                  <td className="px-3 py-2 border">Total</td>
                  {metrics.map((metric) => (
                    <td key={metric} className="px-3 py-2 border text-right">
                      {formatValue(totalData[metric], metric)}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataSheet;
