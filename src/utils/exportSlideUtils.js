import { SLIDE_ORDER } from "@/configs/exportSlideConfigs";

export const getExportableSlides = () => {
  const exportableElements = document.querySelectorAll(
    '[data-exportable="true"]'
  );
  const elementsMap = new Map();

  // Create a map of exportable elements
  Array.from(exportableElements).forEach((element) => {
    elementsMap.set(element.id, {
      id: element.id,
      title: element.getAttribute("data-export-title") || element.id,
    });
  });

  const result = SLIDE_ORDER.filter((id) => elementsMap.has(id)).map((id) =>
    elementsMap.get(id)
  );

  // console.log("🎯 getExportableSlides", result);

  return result;
};

export const getExportableSlidesV2 = () => {
  const exportableElements = document.querySelectorAll(
    '[data-exportable="true"]'
  );

  console.log("🎯 exportableElements", exportableElements);

  const elementsMap = new Map();

  // Create a map of exportable elements
  Array.from(exportableElements).forEach((element) => {
    elementsMap.set(element.id, {
      id: element.id,
      title: element.getAttribute("data-export-title") || element.id,
    });
  });

  // const result = SLIDE_ORDER.filter((id) => elementsMap.has(id)).map((id) =>
  //   elementsMap.get(id)
  // );

  const result = Array.from(elementsMap.values()).sort((a, b) => {
    const numA = parseInt(a.id.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.id.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  });

  console.log("🎯 getExportableSlides", result);

  return result;
};
