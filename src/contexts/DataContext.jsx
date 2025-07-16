import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const DataContext = createContext();

const NON_NUMERIC_COLUMNS = [
  "Updated Date",
  "Project",
  "Channel",
  "Gender",
  "Year & month",
  "Year & week (Mon-Sun)",
  "Date",
  "Updated Month",
  "Updated Week",
  "Updated Date",
  "Campaign name",
  "Keyword",
  "Device",
];

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [enableDateRange, setEnableDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [SEMData, setSEMData] = useState({});
  const [SEMTotals, setSEMTotals] = useState({});
  const [SEMMetrics, setSEMMetrics] = useState([
    "Keyword",
    "Impressions",
    "Clicks",
    "Conversions",
    "Spent",
  ]);
  const [SEMComparison, setSEMComparison] = useState({});

  const [GGDemographicData, setGGDemographicData] = useState({});
  const [GGDemographicTotals, setGGDemographicTotals] = useState({});
  const [GGDemographicMetrics, setGGDemographicMetrics] = useState([
    "Channel",
    "Conversions",
    "Campaign name",
    "Gender",
    "Device",
    "Impressions",
    "Clicks",
  ]);

  const [GDNData, setGDNData] = useState({});
  const [GDNTotals, setGDNTotals] = useState({});
  const [GDNMetrics, setGDNMetrics] = useState([
    "Ad group name",
    "Impressions",
    "Clicks",
    "Conversions",
    "Spent",
  ]);
  const [GDNComparison, setGDNComparison] = useState({});

  // Helper function to calculate date difference in days
  const getDateDifference = (from, to) => {
    // Convert to Date objects if they're strings
    const fromDate = from instanceof Date ? from : new Date(from);
    const toDate = to instanceof Date ? to : new Date(to);
    return Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24);
  };

  // Helper function to get previous period dates
  const getPreviousPeriodDates = (from, to) => {
    const fromDate = from instanceof Date ? from : new Date(from);
    const toDate = to instanceof Date ? to : new Date(to);

    const daysDifference = getDateDifference(fromDate, toDate);

    const previousTo = new Date(fromDate);
    previousTo.setDate(previousTo.getDate() - 1);

    const previousFrom = new Date(previousTo);
    previousFrom.setDate(previousFrom.getDate() - daysDifference);

    const formatDateLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      from: formatDateLocal(previousFrom),
      to: formatDateLocal(previousTo),
    };
  };

  // Helper function to filter data by date range
  const filterDataByDateRange = (data, from, to) => {
    if (!from || !to) return data;

    // Helper function to format date in local timezone (UTC+7)
    const formatDateLocal = (date) => {
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      return date;
    };

    const fromStr = formatDateLocal(from);
    const toStr = formatDateLocal(to);

    const filtered = data.filter((item) => {
      const itemDate = item["Updated Date"];
      if (!itemDate) return false;

      const itemDateStr = itemDate.toString().trim();
      return itemDateStr >= fromStr && itemDateStr <= toStr;
    });

    return filtered;
  };

  // Helper function to calculate comparison percentages
  const calculateComparison = (current, previous) => {
    const comparison = {};

    Object.keys(current).forEach((key) => {
      const currentValue = current[key];
      const previousValue = previous[key] || 0;

      if (
        typeof currentValue === "number" &&
        typeof previousValue === "number"
      ) {
        if (previousValue === 0) {
          comparison[key] = currentValue > 0 ? 100 : 0;
        } else {
          const percentChange =
            ((currentValue - previousValue) / previousValue) * 100;
          comparison[key] = Number(percentChange.toFixed(2));
        }
      }
    });

    return comparison;
  };

  const processData = (
    cleanedData,
    metrics,
    finalMetrics,
    groupBy = "Keyword"
  ) => {
    // Group by the specified field
    const summaryByField = cleanedData.reduce((acc, item) => {
      const fieldValue = item[groupBy] || "Unknown";

      if (!acc[fieldValue]) {
        acc[fieldValue] = Object.fromEntries(metrics.map((m) => [m, 0]));
      }
      for (const key of metrics) {
        acc[fieldValue][key] += item[key];
      }
      return acc;
    }, {});

    // Add calculations for each field value
    const enhancedFieldData = {};
    Object.entries(summaryByField).forEach(([fieldValue, data]) => {
      const ctr =
        data.Impressions > 0 ? (data.Clicks / data.Impressions) * 100 : 0;
      const conRate =
        data.Clicks > 0 ? (data.Conversions / data.Clicks) * 100 : 0;
      const cpl = data.Conversions > 0 ? data.Spent / data.Conversions : 0;
      const cpc = data.Clicks > 0 ? data.Spent / data.Clicks : 0;

      enhancedFieldData[fieldValue] = {
        ...data,
        ctr: Number(ctr.toFixed(2)),
        conRate: Number(conRate.toFixed(2)),
        cpl: Number(cpl.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
      };
    });

    // Calculate totals
    const totals = Object.fromEntries(metrics.map((m) => [m, 0]));
    Object.values(summaryByField).forEach((fieldValues) => {
      for (const key of metrics) {
        totals[key] += fieldValues[key];
      }
    });

    // Add calculated totals
    const totalCtr =
      totals.Impressions > 0 ? (totals.Clicks / totals.Impressions) * 100 : 0;
    const totalConRate =
      totals.Clicks > 0 ? (totals.Conversions / totals.Clicks) * 100 : 0;
    const totalCpl =
      totals.Conversions > 0 ? totals.Spent / totals.Conversions : 0;
    const totalCpc = totals.Clicks > 0 ? totals.Spent / totals.Clicks : 0;

    const enhancedTotals = {
      ...totals,
      ctr: Number(totalCtr.toFixed(2)),
      conRate: Number(totalConRate.toFixed(2)),
      cpl: Number(totalCpl.toFixed(2)),
      cpc: Number(totalCpc.toFixed(2)),
    };

    return {
      enhancedFieldData,
      enhancedTotals,
      allMetrics: finalMetrics,
    };
  };

  const cleanObjectData = (object, metrics) => {
    return object.map((entry) => {
      const cleaned = { ...entry };

      // Clean numeric fields
      for (const key of metrics) {
        if (NON_NUMERIC_COLUMNS.includes(key)) continue;
        cleaned[key] =
          parseFloat(cleaned[key]?.toString().replace(/,/g, "")) || 0;
      }

      // Clean all text fields that could be used for grouping
      // This will handle any potential groupBy field
      Object.keys(cleaned).forEach((key) => {
        // Skip numeric fields and date fields
        if (!metrics.includes(key) && key !== "Updated Date") {
          if (cleaned[key] && typeof cleaned[key] === "string") {
            cleaned[key] = cleaned[key].trim();
          } else if (cleaned[key]) {
            // Convert to string and trim if it's not already a string
            cleaned[key] = cleaned[key].toString().trim();
          }
        }
      });

      // Keep the Updated Date as is
      cleaned["Updated Date"] = entry["Updated Date"];

      return cleaned;
    });
  };

  const getSEMData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/data-sheets/sem-data/${id}`
      );
      const rawData = response.data.data;
      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const dataObjects = dataRows.map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      );

      const cleanedData = cleanObjectData(dataObjects, SEMMetrics);

      let currentPeriodData = cleanedData;
      let previousPeriodData = [];
      let comparison = {};

      // Apply date range filtering if enabled
      if (enableDateRange && dateRange.from && dateRange.to) {
        currentPeriodData = filterDataByDateRange(
          cleanedData,
          dateRange.from,
          dateRange.to
        );

        // Get previous period data for comparison
        const previousPeriodDates = getPreviousPeriodDates(
          dateRange.from,
          dateRange.to
        );

        previousPeriodData = filterDataByDateRange(
          cleanedData,
          previousPeriodDates.from,
          previousPeriodDates.to
        );
      } else {
        // console.log("Date range filtering disabled or no date range provided");
      }

      // Process current period data
      const currentPeriodResults = processData(
        currentPeriodData,
        SEMMetrics,
        [
          "Keyword",
          "Impressions",
          "Clicks",
          "ctr",
          "cpc",
          "Conversions",
          "conRate",
          "cpl",
          "Spent",
        ],
        "Keyword"
      );

      // Process previous period data if date range is enabled
      if (
        enableDateRange &&
        dateRange.from &&
        dateRange.to &&
        previousPeriodData.length > 0
      ) {
        const previousPeriodResults = processData(
          previousPeriodData,
          SEMMetrics,
          [
            "Keyword",
            "Impressions",
            "Clicks",
            "ctr",
            "cpc",
            "Conversions",
            "conRate",
            "cpl",
            "Spent",
          ],
          "Keyword"
        );

        // Calculate comparison
        comparison = calculateComparison(
          currentPeriodResults.enhancedTotals,
          previousPeriodResults.enhancedTotals
        );
      }

      setSEMData(currentPeriodResults.enhancedFieldData);
      setSEMTotals(currentPeriodResults.enhancedTotals);
      setSEMMetrics(currentPeriodResults.allMetrics);
      setSEMComparison(comparison);
    } catch (error) {
      console.error("Error fetching SEM data:", error);
    }
  };

  const getGGDemographic = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/data-sheets/gg-demographic/${id}`
      );
      const rawData = response.data.data;
      const headers = rawData[0];
      const dataRows = rawData.slice(1);
      const dataObjects = dataRows.map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      );
      const cleanedData = cleanObjectData(dataObjects, GGDemographicMetrics);

      let currentPeriodData = cleanedData;
      let previousPeriodData = [];
      let comparison = {};

      if (enableDateRange && dateRange.from && dateRange.to) {
        currentPeriodData = filterDataByDateRange(
          cleanedData,
          dateRange.from,
          dateRange.to
        );
      }

      setGGDemographicData(currentPeriodData);
    } catch (error) {
      console.error("Error fetching GG Demographuc data:", error);
    }
  };

  const getGDNDATA = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/data-sheets/gg-demographic/${id}`
      );
      const rawData = response.data.data;
      const headers = rawData[0];
      const dataRows = rawData.slice(1);
      const dataObjects = dataRows.map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, row[index]]))
      );
      const cleanedData = cleanObjectData(dataObjects, GDNMetrics);

      let currentPeriodData = cleanedData;
      let previousPeriodData = [];
      let comparison = {};

      if (enableDateRange && dateRange.from && dateRange.to) {
        currentPeriodData = filterDataByDateRange(
          cleanedData,
          dateRange.from,
          dateRange.to
        );

        // Get previous period data for comparison
        const previousPeriodDates = getPreviousPeriodDates(
          dateRange.from,
          dateRange.to
        );

        previousPeriodData = filterDataByDateRange(
          cleanedData,
          previousPeriodDates.from,
          previousPeriodDates.to
        );
      }

      const currentPeriodResults = processData(
        currentPeriodData,
        GDNMetrics,
        [
          "Ad group name",
          "Impressions",
          "Clicks",
          "ctr",
          "Conversions",
          "cpl",
          "Spent",
        ],
        "Ad group name"
      );

      // Process previous period data if date range is enabled
      if (
        enableDateRange &&
        dateRange.from &&
        dateRange.to &&
        previousPeriodData.length > 0
      ) {
        const previousPeriodResults = processData(
          previousPeriodData,
          SEMMetrics,
          [
            "Ad group name",
            "Impressions",
            "Clicks",
            "ctr",
            "Conversions",
            "cpl",
            "Spent",
          ],
          "Ad group name"
        );

        // Calculate comparison
        comparison = calculateComparison(
          currentPeriodResults.enhancedTotals,
          previousPeriodResults.enhancedTotals
        );
      }
      setGDNData(currentPeriodResults.enhancedFieldData);
      setGDNTotals(currentPeriodResults.enhancedTotals);
      setGDNMetrics(currentPeriodResults.allMetrics);
      setGDNComparison(comparison);
    } catch (error) {
      console.error("Error fetching GDN data:", error);
    }
  };

  const fetchData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch SEM data
        await getSEMData(id);
        await getGGDemographic(id);
        await getGDNDATA(id);
      } catch (err) {
        console.error(err);
        const ErrMsg = err?.response?.data?.message;
        alert(ErrMsg || "Failed to fetch data. Please try again.");
        setError(ErrMsg || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [enableDateRange, dateRange, SEMMetrics]
  );

  const value = {
    loading,
    error,
    fetchData,
    SEMData,
    SEMTotals,
    SEMMetrics,
    SEMComparison, // New: comparison data
    dateRange,
    setDateRange,
    enableDateRange,
    setEnableDateRange,
    GGDemographicData,
    GDNData,
    GDNTotals,
    GDNMetrics,
    GDNComparison,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
