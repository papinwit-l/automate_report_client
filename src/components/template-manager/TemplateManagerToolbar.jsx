import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  FileSpreadsheet,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SidebarProjectFilterSection from "../slides/SidebarProjectFilterSection";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import DateRangePicker from "../slides/utils/DateRangePicker";
import { useData } from "@/contexts/DataContext";

import CreateSlideDialog from "./CreateSlideDialog";
import EditSlideDialog from "./EditSlideDialog";

function TemplateManagerToolbar({ slideTemplates, setSlideTemplates }) {
  const { fetchData, enableDateRange, setEnableDateRange } = useData();

  const [error, setError] = useState(null);

  const [showSlideSection, setShowSlideSection] = useState(true);
  const [slideGenerated, setSlideGenerated] = useState(false);

  // data section
  const [showDataSection, setShowDataSection] = useState(true);
  const [sheetsID, setSheetsID] = useState("");
  const [sheetsLink, setSheetsLink] = useState("");
  const [ableToGenerate, setAbleToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Add slide dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  //Edit Slide Section
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [slideToEdit, setSlideToEdit] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);

  // Remove mode state
  const [isRemoveMode, setIsRemoveMode] = useState(false);

  const handleEnableDateRangeChange = (event) => {
    setEnableDateRange(event.target.checked);
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

  const handleSlideSwap = (index, action) => {
    if (action === "up") {
      const newSlideTemplates = [...slideTemplates];
      newSlideTemplates[index] = slideTemplates[index - 1];
      newSlideTemplates[index - 1] = slideTemplates[index];
      setSlideTemplates(newSlideTemplates);
    } else if (action === "down") {
      const newSlideTemplates = [...slideTemplates];
      newSlideTemplates[index] = slideTemplates[index + 1];
      newSlideTemplates[index + 1] = slideTemplates[index];
      setSlideTemplates(newSlideTemplates);
    }
  };

  const handleRemoveSlide = (index) => {
    const newSlideTemplates = slideTemplates.filter((_, i) => i !== index);
    setSlideTemplates(newSlideTemplates);
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

  const handleAddSlide = (newSlide) => {
    setSlideTemplates([...slideTemplates, newSlide]);
    setIsAddDialogOpen(false);
  };

  const handleEditSlide = (slide, index) => {
    setSlideToEdit(slide);
    setEditingSlideIndex(index);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSlide = (updatedSlide) => {
    setSlideTemplates((prev) => {
      const newSlides = [...prev];
      newSlides[editingSlideIndex] = updatedSlide;
      return newSlides;
    });
    setIsEditDialogOpen(false);
    setSlideToEdit(null);
    setEditingSlideIndex(null);
  };

  return (
    <div className="h-full w-xs bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Data Section */}
      <div className="flex flex-col rounded-lg shadow-sm border border-slate-200">
        {/* Data Section Title */}
        <div
          className={`flex items-center justify-between bg-white p-3 cursor-pointer transition-colors rounded-t-lg ${
            !showDataSection && "rounded-lg"
          }`}
        >
          <h2 className="text-sm font-semibold text-slate-700">Data</h2>
          <button
            onClick={() => setShowDataSection(!showDataSection)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showDataSection ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
        {/* Data Section Content*/}
        {showDataSection && (
          <div className="flex flex-col gap-1.5 p-2 px-3 bg-slate-50/50">
            <Label htmlFor="sheet-link" className="text-sm font-medium">
              Raw Dashboard
            </Label>
            <Input
              id="sheet-link"
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetsLink}
              onChange={handleSheetsLinkChange}
              className="font-mono text-sm"
            />
            {sheetsID && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      Sheet ID
                    </Label>
                    <Badge
                      variant={ableToGenerate ? "default" : "destructive"}
                      className={`text-xs ${
                        ableToGenerate ? "bg-green-200 text-green-700" : ""
                      }`}
                    >
                      {ableToGenerate ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm font-mono break-all border-1">
                    {sheetsID}
                  </div>
                </div>
                {/* Project Filter Section */}
                <SidebarProjectFilterSection sheetsID={sheetsID} />
              </>
            )}

            {/* Date Range Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-sm">Date Range</h3>
              </div>

              <Card className="shadow-sm py-1">
                <CardContent className="p-4 space-y-1 py-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="date-range-enable"
                      checked={enableDateRange}
                      onChange={handleEnableDateRangeChange}
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
                    <div className="pt-2 flex flex-col gap-2">
                      <DateRangePicker />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !ableToGenerate}
              className="w-full"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Data...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Load Data
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Slide Section */}
      <div className="flex flex-col rounded-lg shadow-sm border border-slate-200">
        {/* Slide Section Title */}
        <div
          className={`flex items-center justify-between bg-white p-3 cursor-pointer transition-colors rounded-t-lg ${
            !showSlideSection && "rounded-lg"
          }`}
        >
          <h2 className="text-sm font-semibold text-slate-700">Slides</h2>
          <button
            onClick={() => setShowSlideSection(!showSlideSection)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showSlideSection ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Slide Section Content */}
        {showSlideSection && (
          <>
            <div className="flex justify-between items-center p-1 px-2 bg-white border-t border-b border-slate-200">
              <button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
              <button
                onClick={() => setIsRemoveMode(!isRemoveMode)}
                className={`text-sm font-medium transition-colors ${
                  isRemoveMode
                    ? "text-red-700 bg-red-50 px-2 py-1 rounded"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                {isRemoveMode ? "Cancel Remove" : "Remove"}
              </button>
            </div>
            <div className="flex flex-col gap-1.5 p-2 bg-slate-50/50">
              {slideTemplates.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (isRemoveMode) {
                      handleRemoveSlide(index);
                    }
                  }}
                  className={`flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-md transition-all group ${
                    isRemoveMode
                      ? "cursor-pointer hover:bg-red-50 hover:border-red-300 hover:shadow-sm"
                      : "hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm text-slate-700 font-medium truncate flex-1">
                    {slide.title}
                  </span>
                  {isRemoveMode ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSlide(slide, index);
                        }}
                        className="p-1 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSlideSwap(index, "up");
                            }}
                            className="flex items-center justify-center p-1 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            aria-label="Move slide up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                        )}
                        {index < slideTemplates.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSlideSwap(index, "down");
                            }}
                            className="flex items-center justify-center p-1 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            aria-label="Move slide down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Slide Dialog - Separate from trigger */}
      <CreateSlideDialog
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        onAddSlide={handleAddSlide}
      />
      <EditSlideDialog
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        slideToEdit={slideToEdit}
        onUpdateSlide={handleUpdateSlide}
      />
    </div>
  );
}

export default TemplateManagerToolbar;
