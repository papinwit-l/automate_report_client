import SEMSlide from "@/components/slides/SEMSlide";
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
import React from "react";
import {
  Presentation,
  CheckCircle,
  AlertCircle,
  ExternalLink,
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
  const [reportType, setReportType] = React.useState("");

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const {
    fetchData,
    enableDateRange,
    setEnableDateRange,
    fetchFacebookPicture,
  } = useData();

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
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

  const handleExportAllSlides = async () => {
    //add await 5 seconds delay
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsExporting(true);
    setError(null);

    try {
      console.log("Starting multi-slide export process...");

      // Define all your slide components with their IDs and titles
      const slideComponents = [
        { id: "sem-component", title: "SEM Performance" },
        { id: "gdn-component", title: "GDN Performance" },
        { id: "discovery-component", title: "Discovery Performance" },
        { id: "facebook-awareness-component", title: "Facebook Awareness" },
        { id: "facebook-reach-component", title: "Facebook Reach" },
        { id: "facebook-engagement-component", title: "Facebook Engagement" },
      ];

      // Capture all components
      const slideData = [];

      for (const slide of slideComponents) {
        const element = document.getElementById(slide.id);
        if (!element) {
          console.warn(`Component ${slide.id} not found, skipping...`);
          continue;
        }

        console.log(`Capturing ${slide.title}...`);
        const imageData = await domtoimage.toPng(element, {
          quality: 0.95,
          bgcolor: "#ffffff",
          width: element.offsetWidth,
          height: element.offsetHeight,
          filter: (node) => true,
        });

        slideData.push({
          imageData: imageData,
          title: slide.title,
        });
      }

      if (slideData.length === 0) {
        throw new Error("No slide components found to export");
      }

      console.log(`Captured ${slideData.length} slides, sending to backend...`);

      // Send all slides to backend
      const response = await axios.post(
        "http://localhost:8000/data-sheets/create-multi-slide-presentation",
        {
          slides: slideData,
          presentationTitle: "Monthly Performance Report",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
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
              Slide Report Generator
            </h1>
            <button onClick={() => fetchFacebookPicture(sheetsID)}>TEST</button>
          </div>
          <div className="ml-auto text-sm text-slate-600">
            Transform your Google Sheets data into beautiful presentation slides
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Status Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {presentationUrl && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Presentation created successfully!{" "}
                  <a
                    href={presentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline hover:text-green-900 font-medium"
                  >
                    Open Presentation <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Panel */}
            {slideGenerated ? (
              <div className="w-full flex flex-col items-center gap-10">
                <TitleSlide projectName={projectName} reportType={reportType} />
                <Overall />
                <SectionSlide
                  title={"Facebook"}
                  componentID={"facebook-section-component"}
                />
                {/* <FacebookAwarenessSlide01 />
                <FacebookAwarenessSlide02 />
                <FacebookAwarenessSlide02PicTable /> */}
                <FacebookReachSlide01 />
                <FacebookReachSlide02 />
                <FacebookEngagementSlide01 />
                <FacebookEngagementSlide02 />
                <FacebookMessageSlide01 />
                <FacebookMessageSlide02 />
                <FacebookLeadSlide01 />
                <FacebookLeadSlide02 />
                <FacebookConversionSlide01 />
                <FacebookConversionSlide02 />
                <SectionSlide
                  title={"Google"}
                  componentID={"google-section-component"}
                />
                <SEMSlide />
                <GDNSlide />
                <DiscoverySlide />
                <EndSlide />
              </div>
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
    </div>
  );
}

export default SlideReport;
