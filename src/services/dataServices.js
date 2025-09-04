// services/dataServices.js - Updated to use centralized axios config

import axiosInstance from "../configs/axiosConfigs";
import { DATA_CONFIGS } from "../configs/dataConfigs";
import {
  processAdvertisingData,
  processSocialMediaData,
  cleanObjectData,
} from "../utils/dataProcessors";
import {
  filterDataByDateRange,
  getPreviousPeriodDates,
  calculateComparison,
} from "../utils/dataUtils";

// Main data fetching service
export const fetchDataSheet = async (
  dataType,
  id,
  options = {},
  projectList = [],
  setNotFoundSheetList
) => {
  const {
    enableDateRange = false,
    dateRange = { from: null, to: null },
    metricsMap = {},
    settersMap = {},
    filterBy = null,
    filterValue = null,
  } = options;

  // Prepare empty data structure
  const emptyData = [];
  const emptyTotals = {};
  const emptyMetrics = {};
  const emptyComparison = {};

  let config;
  let setters;

  try {
    config = DATA_CONFIGS[dataType];
    if (!config) throw new Error(`Configuration for ${dataType} not found`);

    setters = settersMap[dataType];

    // Fetch data from API
    const response = await axiosInstance.get(
      `/data-sheets/${config.endpoint}/${id}`
    );
    const rawData = response.data.data;
    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    //for debugging
    if (config.endpoint == "facebook-data") {
      // console.log("🎯 dataRows:", rawData);
    }

    const projectIndex = headers.findIndex((header) => {
      // if Project is not found use Projects instead
      return header === "Project" || header === "Projects";
    });

    const projectFilteredData =
      projectList.length > 0
        ? dataRows.filter((row) => projectList.includes(row[projectIndex]))
        : dataRows;

    const dataObjects = projectFilteredData.map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index]]))
    );

    //for debugging
    if (config.endpoint == "facebook-data") {
      // console.log("🎯 dataObjects:", dataObjects);
    }

    const displayMetrics = metricsMap[dataType] || [];
    const processMetrics = config.processFields || displayMetrics;

    const cleanedData = cleanObjectData(dataObjects, processMetrics);

    //for debugging
    if (config.endpoint == "facebook-data") {
      // console.log("cleanedData", cleanedData);
    }

    // Apply date range filtering
    let currentPeriodData = cleanedData;
    let previousPeriodData = [];
    let comparison = {};

    if (enableDateRange && dateRange.from && dateRange.to) {
      currentPeriodData = filterDataByDateRange(
        cleanedData,
        dateRange.from,
        dateRange.to
      );

      if (config.hasComparison) {
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
    }

    // for debugging
    if (config.endpoint == "facebook-data") {
      // console.log("🎯 currentPeriodData:", currentPeriodData);
      // console.log("🎯 previousPeriodData:", previousPeriodData);
    }

    // Process data if needed
    if (config.processData) {
      let currentPeriodResults;
      let previousPeriodResults;

      const filterOptions = {};
      if (filterBy && filterValue) {
        filterOptions.filterBy = filterBy;
        filterOptions.filterValue = filterValue;
      }

      if (config.processorType === "social") {
        // for debugging
        if (config.endpoint == "facebook-data") {
          // console.log("🎯 currentPeriodData:", currentPeriodData);
        }
        currentPeriodResults = processSocialMediaData(
          currentPeriodData,
          processMetrics,
          displayMetrics,
          config.socialConfig,
          filterOptions
        );

        if (config.hasComparison && previousPeriodData.length > 0) {
          previousPeriodResults = processSocialMediaData(
            previousPeriodData,
            processMetrics,
            displayMetrics,
            config.socialConfig,
            filterOptions
          );
          comparison = calculateComparison(
            currentPeriodResults.enhancedTotals,
            previousPeriodResults.enhancedTotals
          );
        }

        // Update state
        if (setters) {
          setters.setAudienceData?.(currentPeriodResults.audienceData);
          setters.setAudienceTotals?.(currentPeriodResults.audienceTotals);
          setters.setCreativeData?.(currentPeriodResults.creativeData);
          setters.setCreativeTotals?.(currentPeriodResults.creativeTotals);
          setters.setMetrics?.(currentPeriodResults.allMetrics);
          setters.setComparison?.(comparison);
        }
      } else if (config.processorType === "advertising") {
        const platform = dataType === "Youtube" ? "Youtube" : "default";

        currentPeriodResults = processAdvertisingData(
          currentPeriodData,
          processMetrics,
          displayMetrics,
          config.groupBy,
          platform
        );

        if (config.hasComparison && previousPeriodData.length > 0) {
          previousPeriodResults = processAdvertisingData(
            previousPeriodData,
            processMetrics,
            displayMetrics,
            config.groupBy,
            platform
          );
          comparison = calculateComparison(
            currentPeriodResults.enhancedTotals,
            previousPeriodResults.enhancedTotals
          );
        }

        //for debugging
        if (config.endpoint == "overall-data") {
          // console.log("currentPeriodResults", currentPeriodResults);
          // console.log("previousPeriodResults", previousPeriodResults);
        }

        // Update state
        if (setters) {
          setters.setData?.(currentPeriodResults.enhancedFieldData);
          setters.setTotals?.(currentPeriodResults.enhancedTotals);
          setters.setMetrics?.(currentPeriodResults.allMetrics);
          setters.setComparison?.(comparison);
        }
      }

      return currentPeriodResults;
    } else {
      if (setters) setters.setData?.(currentPeriodData);
      return { data: currentPeriodData };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      "Failed to fetch data. Please try again.";
    // console.log("🎯 fetchDataSheet error:", errorMessage);
    if (errorMessage.includes("Unable to parse range")) {
      console.log("🎯 fetchDataSheet error:", errorMessage);
      // example message "Unable to parse range: Shopping Detials!A:T"
      const SHEET_W_RANGE = errorMessage.split("Unable to parse range: ")[1];
      // include if SHEET contain ! ex. GOOGLE!SHEET!A!T
      if (SHEET_W_RANGE.includes("!")) {
        const parts = SHEET_W_RANGE.split("!");
        const sheet = parts.slice(0, -1).join("!"); // all except last
        const range = parts.at(-1);
        setNotFoundSheetList((prev) => {
          if (prev.includes(sheet)) {
            return prev;
          } else {
            return [...prev, sheet];
          }
        });
      }
    } else {
      console.error(`Error fetching ${dataType} data:`, error);
    }
    // Safely set empty state if setters exist
    if (!setters && settersMap[dataType]) setters = settersMap[dataType];

    if (setters) {
      if (config?.processorType === "social") {
        setters.setAudienceData?.(emptyData);
        setters.setAudienceTotals?.(emptyTotals);
        setters.setCreativeData?.(emptyData);
        setters.setCreativeTotals?.(emptyTotals);
        setters.setMetrics?.(emptyMetrics);
        setters.setComparison?.(emptyComparison);
      } else if (config?.processorType === "advertising") {
        setters.setData?.(emptyData);
        setters.setTotals?.(emptyTotals);
        setters.setMetrics?.(emptyMetrics);
        setters.setComparison?.(emptyComparison);
      } else {
        setters.setData?.(emptyData);
      }
    }

    return {
      data: emptyData,
      totals: emptyTotals,
      metrics: emptyMetrics,
      comparison: emptyComparison,
      error:
        error?.response?.data?.message ||
        "Failed to fetch data. Please try again.",
    };
  }
};

// Helper function - updated to use centralized axios config
export const getFilterValues = async (dataType, id, filterField) => {
  try {
    const config = DATA_CONFIGS[dataType];
    if (!config) {
      throw new Error(`Configuration for ${dataType} not found`);
    }

    // Use centralized axios instance with relative URL
    const response = await axiosInstance.get(
      `/data-sheets/${config.endpoint}/${id}`
    );

    const rawData = response.data.data;
    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    const dataObjects = dataRows.map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index]]))
    );

    const uniqueValues = [
      ...new Set(
        dataObjects
          .map((item) => item[filterField])
          .filter((value) => value && value.toString().trim() !== "")
          .map((value) => value.toString().trim())
      ),
    ].sort();

    if (config.endpoint === "line-data") {
      console.log("🎯 getFilterValues result:", uniqueValues);
    }

    return uniqueValues;
  } catch (error) {
    console.error(`Error fetching filter values for ${dataType}:`, error);
    throw error;
  }
};
