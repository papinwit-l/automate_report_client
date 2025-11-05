export const tableUtilsMapping = (item) => {
  if (item.trim().toLowerCase() === "conrate") return "cvr";
  if (item.trim().toLowerCase() === "engagementrate") return "engagementRate";
  if (item.trim().toLowerCase() === "conversion value")
    return "conversionValue";
  return item.trim().toLowerCase();
};

export const formatMetricName = (metric) => {
  switch (metric.toLowerCase()) {
    case "ad group name":
      return "Ad group name";
    case "ad set name":
      return "Ad set name";
    case "channel":
      return "Channel";
    case "ctr":
      return "%CTR";
    case "conrate":
    case "cvr":
      return "%Con Rate";
    case "cpl":
      return "CPL";
    case "impressions":
      return "Impressions";
    case "clicks":
      return "Clicks";
    case "cpc":
      return "CPC";
    case "conversions":
      return "Conversions";
    case "spent":
      return "Spent";
    case "reach":
      return "Reach";
    case "frequency":
      return "Frequency";
    case "cpa":
      return "CPA";
    case "cpr":
      return "CPR";
    case "cpv":
      return "CPV";
    case "keyword":
      return "Keyword";
    case "cpm":
      return "CPM";
    case "engagements":
      return "Engagement";
    case "engagementrate":
      return "%Engage Rate";
    case "viewrate":
      return "%View Rate";
    case "messages":
      return "Messages";
    case "cpe":
      return "CPE";
    case "purchase conversion value":
    case "purchaseconvalue":
    case "conversion value":
    case "conversionvalue":
      return "Con value";
    case "roas":
      return "ROAS";
    case "view6sec":
      return "6-second video views";
    case "viewrate6sec":
      return "%View Rate (6 sec)";
    case "cpv6sec":
      return "CPV (6 sec)";
    case "follows":
      return "Followers";
    case "cpf":
      return "CPFollow";
    default:
      return metric
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
};

export const defaultFormatValue = (value, metric) => {
  if (value === null || value === undefined) return "0";

  const metricLower = metric.toLowerCase();
  switch (metricLower) {
    case "ctr":
    case "conrate":
    case "cvr":
    case "engagementrate":
      return `${Number(value).toFixed(2)}%`;
    case "cpl":
    case "spent":
    case "cpc":
    case "cpr":
    case "cpm":
    case "cpe":
      return `${Number(value).toFixed(2)}`;
    case "impressions":
    case "clicks":
    case "conversions":
    case "reach":
    case "engagements":
      return Number(value).toLocaleString();
    case "frequency":
      return Number(value).toFixed(2);
    default:
      return value.toString();
  }
};
