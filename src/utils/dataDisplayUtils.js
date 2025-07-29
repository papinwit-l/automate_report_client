// utils/dataDisplayUtils.js

/**
 * Converts numbers to readable format with K, M, B, T suffixes
 * Handles edge cases and "No Data" strings
 */
export const convertToBMK = (value, decimals = 1) => {
  // ✅ FIXED: Changed default to 1 decimals
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
 * Formats decimal values with specified decimal places
 */
export const formatDecimal = (value, decimals = 2) => {
  if (value === "No Data") return "No Data";
  if (!value && value !== 0) return "0.00";

  const numValue = Number(value);
  if (isNaN(numValue)) return "0.00";

  return numValue.toFixed(decimals);
};
export const formatCurrency = (value, decimals = 0, currency = "$") => {
  // ✅ FIXED: Changed default to 0 decimals
  if (value === "No Data") return "No Data";
  if (!value && value !== 0) return `${currency}0`;

  const numValue = Number(value);
  if (isNaN(numValue)) return `${currency}0`;

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
      displayValue = convertToBMK(value, 1); // 1 decimal places for compact
      break;
    case "percentage":
      displayValue = formatPercentage(value, 2);
      break;
    case "currency":
      displayValue = formatCurrency(value, 0); // 0 decimal places for currency
      break;
    case "decimal":
      displayValue = formatDecimal(value, 2); // ✅ NEW: Decimal format with 2 decimal places
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
  Impressions: { valueType: "number" }, // ✅ FIXED: Changed from compact to number
  Clicks: { valueType: "number" }, // ✅ FIXED: Changed from compact to number
  Conversions: { valueType: "number" },
  Spent: { valueType: "currency" }, // Currency - no decimal places
  Cost: { valueType: "currency" }, // Currency - no decimal places
  ctr: { valueType: "percentage" },
  conRate: { valueType: "percentage" },
  cpc: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  cpl: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  cpm: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  cpe: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  cpr: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  cpa: { valueType: "decimal" },
  Reach: { valueType: "number" }, // ✅ FIXED: Changed from compact to number
  engagementRate: { valueType: "percentage" },
  frequency: { valueType: "decimal" }, // ✅ CHANGED: From compact to decimal
  engagements: { valueType: "number" },
};

/**
 * Table value formatter function
 * Used specifically for DataTable component
 */
export const formatTableValue = (value, metric) => {
  if (value === "No Data") return "No Data";

  const metricLower = metric.toLowerCase();

  // Percentage cases
  if (
    metricLower === "ctr" ||
    metricLower === "conrate" ||
    metricLower === "engagementrate" ||
    metricLower === "cvr"
  ) {
    return `${Number(value).toFixed(2)}%`;
  }

  // Currency cases - no decimal places (only Spent and Cost)
  if (metricLower === "spent" || metricLower === "cost") {
    return `${Math.round(value).toLocaleString()}`;
  }

  // Metrics starting with "cp" and frequency - decimal format
  if (metricLower.startsWith("cp") || metricLower === "frequency") {
    return formatDecimal(value, 2);
  }

  // Number format for impressions, clicks, reach, etc.
  if (
    metricLower === "impressions" ||
    metricLower === "clicks" ||
    metricLower === "reach" ||
    metricLower === "conversions" ||
    metricLower === "engagements"
  ) {
    return value?.toLocaleString();
  }

  return value?.toLocaleString();
};
