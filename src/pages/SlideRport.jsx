import SlideGeneratorSidebar from "@/components/slides/SlideGeneratorSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useData } from "@/contexts/dataContext";
import domtoimage from "dom-to-image";
import axios from "axios";
import React, { useCallback, useMemo } from "react";
import {
  Presentation,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  X,
  AlertTriangle,
} from "lucide-react";
import GDNSlide from "@/components/slides/GDNSlide";
import DiscoverySlide from "@/components/slides/DiscoverySlide";
import TitleSlide from "@/components/slides/TitleSlide";
import FacebookReachSlide01 from "@/components/slides/FacebookReachSlide01";
import FacebookReachSlide02 from "@/components/slides/FacebookReachSlide02";
import SectionSlide from "@/components/slides/SectionSlide";
import FacebookEngagementSlide01 from "@/components/slides/FacebookEngagementSlide01";
import FacebookEngagementSlide02 from "@/components/slides/FacebookEngagementSlide02";
import FacebookAwarenessSlide01 from "@/components/slides/FacebookAwarenessSlide01";
import FacebookAwarenessSlide02 from "@/components/slides/FacebookAwarenessSlide02";
import FacebookAwarenessSlide02PicTable from "@/components/slides/FacebookAwarenessSlide02PicTable";
import EndSlide from "@/components/slides/EndSlide";
import Overall from "@/components/slides/Overall";
import FacebookMessageSlide01 from "@/components/slides/FacebookMessageSlide01";
import FacebookMessageSlide02 from "@/components/slides/FacebookMessageSlide02";
import FacebookLeadSlide01 from "@/components/slides/FacebookLeadSlide01";
import FacebookLeadSlide02 from "@/components/slides/FacebookLeadSlide02";
import FacebookConversionSlide01 from "@/components/slides/FacebookConversionSlide01";
import FacebookConversionSlide02 from "@/components/slides/FacebookConversionSlide02";
import SEMConversionSlide from "@/components/slides/SEMConversionSlide";
import SEMClickSlide from "@/components/slides/SEMClickSlide";
import YoutubeSlide from "@/components/slides/YoutubeSlide";
import FacebookTrafficSlide01 from "@/components/slides/FacebookTrafficSlide01";
import FacebookTrafficSlide02 from "@/components/slides/FacebookTrafficSlide02";
import FacebookVideoSlide01 from "@/components/slides/FacebookVideoSlide01";
import FacebookVideoSlide02 from "@/components/slides/FacebookVideoSlide02";
import FacebookCatalogSlide01 from "@/components/slides/FacebookCatalogSlide01";
import FacebookCatalogSlide02 from "@/components/slides/FacebookCatalogSlide02";
import TiktokReachSlide01 from "@/components/slides/TiktokReachSlide01";
import TiktokVideoSlide01 from "@/components/slides/TiktokVideoSlide01";
import TiktokTrafficSlide01 from "@/components/slides/TiktokTrafficSlide01";
import TiktokLeadSlide01 from "@/components/slides/TiktokLeadSlide01";
import TiktokConversionSlide01 from "@/components/slides/TiktokConversionSlide01";
import LineReachSlide01 from "@/components/slides/LineReachSlide01";
import LineGainFriendsSlide01 from "@/components/slides/LineGainFriendsSlide01";
import TaboolaSlide from "@/components/slides/TaboolaSlide";
import { EXPORT_SLIDE_COMPONENT_LISTS } from "@/configs/exportSlideConfigs";
import MediaPlan from "@/components/slides/MediaPlan";
import { tableProcessing } from "@/utils/mediaPlanProcessing";
import ShoppingAdsSlide from "@/components/slides/ShoppingAdsSlide";
import PerformanceMaxSlide from "@/components/slides/PerformanceMaxSlide";
import TiktokConversionEcommerceSlide01 from "@/components/slides/TiktokConversionEcommerceSlide01";
import TiktokFollowerSlide01 from "@/components/slides/TiktokFollowerSlide01";
import MediaPlanBlank from "@/components/slides/MediaPlanBlank";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getExportableSlides } from "@/utils/exportSlideUtils";
import SlideRenderer from "@/components/slides/SlideRenderer";
import {
  FACEBOOK_SLIDES,
  GOOGLE_SLIDES,
  TIKTOK_SLIDES,
} from "@/configs/slideConfig";
import createAxiosInstance from "@/configs/axiosConfigs";
import { handleSlideTemplate } from "@/utils/slideTemplatehandler";
import AsiaHotelFBCatalog01 from "@/components/slides/asia-hotel/AsiaHotelFBCatalog01";
import AsiaHotelFBCatalog02 from "@/components/slides/asia-hotel/AsiaHotelFBCatalog02";
import AsiaHotelFBAwareness01 from "@/components/slides/asia-hotel/AsiaHotelFBAwareness01";
import AsiaHotelFBAwareness02 from "@/components/slides/asia-hotel/AsiaHotelFBAwareness02";
import AsiaHotelFBReach01 from "@/components/slides/asia-hotel/AsiaHotelFBReach01";
import AsiaHotelFBReach02 from "@/components/slides/asia-hotel/AsiaHotelFBReach02";
import AsiaHotelFBEngage01 from "@/components/slides/asia-hotel/AsiaHotelFBEngage01";
import AsiaHotelFBEngage02 from "@/components/slides/asia-hotel/AsiaHotelFBEngage02";
import AsiaHotelFBTraffic01 from "@/components/slides/asia-hotel/AsiaHotelFBTraffic01";
import AsiaHotelFBTraffic02 from "@/components/slides/asia-hotel/AsiaHotelFBTraffic02";
import AsiaHotelFBVideo01 from "@/components/slides/asia-hotel/AsiaHotelFBVideo01";
import AsiaHotelFBVideo02 from "@/components/slides/asia-hotel/AsiaHotelFBVideo02";
import AsiaHotelFBMessage01 from "@/components/slides/asia-hotel/AsiaHotelFBMessage01";
import AsiaHotelFBMessage02 from "@/components/slides/asia-hotel/AsiaHotelFBMessage02";
import AsiaHotelFBLead01 from "@/components/slides/asia-hotel/AsiaHotelFBLead01";
import AsiaHotelFBLead02 from "@/components/slides/asia-hotel/AsiaHotelFBLead02";
import AsiaHotelFBConv01 from "@/components/slides/asia-hotel/AsiaHotelFBConv01";
import AsiaHotelFBConv02 from "@/components/slides/asia-hotel/AsiaHotelFBConv02";
import NokkualokTiktokReach from "@/components/slides/nokkualok/NokkualokTiktokReach";
import OverallCustom from "@/components/custom-templates/OverallCustom";

