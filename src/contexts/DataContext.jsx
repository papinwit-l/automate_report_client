import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [totalData, setTotalData] = useState({});
  const [channelData, setChannelData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([
    "Impressions",
    "Reach",
    "Clicks",
    "Conversions",
    "Spent",
    "Post Engagement",
    "Value",
  ]);

  const processChannelData = (cleanedData, metrics) => {
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

    return { enhancedChannelData, enhancedTotals, allMetrics };
  };

  const fetchData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch overall data
        const response = await axios.get(
          `http://localhost:8000/data-sheets/overall-data/${id}`
        );
        const rawData = response.data.data;
        const headers = rawData[0];
        const dataRows = rawData.slice(1);

        const dataObjects = dataRows.map((row) =>
          Object.fromEntries(
            headers.map((header, index) => [header, row[index]])
          )
        );

        const cleanedData = dataObjects.map((entry) => {
          const cleaned = { ...entry };
          for (const key of metrics) {
            cleaned[key] =
              parseFloat(cleaned[key]?.toString().replace(/,/g, "")) || 0;
          }
          cleaned["Updated Date"] = entry["Updated Date"];
          return cleaned;
        });

        // Process channel data
        const { enhancedChannelData, enhancedTotals, allMetrics } =
          processChannelData(cleanedData, metrics);

        setMetrics(allMetrics);
        setChannelData(enhancedChannelData);
        setTotalData(enhancedTotals);
      } catch (err) {
        console.error(err);
        const ErrMsg = err?.response?.data?.message;
        alert(ErrMsg || "Failed to fetch data. Please try again.");
        setError(ErrMsg || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [metrics]
  );

  //   useEffect(() => {
  //     fetchData();
  //   }, [fetchData]);

  const value = {
    totalData,
    channelData,
    loading,
    error,
    metrics,
    fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
