// utils/dataProcessors.js - Clean version without debug logs
import { NON_NUMERIC_COLUMNS } from "../configs/dataConfigs";

// Enhanced processor for advertising platforms (SEM, GDN, Disc, Youtube)
export const processAdvertisingData = (
  cleanedData,
  metrics,
  finalMetrics,
  groupBy = "Keyword",
  platform = "default"
) => {
  // Ensure finalMetrics is an array
  const safeMetrics = Array.isArray(finalMetrics) ? finalMetrics : [];

  if (!cleanedData || cleanedData.length === 0) {
    return {
      enhancedFieldData: {},
      enhancedTotals: Object.fromEntries(
        safeMetrics.map((m) => [m, "No Data"])
      ),
      allMetrics: safeMetrics,
    };
  }

  // console.log("cleanedData:", cleanedData);

  // Group by the specified field
  const summaryByField = cleanedData.reduce((acc, item) => {
    const fieldValue = item[groupBy] || "Unknown";
    const itemKey = Object.keys(item);

    if (!acc[fieldValue]) {
      // Initialize all metrics
      acc[fieldValue] = {
        ...Object.fromEntries(metrics.map((m) => [m, 0])),
        Engagements: 0,
      };

      // Initialize non-numeric fields
      NON_NUMERIC_COLUMNS.forEach((field) => {
        if (metrics.includes(field)) {
          acc[fieldValue][field] = "";
        }
      });
    }

    for (const key of metrics) {
      if (NON_NUMERIC_COLUMNS.includes(key)) {
        // Handle non-numeric fields - store the value directly
        if (
          item[key] &&
          (!acc[fieldValue][key] || acc[fieldValue][key] === "")
        ) {
          acc[fieldValue][key] = item[key];
        }
      } else {
        // Handle numeric fields - sum them up
        if (key === "Conversions") {
          // if item["Conversions"] is not available, use item["Conversion"] instead
          const numValue =
            Number(item["Conversions"]) || Number(item["Conversion"]) || 0;
          acc[fieldValue][key] += numValue;
        } else if (key === "Post Engagement") {
          itemKey.some((fKey) => {
            if (
              fKey.toLowerCase().includes(key.toLowerCase()) ||
              key.toLowerCase().includes(fKey.toLowerCase())
            ) {
              const numValue = Number(item[fKey]) || 0;
              acc[fieldValue]["Engagements"] += numValue;
              return true;
            }
          });
        } else {
          const numValue = Number(item[key]) || 0;
          acc[fieldValue][key] += numValue;
        }
        //for debugging
        if (key === "Conversions") {
          // console.log("🎯 fieldValue:", fieldValue);
          // console.log("🎯 key:", key);
          // console.log("🎯 item:", item);
          // console.log("🎯 item[key]:", item[key]);
          // console.log("🎯 acc[fieldValue][key]:", acc[fieldValue][key]);
          // console.log("numValue", numValue);
        }
      }
    }

    return acc;
  }, {});

  //for debugging
  // console.log("🎯 summaryByField:", summaryByField);

  if (groupBy === "Updated Date") {
    // console.log("🎯 summaryByField:", summaryByField);
  }

  // Add calculations for each field value
  const enhancedFieldData = {};
  Object.entries(summaryByField).forEach(([fieldValue, data]) => {
    const enhanced = { ...data };

    // Standard calculations
    const ctr =
      data.Impressions > 0 ? (data.Clicks / data.Impressions) * 100 : 0;
    const conRate =
      data.Clicks > 0 ? (data.Conversions / data.Clicks) * 100 : 0;

    // Use appropriate cost field based on platform
    const costField =
      platform === "Youtube" ? data.Spent || 0 : data.Spent || 0;

    const cpl = data.Conversions > 0 ? costField / data.Conversions : 0;
    const cpc = data.Clicks > 0 ? costField / data.Clicks : 0;
    const cpm =
      data.Impressions > 0 ? (costField * 1000) / data.Impressions : 0;
    const cpa = data.Conversions > 0 ? costField / data.Conversions : 0;
    const cpe = data.Engagements > 0 ? costField / data.Engagements : 0;
    const engagementRate =
      data.Reach > 0 ? (data.Engagements / data.Reach) * 100 : 0;

    const roas = data.Spent > 0 ? data["Conversion value"] / data.Spent : 0;

    // YouTube-specific calculations
    let cpv = 0;
    let viewRate = 0;

    if (platform === "Youtube") {
      // CPV calculation using "Video views" field
      const videoViews = data["Video views"] || 0;
      cpv = videoViews > 0 ? costField / videoViews : 0;

      // View Rate calculation (Video views / Impressions * 100)
      viewRate =
        data.Impressions > 0 ? (videoViews / data.Impressions) * 100 : 0;
    } else {
      // For other platforms, use VideoViews if available
      cpv = data.VideoViews > 0 ? costField / data.VideoViews : 0;
    }

    // Add all calculated metrics
    enhanced.ctr = Number(ctr.toFixed(2));
    enhanced.conRate = Number(conRate.toFixed(2));
    enhanced.cpl = Number(cpl.toFixed(2));
    enhanced.cpc = Number(cpc.toFixed(2));
    enhanced.cpm = Number(cpm.toFixed(2));
    enhanced.cpv = Number(cpv.toFixed(2));
    enhanced.cpe = Number(cpe.toFixed(2));
    enhanced.cpa = Number(cpa.toFixed(2));
    enhanced.engagementRate = Number(engagementRate.toFixed(2));
    enhanced.roas = Number(roas.toFixed(2));

    // Add viewRate for YouTube
    if (platform === "Youtube") {
      enhanced.viewRate = Number(viewRate.toFixed(2));
    }

    enhancedFieldData[fieldValue] = enhanced;
  });

  // Calculate totals
  const totals = {
    ...Object.fromEntries(metrics.map((m) => [m, 0])),
    Engagements: 0,
  };

  // console.log("🎯 summaryByField:", summaryByField);

  Object.values(summaryByField).forEach((fieldValues) => {
    // console.log("🎯Totals - fieldValues:", fieldValues);
    for (const key of metrics) {
      if (key === "Post Engagement") {
        totals["Engagements"] += fieldValues["Engagements"];
      } else totals[key] += fieldValues[key];
    }
  });

  // console.log("🎯 totals:", totals);

  // Add calculated totals
  const totalCtr =
    totals.Impressions > 0 ? (totals.Clicks / totals.Impressions) * 100 : 0;
  const totalConRate =
    totals.Clicks > 0 ? (totals.Conversions / totals.Clicks) * 100 : 0;

  // Use appropriate cost field for totals
  const totalCostField =
    platform === "Youtube" ? totals.Spent || 0 : totals.Spent || 0;

  const totalCpl =
    totals.Conversions > 0 ? totalCostField / totals.Conversions : 0;
  const totalCpc = totals.Clicks > 0 ? totalCostField / totals.Clicks : 0;
  const totalCpm =
    totals.Impressions > 0 ? (totalCostField * 1000) / totals.Impressions : 0;
  const totalCpe =
    totals.Engagements > 0 ? totalCostField / totals.Engagements : 0;
  const totalCpa =
    totals.Conversions > 0 ? totalCostField / totals.Conversions : 0;
  const totalEngagementRate =
    totals.Reach > 0 ? (totals.Engagements / totals.Reach) * 100 : 0;

  const totalRoas =
    totals.Spent > 0 ? totals["Conversion value"] / totals.Spent : 0;

  // YouTube-specific total calculations
  let totalCpv = 0;
  let totalViewRate = 0;

  if (platform === "Youtube") {
    const totalVideoViews = totals["Video views"] || 0;
    totalCpv = totalVideoViews > 0 ? totalCostField / totalVideoViews : 0;
    totalViewRate =
      totals.Impressions > 0 ? (totalVideoViews / totals.Impressions) * 100 : 0;
  } else {
    totalCpv = totals.VideoViews > 0 ? totalCostField / totals.VideoViews : 0;
  }

  const enhancedTotals = {
    ...totals,
    ctr: Number(totalCtr.toFixed(2)),
    conRate: Number(totalConRate.toFixed(2)),
    cpl: Number(totalCpl.toFixed(2)),
    cpc: Number(totalCpc.toFixed(2)),
    cpm: Number(totalCpm.toFixed(2)),
    cpv: Number(totalCpv.toFixed(2)),
    cpe: Number(totalCpe.toFixed(2)),
    cpa: Number(totalCpa.toFixed(2)),
    engagementRate: Number(totalEngagementRate.toFixed(2)),
    roas: Number(totalRoas.toFixed(2)),
  };

  // Add viewRate for YouTube totals
  if (platform === "Youtube") {
    enhancedTotals.viewRate = Number(totalViewRate.toFixed(2));
  }

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
      case "cpv":
        // Ensure both values are properly converted to numbers
        let views = data.views;
        let cost = data.spent;

        // Convert views to number if it's a string
        if (typeof views === "string") {
          // Remove leading zeros and convert to number
          views = parseFloat(views.replace(/^0+/, "") || "0") || 0;
        } else {
          views = Number(views) || 0;
        }

        // Ensure cost is a number
        cost = Number(cost) || 0;

        const cpvResult = views > 0 ? Number((cost / views).toFixed(6)) : 0;
        enhanced[field.key] = cpvResult;
        break;

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
          data.clicks > 0 ? Number((data.spent / data.clicks).toFixed(2)) : 0;
        break;

      case "cvr":
        try {
          // Ensure we have valid numbers
          const clicks = parseFloat(data.clicks) || 0;
          const conversions = parseFloat(data.conversions) || 0;

          // Calculate CVR with proper validation
          let cvrResult = 0;

          if (clicks > 0 && isFinite(clicks) && isFinite(conversions)) {
            const rawCvr = (conversions / clicks) * 100;

            // Validate the calculation result
            if (isFinite(rawCvr) && !isNaN(rawCvr)) {
              cvrResult = Math.round(rawCvr * 100) / 100; // Round to 2 decimal places
            }
          }

          // Always assign a valid number, never null
          enhanced[field.key] = cvrResult;
        } catch (error) {
          console.error("CVR calculation error:", error);
          enhanced[field.key] = 0;
        }
        break;

      case "cpa":
        enhanced[field.key] =
          data.conversions > 0
            ? Number((data.spent / data.conversions).toFixed(2))
            : 0;
        break;

      case "cpr":
        enhanced[field.key] =
          data.reach > 0
            ? Number(((data.spent * 1000) / data.reach).toFixed(2))
            : 0;
        break;

      case "cpl":
        enhanced[field.key] =
          data.conversions > 0
            ? Number((data.spent / data.conversions).toFixed(2))
            : 0;
        break;

      case "cpm":
        enhanced[field.key] =
          data.impressions > 0
            ? Number(((data.spent * 1000) / data.impressions).toFixed(2))
            : 0;
        break;

      case "cpe":
        enhanced[field.key] =
          data.engagements > 0
            ? Number((data.spent / data.engagements).toFixed(2))
            : 0;
        break;

      case "cpf":
        enhanced[field.key] =
          data.follows > 0 ? Number((data.spent / data.follows).toFixed(2)) : 0;
        break;

      case "engagementRate":
        enhanced[field.key] =
          data.reach > 0
            ? Number(((data.engagements / data.reach) * 100).toFixed(2))
            : 0;
        break;

      case "viewRate":
        enhanced[field.key] =
          data.impressions > 0
            ? Number(((data.views / data.impressions) * 100).toFixed(2))
            : 0;
        break;

      case "viewRate6sec":
        enhanced[field.key] =
          data.impressions > 0
            ? Number(((data.view6sec / data.impressions) * 100).toFixed(2)) // Changed from views6sec to view6sec
            : 0;
        break;

      case "cpv6sec":
        let view6sec = data.view6sec; // Changed from views6sec to view6sec
        let cost6sec = data.spent;

        if (typeof view6sec === "string") {
          // Remove leading zeros and convert to number
          view6sec = parseFloat(view6sec.replace(/^0+/, "") || "0") || 0;
        } else {
          view6sec = Number(view6sec) || 0;
        }

        if (typeof cost6sec === "string") {
          // Remove leading zeros and convert to number
          cost6sec = parseFloat(cost6sec.replace(/^0+/, "") || "0") || 0;
        } else {
          cost6sec = Number(cost6sec) || 0; // Added else block for consistency
        }

        const cpv6secResult =
          view6sec > 0 ? Number((cost6sec / view6sec).toFixed(6)) : 0;
        enhanced[field.key] = cpv6secResult;
        break;

      case "roas":
        // Try to find conversion value from multiple possible field names
        // Priority order: purchaseConValue > conversionValue > "Conversion value"
        const conversionValueFields = [
          "purchaseConValue",
          "conversionValue",
          "Conversion value",
        ];

        let conversionValue = 0;

        // Find the first available field with a valid value
        for (const fieldName of conversionValueFields) {
          const value = Number(data[fieldName]) || 0;
          if (value > 0) {
            conversionValue = value;
            break;
          }
        }

        const spent = Number(data.spent) || 0;

        // Calculate ROAS: Conversion Value / Spent
        enhanced[field.key] =
          spent > 0 ? Number((conversionValue / spent).toFixed(2)) : 0;
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

  // for debugging
  // console.log("🎯 filterBy:", filterBy);
  // console.log("🎯 filterValue:", filterValue);
  // console.log("🎯 data:", data);

  return data.filter((item, index) => {
    const itemValue = item[filterBy];

    // for debugging
    if (index >= 0 && index < 10) {
      // console.log("🎯 itemValue:", itemValue);
      // console.log("🎯 filterValue:", filterValue);
      // console.log(
      //   "🎯 result:",
      //   itemValue.toString().toLowerCase() === filterValue.toLowerCase()
      // );
    }

    function removeFinalS(str) {
      if (str.endsWith("s")) {
        return str.slice(0, -1);
      }
      return str;
    }

    return (
      itemValue &&
      (itemValue.toString().toLowerCase() === filterValue.toLowerCase() ||
        itemValue.toString().toLowerCase() ===
          removeFinalS(filterValue.toLowerCase()))
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
  // console.log("🎯 cleanedData:", cleanedData);

  // Apply filtering if specified
  let processedData = [...cleanedData];

  if (filterOptions.filterBy && filterOptions.filterValue) {
    // for debugging
    // console.log("🎯 filterOptions:", filterOptions);

    processedData = filterDataByField(
      cleanedData,
      filterOptions.filterBy,
      filterOptions.filterValue
    );
  }

  // console.log("processData:", processedData);

  // for debugging
  // console.log("🎯 processedData:", processedData);

  const CON_VALUE_KEY = [
    "websitePurchasesConversionValue",
    "websiteConversionValue",
    "purchaseConValue",
  ];

  // Process data for Performance by Audiences table
  const audienceData = processedData.reduce((acc, item) => {
    const audienceKey = item[config.audienceGroupBy] || "Unknown";

    if (!acc[audienceKey]) {
      acc[audienceKey] = {};
      config.fields.forEach((field) => {
        acc[audienceKey][field.key] = 0;
      });

      // for convalue initialization
      acc[audienceKey]["conversionValue"] = 0;
    }

    config.fields.forEach((field) => {
      if (CON_VALUE_KEY.includes(field.key)) {
        const sourceValue = item[field.sourceField];
        acc[audienceKey]["conversionValue"] += sourceValue || 0;
      } else {
        const sourceValue = item[field.sourceField];
        acc[audienceKey][field.key] += sourceValue || 0;
      }
    });

    return acc;
  }, {});

  // console.log("audienceData:", audienceData);

  // Process data for Performance by Creatives table
  const creativeData = processedData.reduce((acc, item) => {
    const creativeKey = item[config.creativeGroupBy] || "Unknown";

    if (!acc[creativeKey]) {
      acc[creativeKey] = {};
      config.fields.forEach((field) => {
        acc[creativeKey][field.key] = 0;
      });

      // for convalue initialization
      acc[creativeKey]["conversionValue"] = 0;
    }

    config.fields.forEach((field) => {
      if (CON_VALUE_KEY.includes(field.key)) {
        const sourceValue = item[field.sourceField];
        acc[creativeKey]["conversionValue"] += sourceValue || 0;
      } else {
        const sourceValue = item[field.sourceField];
        acc[creativeKey][field.key] += sourceValue || 0;
      }
    });

    return acc;
  }, {});

  // console.log("creativeData:", creativeData);

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
    Object.keys(item).forEach((key) => {
      acc[key] = (acc[key] || 0) + item[key];
    });
    return acc;
    // config.fields.forEach((field) => {
    //   if (CON_VALUE_KEY.includes(field.key)) {
    //     acc["conversionValue"] =
    //       (acc["conversionValue"] || 0) + item["conversionValue"];
    //   } else {
    //     acc[field.key] = (acc[field.key] || 0) + item[field.key];
    //   }
    // });
    // return acc;
  }, {});

  // console.log("audienceTotals:", audienceTotals);

  const enhancedAudienceTotals = {
    ...audienceTotals,
    ...calculateEnhancedMetrics(audienceTotals, config.calculatedFields),
  };

  // Calculate totals for creative data
  const creativeTotals = Object.values(creativeData).reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      acc[key] = (acc[key] || 0) + item[key];
    });
    return acc;
    // config.fields.forEach((field) => {
    //   if (CON_VALUE_KEY.includes(field.key)) {
    //     acc["conversionValue"] =
    //       (acc["conversionValue"] || 0) + item["conversionValue"];
    //   } else {
    //     acc[field.key] = (acc[field.key] || 0) + item[field.key];
    //   }
    // });
    // return acc;
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

      let value = cleaned[key];

      // Convert to string first, handle null/undefined
      if (value === null || value === undefined) {
        value = "0";
      } else {
        value = value.toString().replace(/,/g, "");
      }

      // Remove leading zeros for problematic fields
      if (typeof value === "string" && value.match(/^0+\d/)) {
        value = value.replace(/^0+/, "") || "0";
      }

      // Parse to number
      const numericValue = parseFloat(value) || 0;
      cleaned[key] = numericValue;
    }

    // Clean all text fields that could be used for grouping
    Object.keys(cleaned).forEach((key) => {
      if (!metrics.includes(key) && key !== "Updated Date" && key !== "Date") {
        if (cleaned[key] && typeof cleaned[key] === "string") {
          cleaned[key] = cleaned[key].trim();
        } else if (cleaned[key]) {
          cleaned[key] = cleaned[key].toString().trim();
        }
      }
    });

    // Keep the Updated Date as is
    cleaned["Updated Date"] = entry["Updated Date"] || entry["Date"];

    return cleaned;
  });
};
