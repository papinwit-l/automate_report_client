import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DateRangePicker from "@/components/slides/DateRangePicker";
import {
  FileSpreadsheet,
  Presentation,
  Plus,
  Edit3,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SlideGeneratorSidebar = ({
  isOpen,
  onToggle,
  sheetsLink,
  sheetsID,
  ableToGenerate,
  isGenerating,
  slideGenerated,
  enableDateRange,
  isExporting,
  presentationUrl,
  onSheetsLinkChange,
  onGenerate,
  onEnableDateRangeChange,
  onExportToSlides,
  onAddSlide,
}) => {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className={`fixed top-20 left-4 z-50 bg-white shadow-md border transition-all duration-300 ${
          isOpen ? "translate-x-80" : "translate-x-0"
        }`}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Slide Generator</h2>
              <p className="text-sm text-muted-foreground">Configuration</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          {/* Data Source Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-sm">Data Source</h3>
            </div>

            <Card className="shadow-sm py-1">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sheet-link" className="text-sm font-medium">
                    Google Sheets URL
                  </Label>
                  <Input
                    id="sheet-link"
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetsLink}
                    onChange={onSheetsLinkChange}
                    className="font-mono text-sm"
                  />
                </div>

                {sheetsID && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Sheet ID
                    </Label>
                    <div className="p-3 bg-muted rounded-md text-sm font-mono break-all">
                      {sheetsID}
                    </div>
                    <Badge
                      variant={ableToGenerate ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {ableToGenerate ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                )}

                {/* Date Range Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-sm">Date Range</h3>
                  </div>

                  <Card className="shadow-sm py-1">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="date-range-enable"
                          checked={enableDateRange}
                          onChange={onEnableDateRangeChange}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="date-range-enable"
                          className="text-sm font-medium"
                        >
                          Enable date filtering
                        </Label>
                      </div>

                      {enableDateRange && (
                        <div className="pt-2">
                          <DateRangePicker />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <Button
                  onClick={onGenerate}
                  disabled={isGenerating || !ableToGenerate}
                  className="w-full"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Generate Slides
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Actions Section */}
          {slideGenerated && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Presentation className="h-4 w-4 text-purple-600" />
                <h3 className="font-medium text-sm">Actions</h3>
              </div>

              <Card className="shadow-sm py-1">
                <CardContent className="p-4 space-y-3">
                  <Button
                    onClick={onExportToSlides}
                    disabled={isExporting}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Presentation className="mr-2 h-4 w-4" />
                        Export to Slides
                      </>
                    )}
                  </Button>

                  {/* <Button
                    onClick={onAddSlide}
                    disabled={isExporting || !presentationUrl}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Slide
                      </>
                    )}
                  </Button> */}

                  <Separator />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-30" onClick={onToggle} />
      )}
    </>
  );
};

export default SlideGeneratorSidebar;
