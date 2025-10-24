import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  CREATE_SLIDE_LIST,
  OVERALL_TABLE,
  METRIC_DATA_LIST,
  GOOGLE_TABLE,
} from "@/configs/templateManagerConfig";
import CreateSlidePreview from "./CreateSlidePreview";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { useData } from "@/contexts/DataContext";

function CreateSlideDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddSlide,
}) {
  const { getDataList } = useData();
  // console.log("🎯 CreateSlideDialog getDataList:", getDataList());

  const [newSlideTitle, setNewSlideTitle] = useState("New Slide");
  const [newSlideType, setNewSlideType] = useState("");
  const [newSlide, setNewSlide] = useState({
    title: "Title",
    Component: null,
    table: [],
    metricData: [],
  });

  // Data Source
  const [dataSource, setDataSource] = useState("");

  // Table Section
  const [isTableRemoveMode, setIsTableRemoveMode] = useState(false);
  const [showTableList, setShowTableList] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const tableDropdownRef = useRef(null);

  // Metric Data Section
  const [isMetricRemoveMode, setIsMetricRemoveMode] = useState(false);
  const [showMetricList, setShowMetricList] = useState(false);
  const [metricSearchQuery, setMetricSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isConversionToggle, setIsConversionToggle] = useState(false);
  const metricDropdownRef = useRef(null);
  const [metricConvLength, setmetricConvLength] = useState(2);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableDropdownRef.current &&
        !tableDropdownRef.current.contains(event.target)
      ) {
        setShowTableList(false);
      }
      if (
        metricDropdownRef.current &&
        !metricDropdownRef.current.contains(event.target)
      ) {
        setShowMetricList(false);
        setSelectedMetric(null);
      }
    };

    if (showTableList || showMetricList) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTableList, showMetricList]);

  const handleAddSlide = () => {
    const slideToAdd = { ...newSlide };
    slideToAdd.title = newSlideTitle;
    slideToAdd.metricConvLength = metricConvLength;
    onAddSlide(slideToAdd);
    setNewSlide({
      title: "Title",
      Component: null,
      table: [],
      metricData: [],
      metricConvLength: 2,
    });
    setNewSlideTitle("New Slide");
    setNewSlideType("");
  };

  const handleSlideTitleChange = (event) => {
    setNewSlideTitle(event.target.value);
    setNewSlide((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleSelectSlideType = (slideName) => {
    const selectedSlide = CREATE_SLIDE_LIST.find(
      (slide) => slide.name === slideName
    );
    setNewSlideType(selectedSlide.name);
    if (selectedSlide) {
      setNewSlide({
        ...selectedSlide,
        title: newSlideTitle,
        table: selectedSlide.table || [],
        metricData: selectedSlide.metricData || [],
      });
    }
  };

  // Table handlers
  const handleTableSwap = (index, action) => {
    const newTable = [...newSlide.table];

    if (action === "left" && index > 0) {
      [newTable[index], newTable[index - 1]] = [
        newTable[index - 1],
        newTable[index],
      ];
    } else if (action === "right" && index < newTable.length - 1) {
      [newTable[index], newTable[index + 1]] = [
        newTable[index + 1],
        newTable[index],
      ];
    }

    setNewSlide((prev) => ({ ...prev, table: newTable }));
  };

  const handleRemoveTable = (index) => {
    const newTable = newSlide.table.filter((_, i) => i !== index);
    setNewSlide((prev) => ({ ...prev, table: newTable }));
  };

  const getTableList = () => {
    if (newSlideType === "overall-slide") {
      return OVERALL_TABLE;
    }
    if (newSlideType === "google-slide") {
      return GOOGLE_TABLE;
    }
    return [];
  };

  const handleAddTableSelect = (tableValue) => {
    if (newSlide.table.includes(tableValue)) {
      return;
    }
    const newTable = [...newSlide.table, tableValue];
    setNewSlide((prev) => ({ ...prev, table: newTable }));
    setShowTableList(false);
    setTableSearchQuery("");
  };

  // Metric Data handlers
  const handleMetricSwap = (index, action) => {
    const newMetricData = [...newSlide.metricData];

    if (action === "left" && index > 0) {
      [newMetricData[index], newMetricData[index - 1]] = [
        newMetricData[index - 1],
        newMetricData[index],
      ];
    } else if (action === "right" && index < newMetricData.length - 1) {
      [newMetricData[index], newMetricData[index + 1]] = [
        newMetricData[index + 1],
        newMetricData[index],
      ];
    }

    setNewSlide((prev) => ({ ...prev, metricData: newMetricData }));
  };

  const handleRemoveMetric = (index) => {
    const newMetricData = newSlide.metricData.filter((_, i) => i !== index);
    setNewSlide((prev) => ({ ...prev, metricData: newMetricData }));
  };

  const handleToggleMetricConversion = (index) => {
    const newMetricData = [...newSlide.metricData];
    newMetricData[index] = {
      ...newMetricData[index],
      isConversion: !newMetricData[index].isConversion,
    };
    setNewSlide((prev) => ({ ...prev, metricData: newMetricData }));
  };

  const getMetricList = () => {
    if (newSlideType === "overall-slide") {
      return METRIC_DATA_LIST;
    }
    return [];
  };

  const handleMetricClick = (metric) => {
    if (newSlide.metricData.some((m) => m.value === metric.value)) {
      return;
    }
    setSelectedMetric(metric);
    setIsConversionToggle(false); // Reset to false by default
  };

  const handleConfirmAddMetric = () => {
    if (!selectedMetric) return;

    const metricToAdd = {
      ...selectedMetric,
      isConversion: isConversionToggle,
    };

    const newMetricData = [...newSlide.metricData, metricToAdd];
    setNewSlide((prev) => ({ ...prev, metricData: newMetricData }));
    setSelectedMetric(null);
    setIsConversionToggle(false);
    setMetricSearchQuery("");
  };

  const handleCancelAddMetric = () => {
    setSelectedMetric(null);
    setIsConversionToggle(false);
  };

  const filteredTableList = getTableList().filter((table) =>
    table.label.toLowerCase().includes(tableSearchQuery.toLowerCase())
  );

  const filteredMetricList = getMetricList().filter((metric) =>
    metric.label.toLowerCase().includes(metricSearchQuery.toLowerCase())
  );

  const handlemetricConvLengthChange = (number) => {
    setmetricConvLength((prev) => {
      setNewSlide((old) => ({ ...old, metricConvLength: prev + number }));
      return prev + number;
    });
  };

  const handleDataSourceChange = (value) => {
    setNewSlide((prev) => ({ ...prev, dataSource: value }));
  };

  const { enableAdvancedSlideInfo } = useMemo(() => {
    const advancedSlide = [
      "",
      "title-slide",
      "media-plan",
      "section-slide",
      "end-slide",
    ];
    if (advancedSlide.includes(newSlideType)) {
      return {
        enableAdvancedSlideInfo: false,
      };
    }
    return {
      enableAdvancedSlideInfo: true,
    };
  }, [newSlideType]);

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="!w-[80vw] !h-[80vh] !max-w-none !max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Slide</DialogTitle>
          <DialogDescription>
            Create a new slide template for your presentation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 flex-1 overflow-y-auto">
          {/* Slide Info */}
          <div className="space-y-2">
            <Label htmlFor="slide-title">Slide Title</Label>
            <Input
              id="slide-title"
              placeholder="Enter slide title..."
              value={newSlideTitle}
              onChange={(e) => handleSlideTitleChange(e)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slide-type">Slide Type</Label>
            <Select value={newSlideType} onValueChange={handleSelectSlideType}>
              <SelectTrigger id="slide-type">
                <SelectValue placeholder="Select slide type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {CREATE_SLIDE_LIST.map((slide, index) => (
                  <SelectItem key={index} value={slide.name}>
                    {slide.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Slide Info */}
          {enableAdvancedSlideInfo && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Advanced Slide Info</h2>

              {/* Data Source Section */}
              <div className="space-y-2">
                <h3 className="text-md font-medium">Data Source:</h3>
                <Select
                  value={newSlide.dataSource}
                  onValueChange={handleDataSourceChange}
                >
                  <SelectTrigger id="data-source">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {getDataList().map((data, index) => (
                      <SelectItem key={index} value={data.label}>
                        {data.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table Section */}
              <div className="space-y-2">
                <h3 className="text-md font-medium">Table Section:</h3>
                <div className="flex items-center gap-2 py-2">
                  <div className="relative" ref={tableDropdownRef}>
                    <button
                      onClick={() => setShowTableList(!showTableList)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>

                    {showTableList && (
                      <div className="absolute top-full left-0 mt-2 w-[300px] bg-white border border-slate-200 rounded-md shadow-lg z-50">
                        <div className="p-2 border-b flex items-center gap-2">
                          <Input
                            placeholder="Search table..."
                            value={tableSearchQuery}
                            onChange={(e) =>
                              setTableSearchQuery(e.target.value)
                            }
                            className="h-8 text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredTableList.length === 0 ? (
                            <div className="p-4 text-sm text-center text-muted-foreground">
                              No tables found.
                            </div>
                          ) : (
                            filteredTableList.map((table, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddTableSelect(table.value);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
                                disabled={newSlide.table.includes(table.value)}
                              >
                                <span
                                  className={
                                    newSlide.table.includes(table.value)
                                      ? "text-muted-foreground"
                                      : ""
                                  }
                                >
                                  {table.label}
                                  {newSlide.table.includes(table.value) &&
                                    " (added)"}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsTableRemoveMode(!isTableRemoveMode)}
                    className={`text-sm font-medium transition-colors ${
                      isTableRemoveMode
                        ? "text-red-700 bg-red-50 px-2 py-1 rounded"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    {isTableRemoveMode ? "Cancel Remove" : "Remove"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newSlide.table &&
                    newSlide.table.map((table, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (isTableRemoveMode) {
                            handleRemoveTable(index);
                          }
                        }}
                        className={`flex items-center gap-1 border border-slate-200 p-1 px-2 rounded-sm bg-white ${
                          isTableRemoveMode
                            ? "cursor-pointer hover:bg-red-50 hover:border-red-300"
                            : ""
                        }`}
                      >
                        {!isTableRemoveMode && index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTableSwap(index, "left");
                            }}
                            className="hover:bg-slate-100 rounded p-0.5"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}
                        <span className="text-sm">{table}</span>
                        {isTableRemoveMode ? (
                          <X className="h-3 w-3 text-red-500" />
                        ) : (
                          index < newSlide.table.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTableSwap(index, "right");
                              }}
                              className="hover:bg-slate-100 rounded p-0.5"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Metric Data Section */}
              <div className="space-y-2">
                <h3 className="text-md font-medium">Metric Data Section:</h3>
                <div className="flex items-center gap-2 py-2">
                  <div className="relative" ref={metricDropdownRef}>
                    <button
                      onClick={() => setShowMetricList(!showMetricList)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>

                    {showMetricList && (
                      <div className="absolute top-full left-0 mt-2 w-[350px] bg-white border border-slate-200 rounded-md shadow-lg z-50">
                        {!selectedMetric ? (
                          <>
                            <div className="p-2 border-b flex items-center gap-2">
                              <Input
                                placeholder="Search metric..."
                                value={metricSearchQuery}
                                onChange={(e) =>
                                  setMetricSearchQuery(e.target.value)
                                }
                                className="h-8 text-sm"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                              {filteredMetricList.length === 0 ? (
                                <div className="p-4 text-sm text-center text-muted-foreground">
                                  No metrics found.
                                </div>
                              ) : (
                                filteredMetricList.map((metric, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMetricClick(metric);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
                                    disabled={newSlide.metricData.some(
                                      (m) => m.value === metric.value
                                    )}
                                  >
                                    <span
                                      className={
                                        newSlide.metricData.some(
                                          (m) => m.value === metric.value
                                        )
                                          ? "text-muted-foreground"
                                          : ""
                                      }
                                    >
                                      {metric.label}
                                      {newSlide.metricData.some(
                                        (m) => m.value === metric.value
                                      ) && " (added)"}
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">
                                {selectedMetric.label}
                              </h4>
                              <div className="flex items-center justify-between">
                                <Label
                                  htmlFor="is-conversion"
                                  className="text-sm"
                                >
                                  Is Conversion
                                </Label>
                                <Switch
                                  id="is-conversion"
                                  checked={isConversionToggle}
                                  onCheckedChange={setIsConversionToggle}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelAddMetric}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleConfirmAddMetric}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsMetricRemoveMode(!isMetricRemoveMode)}
                    className={`text-sm font-medium transition-colors ${
                      isMetricRemoveMode
                        ? "text-red-700 bg-red-50 px-2 py-1 rounded"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    {isMetricRemoveMode ? "Cancel Remove" : "Remove"}
                  </button>
                </div>
                <div className="flex gap-1">
                  <div
                    className={`flex-1 grid grid-cols-${newSlide.metricData.length} gap-1 border-t border-b border-slate-200`}
                  >
                    {/* blank div */}
                    <div
                      className={`${
                        newSlide.metricData.length > 0 &&
                        `col-span-${
                          newSlide.metricData.length - metricConvLength
                        }`
                      }`}
                    ></div>
                    <div
                      className={`px-2 border rounded-sm flex items-center justify-between gap-1 ${
                        metricConvLength > 0
                          ? `col-span-${metricConvLength}`
                          : "hidden"
                      }`}
                    >
                      {metricConvLength < newSlide.metricData.length - 1 && (
                        <button
                          className="hover:bg-slate-100 rounded p-0.5"
                          onClick={() => handlemetricConvLengthChange(1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                      <span className={`flex-1 p-1 px-2`}>Conversion</span>{" "}
                      {metricConvLength > 0 && (
                        <button
                          className="hover:bg-slate-100 rounded p-0.5"
                          onClick={() => handlemetricConvLengthChange(-1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {metricConvLength === 0 && (
                    <button
                      className="rounded p-1 hover:bg-slate-100"
                      onClick={() => handlemetricConvLengthChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div
                  className={`grid grid-cols-${newSlide.metricData.length} gap-1`}
                >
                  {newSlide.metricData &&
                    newSlide.metricData.map((metric, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (isMetricRemoveMode) {
                            handleRemoveMetric(index);
                          }
                        }}
                        className={`flex items-center justify-between gap-1 border border-slate-200 p-1 px-2 rounded-sm bg-white ${
                          isMetricRemoveMode
                            ? "cursor-pointer hover:bg-red-50 hover:border-red-300"
                            : ""
                        }`}
                      >
                        {!isMetricRemoveMode && index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMetricSwap(index, "left");
                            }}
                            className="hover:bg-slate-100 rounded p-0.5"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}
                        <span className="text-sm">{metric.label}</span>
                        {isMetricRemoveMode ? (
                          <X className="h-3 w-3 text-red-500" />
                        ) : (
                          <>
                            {!isMetricRemoveMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleMetricConversion(index);
                                }}
                                className={`hover:bg-blue-50 rounded p-0.5 text-xs text-blue-600 border border-blue-200 ${
                                  metric.isConversion &&
                                  "text-red-600 bg-red-100 border-red-200 hover:bg-red-50"
                                }`}
                                title="Toggle conversion"
                              >
                                C
                              </button>
                            )}
                            {index < newSlide.metricData.length - 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMetricSwap(index, "right");
                                }}
                                className="hover:bg-slate-100 rounded p-0.5"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSlide}
            disabled={!newSlideTitle.trim() || !newSlideType}
          >
            Add Slide
          </Button>
        </DialogFooter>
        <CreateSlidePreview slide={newSlide} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateSlideDialog;
