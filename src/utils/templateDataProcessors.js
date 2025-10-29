export const tableUtilsMapping = (item) => {
  if (item.trim().toLowerCase() === "conrate") return "cvr";
  if (item.trim().toLowerCase() === "engagementrate") return "engagementRate";
  if (item.trim().toLowerCase() === "conversion value")
    return "conversionValue";
  return item.trim().toLowerCase();
};
