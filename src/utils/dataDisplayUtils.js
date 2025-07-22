// utils/dataDisplayUtils.js

/**
 * Converts numbers to readable format with K, M, B, T suffixes
 * Handles edge cases and "No Data" strings
 */
export const convertToBMK = (value, decimals = 1) => {
  // Handle "No Data" case
  if (value === "No Data") return "No Data";

  // Handle null, undefined, empty string, or 0
  if (!value || value === 0) return "0";

  // Handle non-numeric values
  const numValue = Number(value);
  if (isNaN(numValue)) return "0";

  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;
  let convertedValue = Math.abs(numValue);

  while (convertedValue >= 1000 && suffixIndex < suffixes.length - 1) {
    convertedValue /= 1000;
    suffixIndex++;
  }

  const formatted = convertedValue.toFixed(decimals);
  const sign = numValue < 0 ? "-" : "";

  return `${sign}${formatted}${suffixes[suffixIndex]}`;
};

/**
 * Formats percentage values with proper decimal places
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === "No Data") return "No Data";
  if (!value && value !== 0) return "0.00%";

  const numValue = Number(value);
  if (isNaN(numValue)) return "0.00%";

  return `${numValue.toFixed(decimals)}%`;
};

/**
 * Formats currency values
 */
export const formatCurrency = (value, decimals = 2, currency = "$") => {
  if (value === "No Data") return "No Data";
  if (!value && value !== 0) return `${currency}0.00`;

  const numValue = Number(value);
  if (isNaN(numValue)) return `${currency}0.00`;

  return `${currency}${numValue.toFixed(decimals)}`;
};

/**
 * Formats display data for NumberDisplayBox component
 * Handles all edge cases and provides consistent formatting
 */
export const formatDisplayData = (
  value,
  comparisonValue,
  valueType = "compact"
) => {
  // Handle "No Data" case or undefined/null values
  if (value === "No Data" || value === undefined || value === null) {
    return {
      displayValue: "No Data",
      compareValue: "No data",
      isNegative: false,
    };
  }

  // Format main value based on type
  let displayValue;
  switch (valueType) {
    case "compact":
      displayValue = convertToBMK(value, 1);
      break;
    case "percentage":
      displayValue = formatPercentage(value, 2);
      break;
    case "currency":
      displayValue = formatCurrency(value, 2);
      break;
    case "number":
      displayValue = value?.toLocaleString() || "0";
      break;
    default:
      displayValue = value?.toLocaleString() || "0";
  }

  // Format comparison value
  let compareValue = "No data";
  let isNegative = false;

  if (
    comparisonValue !== undefined &&
    comparisonValue !== null &&
    comparisonValue !== "No Data"
  ) {
    const numComparison = Number(comparisonValue);
    if (!isNaN(numComparison)) {
      compareValue = formatPercentage(Math.abs(numComparison), 2);
      isNegative = numComparison < 0;
    }
  }

  return {
    displayValue,
    compareValue,
    isNegative,
  };
};

/**
 * Batch formatter for multiple metrics
 * Useful for processing multiple NumberDisplayBox components at once
 */
export const formatMetricsData = (
  totalsData,
  comparisonData,
  metricConfigs
) => {
  const formatted = {};

  // Handle case where totalsData is undefined/null
  if (!totalsData) {
    Object.keys(metricConfigs).forEach((key) => {
      formatted[key] = {
        displayValue: "No Data",
        compareValue: "No data",
        isNegative: false,
      };
    });
    return formatted;
  }

  Object.entries(metricConfigs).forEach(([key, config]) => {
    formatted[key] = formatDisplayData(
      totalsData[key],
      comparisonData?.[key],
      config.valueType || "compact"
    );
  });

  return formatted;
};

/**
 * Configuration for different metric types
 * Define how each metric should be formatted
 */
export const METRIC_CONFIGS = {
  Impressions: { valueType: "compact" },
  Clicks: { valueType: "compact" },
  Conversions: { valueType: "number" },
  Spent: { valueType: "compact" },
  ctr: { valueType: "percentage" },
  conRate: { valueType: "percentage" },
  cpc: { valueType: "compact" },
  cpl: { valueType: "compact" },
  Reach: { valueType: "compact" },
  cpm: { valueType: "compact" },
  engagementRate: { valueType: "percentage" }, // ✅ ADDED
  cpe: { valueType: "compact" }, // ✅ ADDED
  cpr: { valueType: "compact" }, // ✅ ADDED
  frequency: { valueType: "number" }, // ✅ ADDED
  engagements: { valueType: "number" }, // ✅ ADDED
};

/**
 * Table value formatter function
 * Used specifically for DataTable component
 */
export const formatTableValue = (value, metric) => {
  if (value === "No Data") return "No Data";

  const metricLower = metric.toLowerCase();

  // ✅ UPDATED: Added more percentage cases
  if (
    metricLower === "ctr" ||
    metricLower === "conrate" ||
    metricLower === "engagementrate" ||
    metricLower === "cvr"
  ) {
    return `${Number(value).toFixed(2)}%`;
  }

  // ✅ UPDATED: Added more currency/cost cases
  if (
    metricLower === "cpl" ||
    metricLower === "cpm" ||
    metricLower === "cpe" ||
    metricLower === "cpr" ||
    metricLower === "cpc"
  ) {
    return parseFloat(value.toFixed(2)).toLocaleString();
  }

  return value?.toLocaleString();
};
