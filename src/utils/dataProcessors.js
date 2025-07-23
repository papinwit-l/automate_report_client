// utils/dataProcessors.js
import { NON_NUMERIC_COLUMNS } from "../configs/dataConfigs";

// Original processor for advertising platforms (SEM, GDN, Disc)
export const processAdvertisingData = (
  cleanedData,
  metrics,
  finalMetrics,
  groupBy = "Keyword"
) => {
  if (!cleanedData || cleanedData.length === 0) {
    return {
      enhancedFieldData: {},
      enhancedTotals: Object.fromEntries(
        finalMetrics.map((m) => [m, "No Data"])
      ),
      allMetrics: finalMetrics,
    };
  }

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
    const cpm =
      data.Impressions > 0 ? (data.Spent * 1000) / data.Impressions : 0;
    const cpv = data.Views > 0 ? data.Spent / data.Views : 0;
    const cpe = data.Engagements > 0 ? data.Spent / data.Engagements : 0;
    const engagementRate =
      data.Reach > 0 ? (data.Engagements / data.Reach) * 100 : 0;

    enhancedFieldData[fieldValue] = {
      ...data,
      ctr: Number(ctr.toFixed(2)),
      conRate: Number(conRate.toFixed(2)),
      cpl: Number(cpl.toFixed(2)),
      cpc: Number(cpc.toFixed(2)),
      cpm: Number(cpm.toFixed(2)),
      cpv: Number(cpv.toFixed(2)),
      cpe: Number(cpe.toFixed(2)),
      engagementRate: Number(engagementRate.toFixed(2)),
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
  const totalCpm =
    totals.Impressions > 0 ? (totals.Spent * 1000) / totals.Impressions : 0;
  const totalCpv = totals.Views > 0 ? totals.Spent / totals.Views : 0;
  const totalCpe =
    totals.Engagements > 0 ? totals.Spent / totals.Engagements : 0;
  const totalEngagementRate =
    totals.Reach > 0 ? (totals.Engagements / totals.Reach) * 100 : 0;

  const enhancedTotals = {
    ...totals,
    ctr: Number(totalCtr.toFixed(2)),
    conRate: Number(totalConRate.toFixed(2)),
    cpl: Number(totalCpl.toFixed(2)),
    cpc: Number(totalCpc.toFixed(2)),
    cpm: Number(totalCpm.toFixed(2)),
    cpv: Number(totalCpv.toFixed(2)),
    cpe: Number(totalCpe.toFixed(2)),
    engagementRate: Number(totalEngagementRate.toFixed(2)),
  };

  return {
    enhancedFieldData,
    enhancedTotals,
    allMetrics: finalMetrics,
  };
};

// Helper function to calculate enhanced metrics for social media
const calculateEnhancedMetrics = (data, calculatedFields) => {
  const enhanced = {};

  calculatedFields.forEach((field) => {
    switch (field.type) {
      case "frequency":
        enhanced[field.key] =
          data.impressions > 0 && data.reach > 0
            ? Number((data.impressions / data.reach).toFixed(2))
            : 0;
        break;
      case "ctr":
        enhanced[field.key] =
          data.impressions > 0
            ? Number(((data.clicks / data.impressions) * 100).toFixed(2))
            : 0;
        break;
      case "cpc":
        enhanced[field.key] =
          data.clicks > 0 ? Number((data.cost / data.clicks).toFixed(2)) : 0;
        break;
      case "cvr":
        enhanced[field.key] =
          data.clicks > 0
            ? Number(((data.conversions / data.clicks) * 100).toFixed(2))
            : 0;
        break;
      case "cpa":
        enhanced[field.key] =
          data.conversions > 0
            ? Number((data.cost / data.conversions).toFixed(2))
            : 0;
        break;
      case "cpr":
        enhanced[field.key] =
          data.reach > 0
            ? Number(((data.cost * 1000) / data.reach).toFixed(2))
            : 0;
        break;
      case "cpl":
        enhanced[field.key] =
          data.conversions > 0
            ? Number((data.cost / data.conversions).toFixed(2))
            : 0;
        break;
      case "cpm":
        enhanced[field.key] =
          data.impressions > 0
            ? Number(((data.cost * 1000) / data.impressions).toFixed(2))
            : 0;
        break;
      case "cpv":
        enhanced[field.key] =
          data.views > 0 ? Number((data.cost / data.views).toFixed(2)) : 0;
        break;
      case "cpe":
        enhanced[field.key] =
          data.engagements > 0
            ? Number((data.cost / data.engagements).toFixed(2))
            : 0;
        break;
      case "engagementRate":
        enhanced[field.key] =
          data.reach > 0
            ? Number(((data.engagements / data.reach) * 100).toFixed(2))
            : 0;
        break;
      case "custom":
        enhanced[field.key] = field.calculate(data);
        break;
    }
  });

  return enhanced;
};

// Helper function to filter data by specific field and value
const filterDataByField = (data, filterBy, filterValue) => {
  if (!filterBy || !filterValue) return data;

  return data.filter((item) => {
    const itemValue = item[filterBy];
    return (
      itemValue &&
      itemValue.toString().toLowerCase() === filterValue.toLowerCase()
    );
  });
};

// Universal processor for social media platforms
export const processSocialMediaData = (
  cleanedData,
  metrics,
  finalMetrics,
  config,
  filterOptions = {}
) => {
  if (!cleanedData || cleanedData.length === 0) {
    return {
      enhancedFieldData: {},
      enhancedTotals: Object.fromEntries(
        finalMetrics.map((m) => [m, "No Data"])
      ),
      allMetrics: finalMetrics,
      audienceData: {},
      creativeData: {},
    };
  }

  // Apply filtering if specified
  let processedData = cleanedData;
  if (filterOptions.filterBy && filterOptions.filterValue) {
    processedData = filterDataByField(
      cleanedData,
      filterOptions.filterBy,
      filterOptions.filterValue
    );

    // If no data after filtering, return empty results
    if (processedData.length === 0) {
      return {
        enhancedFieldData: {},
        enhancedTotals: Object.fromEntries(
          finalMetrics.map((m) => [m, "No Data"])
        ),
        allMetrics: finalMetrics,
        audienceData: {},
        creativeData: {},
      };
    }
  }

  // Process data for Performance by Audiences table
  const audienceData = processedData.reduce((acc, item) => {
    const audienceKey = item[config.audienceGroupBy] || "Unknown";

    if (!acc[audienceKey]) {
      acc[audienceKey] = {};
      config.fields.forEach((field) => {
        acc[audienceKey][field.key] = 0;
      });
    }

    config.fields.forEach((field) => {
      const value = item[field.sourceField] || 0;
      acc[audienceKey][field.key] += value;
    });

    return acc;
  }, {});

  // Process data for Performance by Creatives table
  const creativeData = processedData.reduce((acc, item) => {
    const creativeKey = item[config.creativeGroupBy] || "Unknown";

    if (!acc[creativeKey]) {
      acc[creativeKey] = {};
      config.fields.forEach((field) => {
        acc[creativeKey][field.key] = 0;
      });
    }

    config.fields.forEach((field) => {
      acc[creativeKey][field.key] += item[field.sourceField] || 0;
    });

    return acc;
  }, {});

  // Calculate enhanced metrics for audience data
  const enhancedAudienceData = {};
  Object.entries(audienceData).forEach(([key, data]) => {
    enhancedAudienceData[key] = {
      ...data,
      ...calculateEnhancedMetrics(data, config.calculatedFields),
    };
  });

  // Calculate enhanced metrics for creative data
  const enhancedCreativeData = {};
  Object.entries(creativeData).forEach(([key, data]) => {
    enhancedCreativeData[key] = {
      ...data,
      ...calculateEnhancedMetrics(data, config.calculatedFields),
    };
  });

  // Calculate totals for audience data
  const audienceTotals = Object.values(audienceData).reduce((acc, item) => {
    config.fields.forEach((field) => {
      acc[field.key] = (acc[field.key] || 0) + item[field.key];
    });
    return acc;
  }, {});

  const enhancedAudienceTotals = {
    ...audienceTotals,
    ...calculateEnhancedMetrics(audienceTotals, config.calculatedFields),
  };

  // Calculate totals for creative data
  const creativeTotals = Object.values(creativeData).reduce((acc, item) => {
    config.fields.forEach((field) => {
      acc[field.key] = (acc[field.key] || 0) + item[field.key];
    });
    return acc;
  }, {});

  const enhancedCreativeTotals = {
    ...creativeTotals,
    ...calculateEnhancedMetrics(creativeTotals, config.calculatedFields),
  };

  return {
    enhancedFieldData: enhancedAudienceData,
    enhancedTotals: enhancedAudienceTotals,
    allMetrics: finalMetrics,
    audienceData: enhancedAudienceData,
    audienceTotals: enhancedAudienceTotals,
    creativeData: enhancedCreativeData,
    creativeTotals: enhancedCreativeTotals,
  };
};

// Data cleaning utility
export const cleanObjectData = (object, metrics) => {
  return object.map((entry) => {
    const cleaned = { ...entry };

    // Clean numeric fields
    for (const key of metrics) {
      if (NON_NUMERIC_COLUMNS.includes(key)) continue;
      cleaned[key] =
        parseFloat(cleaned[key]?.toString().replace(/,/g, "")) || 0;
    }

    // Clean all text fields that could be used for grouping
    Object.keys(cleaned).forEach((key) => {
      if (!metrics.includes(key) && key !== "Updated Date") {
        if (cleaned[key] && typeof cleaned[key] === "string") {
          cleaned[key] = cleaned[key].trim();
        } else if (cleaned[key]) {
          cleaned[key] = cleaned[key].toString().trim();
        }
      }
    });

    // Keep the Updated Date as is
    cleaned["Updated Date"] = entry["Updated Date"];

    return cleaned;
  });
};