function SlideReport() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [presentationUrl, setPresentationUrl] = React.useState(null);
  const [sheetsID, setSheetsID] = React.useState("");
  const [sheetsLink, setSheetsLink] = React.useState("");
  const [ableToGenerate, setAbleToGenerate] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [slideGenerated, setSlideGenerated] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [reportType, setReportType] = React.useState("Monthly Report");

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const {
    fetchData,
    enableDateRange,
    setEnableDateRange,
    notFoundSheetList,
    setNotFoundSheetList,
    slideDetectedList,
    setSlideDetectedList,
    enableSmartSlideDetection,
    template,
    setTemplate,
    enableCustomTemplate,
  } = useData();
  const [mediaPlanData, setMediaPlanData] = React.useState(null);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    // setReportType(event.target.value);
    setReportType(event);
  };

  const handleSheetsLinkChange = (event) => {
    const value = event.target.value;
    setSheetsLink(value);

    if (!value.trim()) {
      setSheetsID("");
      setAbleToGenerate(false);
      return;
    }

    const match = value.match(
      /^(https:\/\/docs\.google\.com\/spreadsheets\/d\/)([a-zA-Z0-9-_]+)/
    );

    if (!match) {
      setSheetsID("Invalid Sheets Link");
      setAbleToGenerate(false);
      return;
    }

    const sheetsId = match[2];
    setSheetsID(sheetsId);
    setAbleToGenerate(true);
  };

  const handleGenerate = async () => {
    if (!ableToGenerate) {
      setError("Please enter a valid Google Sheets link");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await fetchData(sheetsID);
      setSlideGenerated(true);
    } catch (error) {
      setError("Failed to generate slides: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnableDateRangeChange = (event) => {
    setEnableDateRange(event.target.checked);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // NEW: Convert all external images from Google Sheets to base64
  const convertGoogleSheetsImagesToBase64 = async () => {
    console.log("Converting Google Sheets images to base64...");

    // Find all images that look like external URLs (not already base64 or local)
    const externalImages = document.querySelectorAll(
      'img[src^="http"]:not([src^="data:"]):not([src*="localhost"])'
    );

    console.log(
      `Found ${externalImages.length} external images from Google Sheets`
    );

    const conversionPromises = Array.from(externalImages).map(
      async (img, index) => {
        const originalSrc = img.src;

        // Skip if already processed or not an external image
        if (
          originalSrc.startsWith("data:") ||
          originalSrc.includes("localhost")
        ) {
          return;
        }

        try {
          console.log(`Converting image ${index + 1}: ${originalSrc}`);

          // Method 1: Try direct fetch with multiple proxies
          const proxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(
              originalSrc
            )}`,
            `https://corsproxy.io/?${encodeURIComponent(originalSrc)}`,
            `https://cors-anywhere.herokuapp.com/${originalSrc}`,
          ];

          let success = false;

          for (const proxyUrl of proxies) {
            try {
              const response = await fetch(proxyUrl, {
                method: "GET",
                headers: {
                  Accept: "image/*",
                },
              });

              if (response.ok) {
                const blob = await response.blob();

                // Convert blob to base64
                const base64 = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });

                // Update image source
                img.src = base64;
                console.log(
                  `✓ Successfully converted image ${index + 1} using proxy`
                );
                success = true;
                break;
              }
            } catch (proxyError) {
              console.warn(`Proxy failed for image ${index + 1}:`, proxyError);
              continue;
            }
          }

          // Method 2: If proxies fail, try canvas method
          if (!success) {
            await new Promise((resolve, reject) => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const tempImg = new Image();

              tempImg.crossOrigin = "anonymous";

              tempImg.onload = () => {
                try {
                  canvas.width = tempImg.naturalWidth || tempImg.width;
                  canvas.height = tempImg.naturalHeight || tempImg.height;

                  ctx.drawImage(tempImg, 0, 0);

                  const base64 = canvas.toDataURL("image/png", 0.9);
                  img.src = base64;

                  console.log(
                    `✓ Successfully converted image ${index + 1} using canvas`
                  );
                  success = true;
                  resolve();
                } catch (canvasError) {
                  reject(canvasError);
                }
              };

              tempImg.onerror = () => {
                reject(new Error("Canvas image load failed"));
              };

              // Try with first proxy for canvas method
              tempImg.src = proxies[0];
            });
          }

          if (!success) {
            throw new Error("All conversion methods failed");
          }
        } catch (error) {
          console.error(`Failed to convert image ${index + 1}:`, error);

          // Create a styled placeholder that looks like the actual image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Get current image dimensions or use defaults
          const width = img.offsetWidth || img.width || 400;
          const height = img.offsetHeight || img.height || 300;

          canvas.width = width;
          canvas.height = height;

          // Create a professional-looking placeholder
          ctx.fillStyle = "#f8f9fa";
          ctx.fillRect(0, 0, width, height);

          // Add subtle gradient
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, "#f8f9fa");
          gradient.addColorStop(1, "#e9ecef");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // Add border
          ctx.strokeStyle = "#dee2e6";
          ctx.lineWidth = 1;
          ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

          // Add icon and text
          ctx.fillStyle = "#6c757d";
          ctx.font = `${Math.min(width, height) * 0.06}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Draw image icon
          const iconSize = Math.min(width, height) * 0.15;
          ctx.strokeStyle = "#adb5bd";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            width / 2 - iconSize / 2,
            height / 2 - iconSize / 2 - 20,
            iconSize,
            iconSize * 0.7
          );

          // Add text
          ctx.fillText("Image from Sheets", width / 2, height / 2 + 25);
          ctx.font = `${Math.min(width, height) * 0.04}px Arial`;
          ctx.fillStyle = "#adb5bd";
          ctx.fillText(`${width} × ${height}`, width / 2, height / 2 + 45);

          // Replace image with placeholder
          img.src = canvas.toDataURL("image/png");
          console.log(
            `Created professional placeholder for image ${index + 1}`
          );
        }
      }
    );

    // Wait for all conversions to complete
    await Promise.allSettled(conversionPromises);

    console.log("✓ Google Sheets image conversion complete");

    // Wait for DOM updates
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  // Ensure all images are fully loaded
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

  const handleExportAllSlides = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const axiosInstance = await createAxiosInstance();
      console.log("Starting export...");

      // Ensure all images are fully loaded
      await ensureImagesLoaded();

      // CRITICAL: Wait for table components to initialize their width detection
      // The AdvancedDataTable has delays up to 500ms for width detection
      console.log("Waiting for tables to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Lock all table dimensions BEFORE capture
      const lockTableDimensions = () => {
        const allTables = document.querySelectorAll("table");
        const lockedDimensions = [];

        allTables.forEach((table) => {
          const container = table.closest(".overflow-x-auto");
          if (container) {
            // Get computed styles to preserve spacing
            const computedContainerStyle = window.getComputedStyle(container);
            const computedTableStyle = window.getComputedStyle(table);

            // Store original dimensions and styles
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

            // Lock the table layout
            if (table.style.tableLayout === "fixed") {
              // If already fixed, lock all column widths
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

            // Lock container and table widths
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

          // Remove locked cell widths
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
      const slideComponents = getExportableSlides();
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
            cacheBust: true, // Changed to true to avoid caching issues
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

      console.log(`Captured ${slideData.length} slides, sending to backend...`);

      // Send to backend
      const response = await axiosInstance.post(
        "/data-sheets/create-multi-slide-presentation",
        {
          slides: slideData,
          presentationTitle:
            projectName.length > 0 ? projectName : "Monthly Performance Report",
        }
      );

      const result = response.data;
      console.log("Backend response:", result);

      setPresentationUrl(result.presentationUrl);
      window.open(result.presentationUrl, "_blank");
    } catch (error) {
      console.error("Multi-slide export failed:", error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const { isSheetNotFound, sheetNotFoundList } = useMemo(() => {
    return {
      isSheetNotFound: notFoundSheetList.length > 0,
      sheetNotFoundList: notFoundSheetList,
    };
  }, [notFoundSheetList]);

  const checkSlideDetected = useCallback(
    (slide) => {
      if (slideDetectedList.length === 0) {
        return false;
      }
      const lowerCaseSlide = slide.toLowerCase().trim();
      const result = slideDetectedList.some((item) => {
        const lowerCaseItem = item.toLowerCase().trim();
        return (
          lowerCaseItem.includes(lowerCaseSlide) ||
          lowerCaseSlide.includes(lowerCaseItem)
        );
      });
      // console.log("🎯 checkSlideDetected", result);
      return result;
    },
    [slideDetectedList]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Sidebar Component */}
      <SlideGeneratorSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        sheetsLink={sheetsLink}
        sheetsID={sheetsID}
        ableToGenerate={ableToGenerate}
        isGenerating={isGenerating}
        slideGenerated={slideGenerated}
        enableDateRange={enableDateRange}
        isExporting={isExporting}
        presentationUrl={presentationUrl}
        onSheetsLinkChange={handleSheetsLinkChange}
        onGenerate={handleGenerate}
        onEnableDateRangeChange={handleEnableDateRangeChange}
        onExportAllSlides={handleExportAllSlides}
        handleExportAllSlides={handleExportAllSlides}
        projectName={projectName}
        onProjectNameChange={handleProjectNameChange}
        reportType={reportType}
        onReportTypeChange={handleReportTypeChange}
      />

      {/* Main Content */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Presentation className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Automate Report
            </h1>
            {/* <button onClick={() => handleGetMediaPlan()}>TEST</button> */}
          </div>
          <div className="ml-auto text-sm text-slate-600">
            {/* Transform your Google Sheets data into beautiful presentation slides */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="space-y-6">
            {/* Status Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {presentationUrl && (
              <Alert className="border-green-200 bg-green-50 fixed top-20 right-10 z-50 w-fit">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 pr-8">
                  Presentation created successfully!
                  <a
                    href={presentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline hover:text-green-900 font-medium"
                  >
                    Open Presentation <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
                {/* <button
                  onClick={() => setPresentationUrl(null)}
                  className="absolute top-2 right-2 p-1 rounded-sm opacity-70 hover:opacity-100 hover:bg-green-100 transition-all"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4 text-green-600" />
                </button> */}
              </Alert>
            )}

            {/* <MediaPlan mediaPlanData={mediaPlanData} /> */}

            {/* Preview Panel */}
            {slideGenerated ? (
              enableCustomTemplate ? (
                <div className="w-full flex flex-col items-center gap-10">
                  <OverallCustom />
                </div>
              ) : enableSmartSlideDetection ? (
                <div className="w-full flex flex-col items-center gap-10">
                  <TitleSlide
                    projectName={projectName}
                    reportType={reportType}
                  />
                  <MediaPlanBlank />
                  <Overall />
                  <SlideRenderer
                    sectionData={{
                      title: "Facebook",
                      id: "facebook-section-component",
                    }}
                    checkSlideDetected={checkSlideDetected}
                    slideTypes={handleSlideTemplate(
                      FACEBOOK_SLIDES,
                      template,
                      "facebook"
                    )}
                  />
                  <SlideRenderer
                    sectionData={{
                      title: "Google",
                      id: "google-section-component",
                    }}
                    checkSlideDetected={checkSlideDetected}
                    slideTypes={GOOGLE_SLIDES}
                  />
                  <SlideRenderer
                    sectionData={{
                      title: "TikTok",
                      id: "tiktok-section-component",
                    }}
                    checkSlideDetected={checkSlideDetected}
                    slideTypes={handleSlideTemplate(
                      TIKTOK_SLIDES,
                      template,
                      "tiktok"
                    )}
                  />
                  <SlideRenderer
                    sectionData={{
                      title: "Line",
                      id: "line-section-component",
                    }}
                    checkSlideDetected={checkSlideDetected}
                    slideTypes={{
                      "Line Reach": [LineReachSlide01],
                      "Line Gain Friends": [LineGainFriendsSlide01],
                    }}
                  />
                  <SlideRenderer
                    sectionData={{
                      title: "Taboola",
                      id: "taboola-section-component",
                    }}
                    checkSlideDetected={checkSlideDetected}
                    slideTypes={{
                      Taboola: [TaboolaSlide],
                    }}
                  />
                  <EndSlide />
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-10">
                  <TitleSlide
                    projectName={projectName}
                    reportType={reportType}
                  />
                  <MediaPlanBlank />
                  <Overall />
                  <SectionSlide
                    title={"Facebook"}
                    componentID={"facebook-section-component"}
                  />
                  {template === "asia-hotel" ? (
                    <>
                      <AsiaHotelFBAwareness01 />
                      <AsiaHotelFBAwareness02 />
                      <AsiaHotelFBReach01 />
                      <AsiaHotelFBReach02 />
                      <AsiaHotelFBEngage01 />
                      <AsiaHotelFBEngage02 />
                      <AsiaHotelFBTraffic01 />
                      <AsiaHotelFBTraffic02 />
                      <AsiaHotelFBVideo01 />
                      <AsiaHotelFBVideo02 />
                      <AsiaHotelFBMessage01 />
                      <AsiaHotelFBMessage02 />
                      <AsiaHotelFBLead01 />
                      <AsiaHotelFBLead02 />
                      <AsiaHotelFBConv01 />
                      <AsiaHotelFBConv02 />
                      <AsiaHotelFBCatalog01 />
                      <AsiaHotelFBCatalog02 />
                    </>
                  ) : (
                    <>
                      <FacebookAwarenessSlide01 />
                      <FacebookAwarenessSlide02 />
                      <FacebookReachSlide01 />
                      <FacebookReachSlide02 />
                      <FacebookEngagementSlide01 />
                      <FacebookEngagementSlide02 />
                      <FacebookTrafficSlide01 />
                      <FacebookTrafficSlide02 />
                      <FacebookVideoSlide01 />
                      <FacebookVideoSlide02 />
                      <FacebookMessageSlide01 />
                      <FacebookMessageSlide02 />
                      <FacebookLeadSlide01 />
                      <FacebookLeadSlide02 />
                      <FacebookConversionSlide01 />
                      <FacebookConversionSlide02 />
                      <FacebookCatalogSlide01 />
                      <FacebookCatalogSlide02 />
                    </>
                  )}

                  <SectionSlide
                    title={"Google"}
                    componentID={"google-section-component"}
                  />
                  <SEMConversionSlide />
                  <SEMClickSlide />
                  <GDNSlide />
                  <DiscoverySlide />
                  <YoutubeSlide />
                  <ShoppingAdsSlide />
                  <PerformanceMaxSlide />
                  <SectionSlide
                    title={"Tiktok"}
                    componentID={"tiktok-section-component"}
                  />
                  {template === "nokkualok" ? (
                    <NokkualokTiktokReach />
                  ) : (
                    <TiktokReachSlide01 />
                  )}
                  <TiktokVideoSlide01 />
                  <TiktokTrafficSlide01 />
                  <TiktokFollowerSlide01 />
                  <TiktokLeadSlide01 />
                  <TiktokConversionSlide01 />
                  <TiktokConversionEcommerceSlide01 />
                  <SectionSlide
                    title={"Line"}
                    componentID={"line-section-component"}
                  />
                  <LineReachSlide01 />
                  <LineGainFriendsSlide01 />
                  <SectionSlide
                    title={"Taboola"}
                    componentID={"taboola-section-component"}
                  />
                  <TaboolaSlide />
                  <EndSlide />
                </div>
              )
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Presentation className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No slides generated yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Click the sidebar toggle button in the top-left corner to
                      open the configuration panel. Enter a valid Google Sheets
                      URL and click "Generate Slides" to create your
                      presentation preview.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      <Dialog
        open={isSheetNotFound}
        onOpenChange={(open) => {
          if (!open) {
            setNotFoundSheetList([]);
          }
        }}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault(); // Prevent closing on outside click
          }}
          className="max-w-lg gap-2"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Sheets Not Found
            </DialogTitle>
            <DialogDescription className="text-black">
              The following sheets were not found in your Google Spreadsheet.
              Please verify the sheet names are correct, or continue if these
              sheets are not required for your report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-2 max-h-48 overflow-y-auto">
            {sheetNotFoundList.map((sheet, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-red-50 text-red-800 rounded-md border border-red-800 font-medium"
              >
                {sheet}
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="default"
              onClick={() => setNotFoundSheetList([])}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Got It"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SlideReport;
