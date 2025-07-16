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
import React from "react";
import {
  Presentation,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import GDNSlide from "@/components/slides/GDNSlide";

function SlideReport() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [presentationUrl, setPresentationUrl] = React.useState(null);
  const [sheetsID, setSheetsID] = React.useState("");
  const [sheetsLink, setSheetsLink] = React.useState("");
  const [ableToGenerate, setAbleToGenerate] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [slideGenerated, setSlideGenerated] = React.useState(false);

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { fetchData, enableDateRange, setEnableDateRange } = useData();

  const handleExportToSlides = async () => {
    setIsExporting(true);
    setError(null);

    try {
      console.log("Starting export process...");

      const element = document.getElementById("overall-component");
      if (!element) {
        throw new Error(
          "Component not found. Make sure the Overall component has id='overall-component'"
        );
      }

      console.log("Capturing component...");
      const imageData = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        filter: (node) => {
          return true;
        },
      });

      console.log("Component captured successfully");

      console.log("Sending to backend...");
      const response = await fetch(
        "http://localhost:8000/data-sheets/create-presentation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: imageData,
            title: "Monthly Report",
            slideTitle: "Overall Performance",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Backend response:", result);

      setPresentationUrl(result.presentationUrl);
      window.open(result.presentationUrl, "_blank");
    } catch (error) {
      console.error("Export failed:", error);
      setError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddSlide = async () => {
    if (!presentationUrl) {
      setError("Please create a presentation first");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const urlMatch = presentationUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!urlMatch) {
        throw new Error("Invalid presentation URL");
      }
      const presentationId = urlMatch[1];

      const element = document.getElementById("overall-component");
      const imageData = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: element.offsetWidth + "px",
          height: element.offsetHeight + "px",
        },
      });

      const response = await fetch(
        "http://localhost:8000/data-sheets/add-slide",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            presentationId: presentationId,
            imageData: imageData,
            slideTitle: "Additional Slide",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
    } catch (error) {
      console.error("Add slide failed:", error);
      setError(error.message);
    } finally {
      setIsExporting(false);
    }
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
        onExportToSlides={handleExportToSlides}
        onAddSlide={handleAddSlide}
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
              <div className="w-full flex flex-col items-center">
                <SEMSlide />
                <GDNSlide />
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
