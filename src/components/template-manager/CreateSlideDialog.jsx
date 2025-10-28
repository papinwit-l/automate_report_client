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
  DEMOGRAPHIC_DATA_LIST,
  INITIAL_NEW_SLIDE,
  GROUP_BY_LIST,
} from "@/configs/templateManagerConfig";
import CreateSlidePreview from "./CreateSlidePreview";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  SearchableSelect,
  SearchableSelectContent,
  SearchableSelectItem,
  SearchableSelectTrigger,
} from "../custom-ui/searchable-select";

function CreateSlideDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddSlide,
}) {
  const { getDataList, rawSEMData } = useData();
  // console.log("🎯 CreateSlideDialog getDataList:", getDataList());

  const [newSlideTitle, setNewSlideTitle] = useState("New Slide");
  const [newSlideType, setNewSlideType] = useState("");
  const [newSlide, setNewSlide] = useState({ ...INITIAL_NEW_SLIDE });

  // Table Section
  const [isTableRemoveMode, setIsTableRemoveMode] = useState(false);
  const [showTableList, setShowTableList] = useState(false);
  const [tableSelectValue, setTableSelectValue] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  // Metric Data Section
  const [isMetricRemoveMode, setIsMetricRemoveMode] = useState(false);
  const [showMetricList, setShowMetricList] = useState(false);
  const [metricSelectValue, setMetricSelectValue] = useState("");
  const [metricSearchQuery, setMetricSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isConversionToggle, setIsConversionToggle] = useState(false);
  const [metricConvLength, setmetricConvLength] = useState(2);

  // Extra Content Section
  const [extraContentType, setExtraContentType] = useState("none");
  const [summaryPosition, setSummaryPosition] = useState("bottom");

  const handleAddSlide = () => {
    const slideToAdd = { ...newSlide };
    slideToAdd.title = newSlideTitle;
    slideToAdd.metricConvLength = metricConvLength;
    slideToAdd.extraContentType = extraContentType;
    slideToAdd.summaryPosition = summaryPosition;
    onAddSlide(slideToAdd);

    // Reset to initial state
    setNewSlide({ ...INITIAL_NEW_SLIDE });
    setNewSlideTitle("New Slide");
    setNewSlideType("");
  };

  const handleExtraContentTypeChange = (value) => {
    setNewSlide((prev) => {
      const slide = { ...prev };

      setExtraContentType(value);
      slide.extraContentType = value;

      if (value === "none") {
        setSummaryPosition("bottom");
        slide.summaryPosition = "bottom";
      }
      return slide;
    });
  };

  const handleSummaryPositionChange = (value) => {
    setNewSlide((prev) => ({ ...prev, summaryPosition: value }));
    setSummaryPosition(value);
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
        demographicChart:
          selectedSlide.demographicChart || INITIAL_NEW_SLIDE.demographicChart,
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
      setTableSelectValue(""); // Reset even if it's a duplicate
      return;
    }
    const newTable = [...newSlide.table, tableValue];
    setNewSlide((prev) => ({ ...prev, table: newTable }));
    setShowTableList(false);
    setTableSearchQuery("");
    setTableSelectValue(""); // Reset the select value
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
    if (newSlideType === "overall-slide" || newSlideType === "google-slide") {
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
    setMetricSelectValue("");
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
    setShowMetricList(false);
    setMetricSearchQuery("");
    setMetricSelectValue(""); // Reset select value
  };

  const handleCancelAddMetric = () => {
    setSelectedMetric(null);
    setIsConversionToggle(false);
    setShowMetricList(false);
    setMetricSearchQuery("");
    setMetricSelectValue(""); // Reset select value
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

  const handleDataGroupByChange = (value) => {
    setNewSlide((prev) => ({ ...prev, dataGroupBy: value }));
  };

  const handleChartByChange = (value, chartIndex) => {
    setNewSlide((prev) => {
      const newCharts = [...(prev.demographicChart || [])];
      newCharts[chartIndex] = {
        ...newCharts[chartIndex],
        chartBy: value,
      };
      return { ...prev, demographicChart: newCharts };
    });
  };

  const handleChartTitleChange = (event, chartIndex) => {
    setNewSlide((prev) => {
      const newCharts = [...(prev.demographicChart || [])];
      newCharts[chartIndex] = {
        ...newCharts[chartIndex],
        title: event.target.value,
      };
      return { ...prev, demographicChart: newCharts };
    });
  };

  const handleChartDataByChange = (value, chartIndex) => {
    setNewSlide((prev) => {
      const newCharts = [...(prev.demographicChart || [])];
      newCharts[chartIndex] = {
        ...newCharts[chartIndex],
        dataBy: value,
      };
      return { ...prev, demographicChart: newCharts };
    });
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

  const { dataGroupByList } = useMemo(() => {
    const data = getDataList().filter(
      (data) => data.label === newSlide.dataSource
    );

    // Safety checks
    if (!data || data.length === 0 || !data[0].value?.rawData) {
      return { dataGroupByList: [] };
    }

    const rawData = data[0].value.rawData;

    // Check if rawData has items
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { dataGroupByList: [] };
    }

    const groupByList = Object.keys(rawData[0]).filter((key) =>
      GROUP_BY_LIST.find(
        (item) => item.value.includes(key) || key.includes(item.value)
      )
    );

    return { dataGroupByList: groupByList };
  }, [newSlide.dataSource, getDataList]);

  console.log("🎯 dataGroupByList:", dataGroupByList);

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
              {newSlideType !== "overall-slide" && (
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Data Source:</h3>
                  <div className="flex gap-2 items-center">
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
                    {newSlide?.dataSource !== "" && (
                      <div className="flex gap-2 items-center">
                        <Label
                          htmlFor="data-group-by"
                          className="text-sm font-medium"
                        >
                          Group By:
                        </Label>
                        <Select
                          value={newSlide.dataGroupBy}
                          onValueChange={handleDataGroupByChange}
                        >
                          <SelectTrigger id="data-group-by">
                            <SelectValue placeholder="Select group by" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="default">Default</SelectItem>
                            {dataGroupByList.map((groupBy, index) => (
                              <SelectItem key={index} value={groupBy}>
                                {groupBy}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metric Data Section */}
              <div className="space-y-2">
                <h3 className="text-md font-medium">Metric Data Section:</h3>
                <div className="flex items-center gap-2">
                  {!selectedMetric ? (
                    <SearchableSelect
                      value={metricSelectValue}
                      open={showMetricList}
                      onOpenChange={setShowMetricList}
                      onValueChange={(value) => {
                        const metric = METRIC_DATA_LIST.find(
                          (m) => m.value === value
                        );
                        handleMetricClick(metric);
                      }}
                    >
                      <SearchableSelectTrigger>
                        <Plus className="h-4 w-4" />
                        Add
                      </SearchableSelectTrigger>
                      <SearchableSelectContent
                        className="w-[350px]"
                        position="popper"
                        onSearch={setMetricSearchQuery}
                        searchValue={metricSearchQuery}
                        searchPlaceholder="Search metric..."
                      >
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredMetricList.length === 0 ? (
                            <div className="p-4 text-sm text-center text-muted-foreground">
                              No metrics found.
                            </div>
                          ) : (
                            filteredMetricList.map((metric, index) => (
                              <SearchableSelectItem
                                key={index}
                                value={metric.value}
                                disabled={newSlide.metricData.some(
                                  (m) => m.value === metric.value
                                )}
                              >
                                {metric.label}
                                {newSlide.metricData.some(
                                  (m) => m.value === metric.value
                                ) && " (added)"}
                              </SearchableSelectItem>
                            ))
                          )}
                        </div>
                      </SearchableSelectContent>
                    </SearchableSelect>
                  ) : (
                    <div className="border border-slate-200 rounded-md p-4 space-y-4 bg-white shadow-sm">
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          {selectedMetric.label}
                        </h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="is-conversion" className="text-sm">
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
                        <Button size="sm" onClick={handleConfirmAddMetric}>
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

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

              {/* Table Section */}
              <div className="space-y-2">
                <h3 className="text-md font-medium">Table Section:</h3>
                <div className="flex items-center gap-2">
                  <SearchableSelect
                    value={tableSelectValue}
                    open={showTableList}
                    onOpenChange={setShowTableList}
                    onValueChange={(value) => {
                      handleAddTableSelect(value);
                    }}
                  >
                    <SearchableSelectTrigger>
                      <Plus className="h-4 w-4" />
                      Add
                    </SearchableSelectTrigger>
                    <SearchableSelectContent
                      className="w-[300px]"
                      position="popper"
                      onSearch={setTableSearchQuery}
                      searchValue={tableSearchQuery}
                      searchPlaceholder="Search table..."
                    >
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredTableList.length === 0 ? (
                          <div className="p-4 text-sm text-center text-muted-foreground">
                            No tables found.
                          </div>
                        ) : (
                          filteredTableList.map((table, index) => (
                            <SearchableSelectItem
                              key={index}
                              value={table.value}
                              disabled={newSlide.table.includes(table.value)}
                            >
                              {table.label}
                              {newSlide.table.includes(table.value) &&
                                " (added)"}
                            </SearchableSelectItem>
                          ))
                        )}
                      </div>
                    </SearchableSelectContent>
                  </SearchableSelect>

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

                {/* Table Columns Arrangement */}
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

              {/* Extra Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Extra Content</h3>

                <div className="flex gap-6">
                  {/* Left Column - Content Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Content Type</Label>
                    <RadioGroup
                      value={extraContentType}
                      onValueChange={handleExtraContentTypeChange}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="extra-none" />
                        <Label
                          htmlFor="extra-none"
                          className="cursor-pointer font-normal"
                        >
                          None
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="demographic"
                          id="extra-demographic"
                        />
                        <Label
                          htmlFor="extra-demographic"
                          className="cursor-pointer font-normal"
                        >
                          Demographic
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="picture"
                          id="extra-picture"
                          disabled={newSlideType !== "facebook-slide"}
                        />
                        <Label
                          htmlFor="extra-picture"
                          className={`cursor-pointer font-normal ${
                            newSlideType !== "facebook-slide" &&
                            "text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          Picture
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Right Column - Content Configuration */}
                  <div className="flex-1">
                    {extraContentType === "demographic" ? (
                      <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-slate-50">
                        <h4 className="text-md font-semibold">
                          Demographic Charts
                        </h4>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Chart 1 */}
                          <div className="space-y-3 p-3 bg-white border border-slate-200 rounded-md">
                            <h5 className="text-sm font-semibold text-slate-700">
                              Chart 1
                            </h5>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Chart By
                              </Label>
                              <RadioGroup
                                className="flex items-center gap-3"
                                value={
                                  newSlide.demographicChart?.[0]?.chartBy ||
                                  "Gender"
                                }
                                onValueChange={(value) =>
                                  handleChartByChange(value, 0)
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Gender"
                                    id="chart1-by-gender"
                                  />
                                  <Label
                                    htmlFor="chart1-by-gender"
                                    className="text-sm cursor-pointer"
                                  >
                                    Gender
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Device"
                                    id="chart1-by-device"
                                  />
                                  <Label
                                    htmlFor="chart1-by-device"
                                    className="text-sm cursor-pointer"
                                  >
                                    Device
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Title
                              </Label>
                              <Input
                                value={
                                  newSlide.demographicChart?.[0]?.title || ""
                                }
                                onChange={(e) => handleChartTitleChange(e, 0)}
                                className="h-9"
                                placeholder="Enter chart title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Data By
                              </Label>
                              <Select
                                value={
                                  newSlide.demographicChart?.[0]?.dataBy ||
                                  "Clicks"
                                }
                                onValueChange={(value) =>
                                  handleChartDataByChange(value, 0)
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select data by" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEMOGRAPHIC_DATA_LIST.map((data, index) => (
                                    <SelectItem key={index} value={data.value}>
                                      {data.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Chart 2 */}
                          <div className="space-y-3 p-3 bg-white border border-slate-200 rounded-md">
                            <h5 className="text-sm font-semibold text-slate-700">
                              Chart 2
                            </h5>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Chart By
                              </Label>
                              <RadioGroup
                                className="flex items-center gap-3"
                                value={
                                  newSlide.demographicChart?.[1]?.chartBy ||
                                  "None"
                                }
                                onValueChange={(value) =>
                                  handleChartByChange(value, 1)
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="None"
                                    id="chart2-by-none"
                                  />
                                  <Label
                                    htmlFor="chart2-by-none"
                                    className="text-sm cursor-pointer"
                                  >
                                    None
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Gender"
                                    id="chart2-by-gender"
                                  />
                                  <Label
                                    htmlFor="chart2-by-gender"
                                    className="text-sm cursor-pointer"
                                  >
                                    Gender
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Device"
                                    id="chart2-by-device"
                                  />
                                  <Label
                                    htmlFor="chart2-by-device"
                                    className="text-sm cursor-pointer"
                                  >
                                    Device
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Title
                              </Label>
                              <Input
                                value={
                                  newSlide.demographicChart?.[1]?.title || ""
                                }
                                onChange={(e) => handleChartTitleChange(e, 1)}
                                className="h-9"
                                placeholder="Enter chart title"
                                disabled={
                                  newSlide.demographicChart?.[1]?.chartBy ===
                                  "None"
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">
                                Data By
                              </Label>
                              <Select
                                value={
                                  newSlide.demographicChart?.[1]?.dataBy ||
                                  "Clicks"
                                }
                                onValueChange={(value) =>
                                  handleChartDataByChange(value, 1)
                                }
                                disabled={
                                  newSlide.demographicChart?.[1]?.chartBy ===
                                  "None"
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select data by" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEMOGRAPHIC_DATA_LIST.map((data, index) => (
                                    <SelectItem key={index} value={data.value}>
                                      {data.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : extraContentType === "picture" ? (
                      <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
                        <p className="text-sm text-muted-foreground">
                          Picture configuration will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-slate-300 rounded-md bg-slate-50/50">
                        <p className="text-sm text-muted-foreground text-center">
                          Select a content type to configure
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Position - Only show when content type is not "none" */}
                {extraContentType !== "none" && (
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <Label className="text-sm font-medium">
                      Summary Position
                    </Label>
                    <RadioGroup
                      value={summaryPosition}
                      onValueChange={handleSummaryPositionChange}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="bottom"
                          id="summary-position-bottom"
                        />
                        <Label
                          htmlFor="summary-position-bottom"
                          className="cursor-pointer font-normal"
                        >
                          Bottom
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="right"
                          id="summary-position-right"
                        />
                        <Label
                          htmlFor="summary-position-right"
                          className="cursor-pointer font-normal"
                        >
                          Right (Under Extra Content)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
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
