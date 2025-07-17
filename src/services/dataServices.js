// services/dataServices.js
import axios from "axios";
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
export const fetchDataSheet = async (dataType, id, options = {}) => {
  const {
    enableDateRange = false,
    dateRange = { from: null, to: null },
    metricsMap = {},
    settersMap = {},
  } = options;

  try {
    const config = DATA_CONFIGS[dataType];
    if (!config) {
      throw new Error(`Configuration for ${dataType} not found`);
    }

    // Fetch data from API
    const response = await axios.get(
      `http://localhost:8000/data-sheets/${config.endpoint}/${id}`
    );

    const rawData = response.data.data;
    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    // Transform raw data to objects
    const dataObjects = dataRows.map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index]]))
    );

    // Get metrics and clean data
    const metrics = metricsMap[dataType] || [];
    const cleanedData = cleanObjectData(dataObjects, metrics);

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

      // Get previous period data for comparison
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

    // Process data based on processor type
    if (config.processData) {
      let currentPeriodResults;
      let previousPeriodResults;

      // Choose processor based on type
      if (config.processorType === "social") {
        currentPeriodResults = processSocialMediaData(
          currentPeriodData,
          metrics,
          config.processFields,
          config.socialConfig
        );

        if (config.hasComparison && previousPeriodData.length > 0) {
          previousPeriodResults = processSocialMediaData(
            previousPeriodData,
            metrics,
            config.processFields,
            config.socialConfig
          );
          comparison = calculateComparison(
            currentPeriodResults.enhancedTotals,
            previousPeriodResults.enhancedTotals
          );
        }
      } else if (config.processorType === "advertising") {
        currentPeriodResults = processAdvertisingData(
          currentPeriodData,
          metrics,
          config.processFields,
          config.groupBy
        );

        if (config.hasComparison && previousPeriodData.length > 0) {
          previousPeriodResults = processAdvertisingData(
            previousPeriodData,
            metrics,
            config.processFields,
            config.groupBy
          );
          comparison = calculateComparison(
            currentPeriodResults.enhancedTotals,
            previousPeriodResults.enhancedTotals
          );
        }
      }

      // Update state based on processor type
      const setters = settersMap[dataType];
      if (setters) {
        if (config.processorType === "social") {
          // Social media platform state updates
          setters.setAudienceData?.(currentPeriodResults.audienceData);
          setters.setAudienceTotals?.(currentPeriodResults.audienceTotals);
          setters.setCreativeData?.(currentPeriodResults.creativeData);
          setters.setCreativeTotals?.(currentPeriodResults.creativeTotals);
          setters.setMetrics?.(currentPeriodResults.allMetrics);
          setters.setComparison?.(comparison);
        } else if (config.processorType === "advertising") {
          // Advertising platform state updates
          setters.setData?.(currentPeriodResults.enhancedFieldData);
          setters.setTotals?.(currentPeriodResults.enhancedTotals);
          setters.setMetrics?.(currentPeriodResults.allMetrics);
          setters.setComparison?.(comparison);
        }
      }

      return currentPeriodResults;
    } else {
      // For data types that don't use processing (like GGDemographic)
      const setters = settersMap[dataType];
      if (setters) {
        setters.setData?.(currentPeriodData);
      }
      return { data: currentPeriodData };
    }
  } catch (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    throw error;
  }
};
