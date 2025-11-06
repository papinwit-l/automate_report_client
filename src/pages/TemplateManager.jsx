import TemplateContent from "@/components/template-manager/TemplateContent";
import TemplateManagerHeader from "@/components/template-manager/TemplateManagerHeader";
import TemplateManagerToolbar from "@/components/template-manager/TemplateManagerToolbar";
import createAxiosInstance from "@/configs/axiosConfigs";
import { START_TEMPLATES } from "@/configs/templateManagerConfig";
import React, { useState } from "react";
import domtoimage from "dom-to-image";
import { getExportableSlidesV2 } from "@/utils/exportSlideUtils";

function TemplateManager() {
  const [slideTemplates, setSlideTemplates] = useState(START_TEMPLATES);

  const [projectName, setProjectName] = useState("");

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [presentationUrl, setPresentationUrl] = useState(null);

  const ensureImagesLoaded = async () => {
    console.log("Ensuring all images are fully loaded...");

    const allImages = document.querySelectorAll("img");

    const imagePromises = Array.from(allImages).map((img) => {
      return new Promise((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          const timeout = setTimeout(() => {
            console.warn(`Image load timeout: ${img.src}`);
            resolve(); // Don't block on timeout
          }, 10000); // 10 second timeout

          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };

          img.onerror = () => {
            clearTimeout(timeout);
            console.warn(`Image failed to load: ${img.src}`);
            resolve(); // Don't block on errors
          };
        }
      });
    });

    await Promise.all(imagePromises);
    console.log("All images processed");
  };

  const sendSlidesInBatches = async (
    axiosInstance,
    slides,
    presentationTitle,
    batchSize = 4
  ) => {
    const batches = [];
    for (let i = 0; i < slides.length; i += batchSize) {
      batches.push(slides.slice(i, i + batchSize));
    }

    console.log(
      `Sending ${slides.length} slides in ${batches.length} batches of ${batchSize}...`
    );

    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    let finalPresentationUrl = null;

    for (let i = 0; i < batches.length; i++) {
      console.log(
        `Sending batch ${i + 1}/${batches.length} (${
          batches[i].length
        } slides)...`
      );

      try {
        const response = await axiosInstance.post(
          "/data-sheets/create-multi-slide-presentation",
          {
            slides: batches[i],
            presentationTitle: presentationTitle,
            sessionId: sessionId,
            batchIndex: i,
            totalBatches: batches.length,
            isFirstBatch: i === 0,
            isLastBatch: i === batches.length - 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 180000, // 3 minutes per batch
          }
        );

        console.log(`✓ Batch ${i + 1} sent successfully`);

        // Store the presentation URL from the last batch
        if (response.data.presentationUrl) {
          finalPresentationUrl = response.data.presentationUrl;
        }
      } catch (error) {
        console.error(`Failed to send batch ${i + 1}:`, error);
        throw new Error(
          `Batch ${i + 1} failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }

    return finalPresentationUrl;
  };

  const handleExportAllSlides = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const axiosInstance = await createAxiosInstance();
      console.log("Starting export...");

      // Ensure all images are fully loaded
      await ensureImagesLoaded();

      // CRITICAL: Wait for table components to initialize their width detection
      console.log("Waiting for tables to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Lock all table dimensions BEFORE capture
      const lockTableDimensions = () => {
        const allTables = document.querySelectorAll("table");
        const lockedDimensions = [];

        allTables.forEach((table) => {
          const container = table.closest(".overflow-x-auto");
          if (container) {
            const computedContainerStyle = window.getComputedStyle(container);
            const computedTableStyle = window.getComputedStyle(table);

            const tableRect = table.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const originalStyles = {
              containerOverflow: container.style.overflow,
              containerWidth: container.style.width,
              containerPadding: container.style.padding,
              containerMargin: container.style.margin,
              tableWidth: table.style.width,
              tableTableLayout: table.style.tableLayout,
              tableMargin: table.style.margin,
            };

            if (table.style.tableLayout === "fixed") {
              const cells = table.querySelectorAll("th, td");
              cells.forEach((cell) => {
                const cellRect = cell.getBoundingClientRect();
                if (cellRect.width > 0) {
                  cell.style.width = `${cellRect.width}px`;
                  cell.style.minWidth = `${cellRect.width}px`;
                  cell.style.maxWidth = `${cellRect.width}px`;
                }
              });
            }

            container.style.width = `${containerRect.width}px`;
            container.style.minWidth = `${containerRect.width}px`;
            container.style.padding = computedContainerStyle.padding;
            container.style.margin = computedContainerStyle.margin;
            container.style.overflow = "visible";

            table.style.width = `${tableRect.width}px`;
            table.style.minWidth = `${tableRect.width}px`;
            table.style.margin = computedTableStyle.margin;

            lockedDimensions.push({ container, table, originalStyles });

            console.log(
              `Locked table: ${tableRect.width}px x ${tableRect.height}px`
            );
          }
        });

        return lockedDimensions;
      };

      const restoreTableDimensions = (lockedDimensions) => {
        lockedDimensions.forEach(({ container, table, originalStyles }) => {
          container.style.overflow = originalStyles.containerOverflow;
          container.style.width = originalStyles.containerWidth;
          container.style.minWidth = "";
          container.style.padding = originalStyles.containerPadding;
          container.style.margin = originalStyles.containerMargin;

          table.style.width = originalStyles.tableWidth;
          table.style.minWidth = "";
          table.style.tableLayout = originalStyles.tableTableLayout;
          table.style.margin = originalStyles.tableMargin;

          const cells = table.querySelectorAll("th, td");
          cells.forEach((cell) => {
            if (
              cell.style.width &&
              cell.style.minWidth &&
              cell.style.maxWidth
            ) {
              cell.style.width = "";
              cell.style.minWidth = "";
              cell.style.maxWidth = "";
            }
          });
        });
      };

      const lockedDimensions = lockTableDimensions();

      // Wait for layout to settle after locking
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Define slide components
      const slideComponents = getExportableSlidesV2();
      const slideData = [];

      for (const slide of slideComponents) {
        const element = document.getElementById(slide.id);
        if (!element) {
          console.warn(`Component ${slide.id} not found, skipping...`);
          continue;
        }

        console.log(`Capturing ${slide.title}...`);

        // Force a reflow before capture
        element.offsetHeight;

        try {
          const imageData = await domtoimage.toPng(element, {
            quality: 0.95,
            bgcolor: "#ffffff",
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true,
            useCORS: true,
            allowTaint: true,
            filter: (node) => {
              if (node.tagName === "SCRIPT") return false;
              if (node.classList && node.classList.contains("exclude-export"))
                return false;
              return true;
            },
            style: {
              transform: "scale(1)",
              "transform-origin": "top left",
            },
          });

          slideData.push({
            imageData: imageData,
            title: slide.title,
          });

          console.log(`✓ Successfully captured ${slide.title}`);
        } catch (captureError) {
          console.error(`Failed to capture ${slide.title}:`, captureError);

          // Fallback: Try JPEG format
          try {
            console.log(`Retrying ${slide.title} with JPEG...`);

            const fallbackImageData = await domtoimage.toJpeg(element, {
              quality: 0.9,
              bgcolor: "#ffffff",
              width: element.offsetWidth,
              height: element.offsetHeight,
              cacheBust: true,
              useCORS: true,
              allowTaint: true,
            });

            slideData.push({
              imageData: fallbackImageData,
              title: slide.title,
            });

            console.log(`✓ Captured ${slide.title} with JPEG fallback`);
          } catch (fallbackError) {
            console.error(
              `Both methods failed for ${slide.title}`,
              fallbackError
            );

            const errorCanvas = document.createElement("canvas");
            const errorCtx = errorCanvas.getContext("2d");
            errorCanvas.width = 1200;
            errorCanvas.height = 800;

            errorCtx.fillStyle = "#ffffff";
            errorCtx.fillRect(0, 0, 1200, 800);
            errorCtx.fillStyle = "#dc3545";
            errorCtx.font = "24px Arial";
            errorCtx.textAlign = "center";
            errorCtx.fillText(`Failed to capture: ${slide.title}`, 600, 400);

            slideData.push({
              imageData: errorCanvas.toDataURL("image/png"),
              title: slide.title,
            });

            console.log(`Created error slide for ${slide.title}`);
          }
        }
      }

      // Restore table dimensions
      restoreTableDimensions(lockedDimensions);

      if (slideData.length === 0) {
        throw new Error("No slides were captured successfully.");
      }

      console.log(`Captured ${slideData.length} slides, sending in batches...`);

      // CHANGED: Send slides in batches instead of all at once
      const presentationUrl = await sendSlidesInBatches(
        axiosInstance,
        slideData,
        projectName.length > 0 ? projectName : "Monthly Performance Report",
        4 // Send 4 slides per batch (adjust based on your needs)
      );

      if (!presentationUrl) {
        throw new Error("No presentation URL received from server");
      }

      console.log("Presentation created successfully:", presentationUrl);

      setPresentationUrl(presentationUrl);
      window.open(presentationUrl, "_blank");
    } catch (error) {
      console.error("Multi-slide export failed:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <TemplateManagerHeader
        slideTemplates={slideTemplates}
        setSlideTemplates={setSlideTemplates}
      />
      <div className="flex-1 flex min-h-0">
        <TemplateManagerToolbar
          slideTemplates={slideTemplates}
          setSlideTemplates={setSlideTemplates}
        />
        <TemplateContent slides={slideTemplates} />
      </div>
    </div>
  );
}

export default TemplateManager;
