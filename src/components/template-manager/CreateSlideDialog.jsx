import React, { useMemo, useState } from "react";
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
  CUSTOM_TABLE,
  DEMOGRAPHIC_DATA_LIST,
  INITIAL_NEW_SLIDE,
  GROUP_BY_LIST,
  DEMOGRAPHIC_CHART_BY_LIST,
  SUMMARRY_CONTENT_LIST,
} from "@/configs/templateManagerConfig";
import CreateSlidePreview from "./CreateSlidePreview";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  SearchableSelect,
  SearchableSelectContent,
  SearchableSelectItem,
  SearchableSelectTrigger,
} from "../custom-ui/searchable-select";
import { cleanObjectData } from "@/utils/dataProcessors";
import { filterDataByDateRange } from "@/utils/dataUtils";
import { NON_NUMERIC_COLUMNS } from "@/configs/dataConfigs";

function CreateSlideDialog({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddSlide,
}) {
  const { getDataList, enableDateRange, dateRange } = useData();
  // console.log("🎯 CreateSlideDialog getDataList:", getDataList());

  const [newSlideTitle, setNewSlideTitle] = useState("New Slide");
  const [newSlideType, setNewSlideType] = useState("");
  const [newSlide, setNewSlide] = useState({ ...INITIAL_NEW_SLIDE });

  // Advanced Filter Section
  const [isAdvancedFilterEnabled, setIsAdvancedFilterEnabled] = useState(false);

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

  // Summary Content Section
  const [isSummaryContentRemoveMode, setIsSummaryContentRemoveMode] =
    useState(false);

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

  // Advanced Filter Section
  const handleIsAdvancedFilterEnabledChange = (value) => {
    setIsAdvancedFilterEnabled((prev) => {
      if (value) {
        setNewSlide((prev) => ({
          ...prev,
          advancedFilterBy: "",
          advancedFilter: "",
          advancedGroupBy: "",
        }));
      }
      setNewSlide((prev) => ({ ...prev, dataGroupBy: "" }));
      return value;
    });
  };

  const handleAdvancedFilterChange = (value) => {
    console.log("🎯 handleAdvancedFilterChange:", value);
    setNewSlide((prev) => ({
      ...prev,
      advancedFilter: value,
      advancedFilterBy: "",
      advancedGroupBy: "",
    }));
  };

  const handleAdvancedFilterByChange = (value) => {
    console.log("🎯 handleAdvancedFilterByChange:", value);
    setNewSlide((prev) => ({
      ...prev,
      advancedFilterBy: value,
      advancedGroupBy: "",
    }));
  };

  const handleAdvancedGroupByChange = (value) => {
    console.log("🎯 handleAdvancedGroupByChange:", value);
    setNewSlide((prev) => ({ ...prev, advancedGroupBy: value }));
  };

  ////////////////////////////

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
        extraContentType: "none",
        summaryPosition: "bottom",
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
    if (newSlideType === "single-table-slide") {
      return CUSTOM_TABLE;
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
    if (
      newSlideType === "overall-slide" ||
      newSlideType === "single-table-slidee"
    ) {
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
    setNewSlide((prev) => {
      let returnData = {
        ...prev,
        summaryContent: INITIAL_NEW_SLIDE.summaryContent,
      };
      const allData = getDataList();
      const selectedData = allData.find((d) => d.label === value);

      const rawData = selectedData.value.rawData;
      // const dataMetric = selectedData.value.metrics;
      const firstRowKeys = Object.keys(rawData[0]);
      // const cleanedData = cleanObjectData(rawData, dataMetric);
      // console.log("cleanedData", cleanedData);

      // const channelList = cleanedData.reduce((acc, item) => {
      //   const channel = item["Channel"];
      //   if (!acc.includes(channel)) {
      //     acc.push(channel);
      //   }
      //   return acc;
      // }, []);

      // console.log("channelList", channelList);

      const groupBy = firstRowKeys.filter((key) =>
        GROUP_BY_LIST.some(
          (item) => item.value.includes(key) || key.includes(item.value)
        )
      );
      setExtraContentType("none");
      setIsAdvancedFilterEnabled(false);
      const chartData = selectedData.value.demographicData;
      if (!chartData) {
        returnData = {
          ...returnData,
          dataSource: value,
          dataGroupBy: groupBy[0],
          dataChannel: "All",
          extraContentType: "none",
          advancedFilter: "",
          advancedFilterBy: "",
          advancedGroupBy: "",
          demographicChart: [
            {
              title: "Chart 1",
              chartBy: "",
              dataBy: "",
            },
            {
              title: "Chart 2",
              chartBy: "None",
              dataBy: "",
            },
          ],
        };
        return returnData;
      }
      const chartDataList = Object.keys(chartData[0] || {}).filter((key) =>
        DEMOGRAPHIC_CHART_BY_LIST.some((item) => {
          return item === key || item.includes(key) || key.includes(item);
        })
      );

      const chartDataAllKeys = Object.keys(chartData[0] || {});
      const chartDataOnlyNumeric = chartDataAllKeys.filter((key) => {
        return ![...NON_NUMERIC_COLUMNS, "Cost"].includes(key);
      });

      returnData = {
        ...returnData,
        dataSource: value,
        dataGroupBy: groupBy[0],
        dataChannel: "All",
        extraContentType: "none",
        demographicChart: [
          {
            title: "Chart 1",
            chartBy: chartDataList[0],
            dataBy: chartDataOnlyNumeric[0],
          },
          {
            title: "Chart 2",
            chartBy: "None",
            dataBy: chartDataOnlyNumeric[0],
          },
        ],
      };
      return returnData;
    });
  };

  const handleDataGroupByChange = (value) => {
    setNewSlide((prev) => ({ ...prev, dataGroupBy: value }));
  };

  const handleDataChannelChange = (value) => {
    setNewSlide((prev) => ({ ...prev, dataChannel: value }));
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

  const handleFBPicturePerformByChange = (value) => {
    setNewSlide((prev) => ({ ...prev, FBPicturePerformBy: value }));
  };

  // Summary Content

  const handleSummaryContentAdd = () => {
    setNewSlide((prev) => {
      const newSummaryContent = [...(prev.summaryContent || [])];
      newSummaryContent.push({
        contentType: "overall",
        dataBy: "Conversions",
      });
      return { ...prev, summaryContent: newSummaryContent };
    });
  };

  const handleSummaryContentTypeChange = (value, summaryContentIndex) => {
    setNewSlide((prev) => {
      const newSummaryContent = [...(prev.summaryContent || [])];
      newSummaryContent[summaryContentIndex] = {
        ...newSummaryContent[summaryContentIndex],
        contentType: value, // value is already a string, not event.target.value
      };
      return { ...prev, summaryContent: newSummaryContent };
    });
  };

  const handleSummaryContentDataByChange = (value, summaryContentIndex) => {
    setNewSlide((prev) => {
      const newSummaryContent = [...(prev.summaryContent || [])];
      newSummaryContent[summaryContentIndex] = {
        ...newSummaryContent[summaryContentIndex],
        dataBy: value,
      };
      return { ...prev, summaryContent: newSummaryContent };
    });
  };

  const handleSummaryContentRemove = (index) => {
    setNewSlide((prev) => {
      const newSummaryContent = [...(prev.summaryContent || [])];
      newSummaryContent.splice(index, 1);
      return { ...prev, summaryContent: newSummaryContent };
    });
  };

  const handleSummaryContentPositionChange = (value, index) => {
    if (value === "up" && index > 0) {
      setNewSlide((prev) => {
        const newSummaryContent = [...(prev.summaryContent || [])];
        [newSummaryContent[index], newSummaryContent[index - 1]] = [
          newSummaryContent[index - 1],
          newSummaryContent[index],
        ];
        return { ...prev, summaryContent: newSummaryContent };
      });
    }
    if (value === "down" && index < newSlide.summaryContent.length - 1) {
      setNewSlide((prev) => {
        const newSummaryContent = [...(prev.summaryContent || [])];
        [newSummaryContent[index], newSummaryContent[index + 1]] = [
          newSummaryContent[index + 1],
          newSummaryContent[index],
        ];
        return { ...prev, summaryContent: newSummaryContent };
      });
    }
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

  // Hook 1: Extract and clean raw data
  const rawData = useMemo(() => {
    const allData = getDataList();
    const selectedData = allData.find((d) => d.label === newSlide.dataSource);

    if (!selectedData?.value?.rawData) return [];

    const rawData = selectedData.value.rawData;
    const metrics = selectedData.value.metrics;

    if (!Array.isArray(rawData) || rawData.length === 0) return [];
    if (Object.keys(rawData[0]).length === 0) return [];

    let cleanedData = cleanObjectData(rawData, metrics);

    if (enableDateRange && dateRange.from && dateRange.to) {
      cleanedData = filterDataByDateRange(
        cleanedData,
        dateRange.from,
        dateRange.to
      );
    }

    return cleanedData;
  }, [newSlide.dataSource, getDataList, enableDateRange, dateRange]);

  // Hook 2: Get data source list
  const dataSourceList = useMemo(() => {
    const allData = getDataList();

    const isValidDataSource = (dataItem) => {
      if (!dataItem?.value?.rawData) return false;

      const rawData = dataItem.value.rawData;
      const metrics = dataItem.value.metrics;

      if (!Array.isArray(rawData) || rawData.length === 0) return false;
      if (Object.keys(rawData[0]).length === 0) return false;

      let cleanedData = cleanObjectData(rawData, metrics);

      if (enableDateRange && dateRange.from && dateRange.to) {
        cleanedData = filterDataByDateRange(
          cleanedData,
          dateRange.from,
          dateRange.to
        );
      }

      return cleanedData.length > 0;
    };

    return allData.filter(isValidDataSource).map((dataItem) => ({
      label: dataItem.label,
      value: dataItem.label,
    }));
  }, [getDataList, enableDateRange, dateRange]);

  // Hook 3: Get group by list
  const dataGroupByList = useMemo(() => {
    if (rawData.length === 0) return [];

    const firstRowKeys = Object.keys(rawData[0]);

    return firstRowKeys.filter((key) =>
      GROUP_BY_LIST.some(
        (item) => item.value.includes(key) || key.includes(item.value)
      )
    );
  }, [rawData]);

  // Hook 4: Get channel list
  const dataChannelList = useMemo(() => {
    if (rawData.length === 0) return [];

    return rawData.reduce((acc, item) => {
      const channel = item["Channel"];
      if (channel && !acc.includes(channel)) {
        acc.push(channel);
      }
      return acc;
    }, []);
  }, [rawData]);

  // Hook 5: Get chart data lists
  const { chartDataList, chartDataByList } = useMemo(() => {
    const allData = getDataList();
    const selectedData = allData.find((d) => d.label === newSlide.dataSource);

    const chartData = selectedData?.value?.demographicData;

    if (!chartData || chartData.length === 0) {
      return {
        chartDataList: [],
        chartDataByList: [],
      };
    }

    const chartDataAllKeys = Object.keys(chartData[0] || {});

    const chartDataOnlyNumeric = chartDataAllKeys.filter((key) => {
      return ![...NON_NUMERIC_COLUMNS, "Cost"].includes(key);
    });

    const chartDataList = chartDataAllKeys.filter((key) =>
      DEMOGRAPHIC_CHART_BY_LIST.some((item) => {
        return item === key || item.includes(key) || key.includes(item);
      })
    );

    return {
      chartDataList,
      chartDataByList: chartDataOnlyNumeric,
    };
  }, [newSlide.dataSource, getDataList]);

  // Hook 6: Get advanced filter list
  const advancedFilterList = useMemo(() => {
    return dataGroupByList.filter((item) => item.toLowerCase() !== "ad name");
  }, [dataGroupByList]);

  // Hook 7: Get advanced filter by list
  const advancedFilterByList = useMemo(() => {
    if (rawData.length === 0 || newSlide.advancedFilter === "") return [];

    const keyList = rawData.reduce((acc, item) => {
      const key = item[newSlide.advancedFilter];
      if (key && !acc.includes(key)) {
        acc.push(key);
      }
      return acc;
    }, []);

    // console.log("keyList", keyList);
    return keyList;
  }, [newSlide.advancedFilter, rawData]);

  // Hook 8: Get advanced group by list
  const advancedGroupByList = useMemo(() => {
    if (newSlide.advancedFilter === "" || dataGroupByList.length === 0)
      return [];

    return dataGroupByList.filter(
      (item) => item.toLowerCase() !== newSlide.advancedFilter.toLowerCase()
    );
  }, [newSlide.advancedFilter, dataGroupByList]);

  // console.log("🎯 newSlide:", newSlide);

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
                        {dataSourceList.map((data, index) => (
                          <SelectItem key={index} value={data.label}>
                            {data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newSlide?.dataSource !== "" && (
                      <>
                        <div className="flex gap-2 items-center">
                          <Label
                            htmlFor="data-group-by"
                            className="text-sm font-medium"
                          >
                            Channel:
                          </Label>
                          <Select
                            value={newSlide.dataChannel}
                            onValueChange={handleDataChannelChange}
                          >
                            <SelectTrigger id="data-group-by">
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="All">All</SelectItem>
                              {dataChannelList.map((item, index) => (
                                <SelectItem key={index} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            <Checkbox
                              checked={isAdvancedFilterEnabled}
                              onCheckedChange={
                                handleIsAdvancedFilterEnabledChange
                              }
                            />
                            Advanced Filter
                          </Label>
                        </div>

                        {isAdvancedFilterEnabled ? (
                          <>
                            <div className="flex gap-2 items-center">
                              <Label
                                htmlFor="group-filter"
                                className="text-sm font-medium"
                              >
                                Group Filter:
                              </Label>
                              <Select
                                value={newSlide.advancedFilter}
                                onValueChange={handleAdvancedFilterChange}
                              >
                                <SelectTrigger id="group-filter">
                                  <SelectValue placeholder="Select group filter" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {advancedFilterList.map((groupBy, index) => (
                                    <SelectItem key={index} value={groupBy}>
                                      {groupBy}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-2 items-center">
                              <Label
                                htmlFor="group-filter-by"
                                className="text-sm font-medium"
                              >
                                Group Filter By:
                              </Label>
                              <Select
                                value={newSlide.advancedFilterBy}
                                onValueChange={handleAdvancedFilterByChange}
                              >
                                <SelectTrigger id="group-filter-by">
                                  <SelectValue placeholder="Select group filter by" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {advancedFilterByList.map(
                                    (groupBy, index) => (
                                      <SelectItem key={index} value={groupBy}>
                                        {groupBy}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-2 items-center">
                              <Label
                                htmlFor="advanced-group-by"
                                className="text-sm font-medium"
                              >
                                Group By:
                              </Label>
                              <Select
                                value={newSlide.advancedGroupBy}
                                onValueChange={handleAdvancedGroupByChange}
                              >
                                <SelectTrigger id="advanced-group-by">
                                  <SelectValue placeholder="Select group filter by" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  {advancedGroupByList.map((groupBy, index) => (
                                    <SelectItem key={index} value={groupBy}>
                                      {groupBy}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        ) : (
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
                                {dataGroupByList.map((groupBy, index) => (
                                  <SelectItem key={index} value={groupBy}>
                                    {groupBy}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
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
                      value={newSlide.extraContentType}
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
                          disabled={!newSlide.dataSource}
                        />
                        <Label
                          htmlFor="extra-demographic"
                          className={`cursor-pointer font-normal ${
                            !newSlide.dataSource &&
                            "text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          Demographic
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="picture"
                          id="extra-picture"
                          disabled={newSlide.dataSource !== "Facebook"}
                        />
                        <Label
                          htmlFor="extra-picture"
                          className={`cursor-pointer font-normal ${
                            newSlide.dataSource !== "Facebook" &&
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
                    {newSlide.extraContentType === "demographic" ? (
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
                                {chartDataList.map((chart, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={chart}
                                      id={`chart1-by-${chart}`}
                                    />
                                    <Label
                                      htmlFor={`chart1-by-${chart}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {chart}
                                    </Label>
                                  </div>
                                ))}
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
                                  "Impressions"
                                }
                                onValueChange={(value) =>
                                  handleChartDataByChange(value, 0)
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select data by" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* {DEMOGRAPHIC_DATA_LIST.map((data, index) => (
                                    <SelectItem key={index} value={data.value}>
                                      {data.label}
                                    </SelectItem>
                                  ))} */}
                                  {chartDataByList.map((data, index) => (
                                    <SelectItem key={index} value={data}>
                                      {data}
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
                                {chartDataList.map((chart, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                    onClick={() =>
                                      handleChartByChange(chart, 1)
                                    }
                                  >
                                    <RadioGroupItem
                                      value={chart}
                                      id={`chart2-by-${chart}`}
                                    />
                                    <Label
                                      htmlFor={`chart2-by-${chart}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {chart}
                                    </Label>
                                  </div>
                                ))}
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
                                  {/* {DEMOGRAPHIC_DATA_LIST.map((data, index) => (
                                    <SelectItem key={index} value={data.value}>
                                      {data.label}
                                    </SelectItem>
                                  ))} */}
                                  {chartDataByList.map((data, index) => (
                                    <SelectItem key={index} value={data}>
                                      {data}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : newSlide.extraContentType === "picture" ? (
                      <div className="p-4 border border-slate-200 rounded-md bg-slate-50 flex flex-col gap-2">
                        <Label className="text-sm font-medium">
                          Best Performance by:
                        </Label>
                        <Select
                          value={newSlide.FBPicturePerformBy}
                          onValueChange={handleFBPicturePerformByChange}
                        >
                          <SelectTrigger
                            id="data-group-by"
                            className={"bg-white"}
                          >
                            <SelectValue placeholder="Select group by" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {CUSTOM_TABLE.filter(
                              (item) => !item.value.startsWith("cp")
                            ).map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                {/* Summary Section */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-lg font-medium">Summary</h2>

                  {/* Summary Position */}
                  <div>
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
                          disabled={newSlide.extraContentType === "none"}
                        />
                        <Label
                          htmlFor="summary-position-right"
                          className={`cursor-pointer font-normal ${
                            newSlide.extraContentType === "none" &&
                            "text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          Right (Under Extra Content)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Summary Content */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Summary Content</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSummaryContentAdd()}
                          className="hover:bg-slate-100 rounded p-0.5 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-sm">Add</span>
                        </button>
                        <button
                          onClick={() =>
                            setIsSummaryContentRemoveMode(
                              !isSummaryContentRemoveMode
                            )
                          }
                          className={`text-sm font-medium transition-colors ${
                            isSummaryContentRemoveMode
                              ? "text-red-700 bg-red-50 px-2 py-1 rounded"
                              : "text-red-600 hover:text-red-700"
                          }`}
                        >
                          {isSummaryContentRemoveMode
                            ? "Cancel Remove"
                            : "Remove"}
                        </button>
                      </div>
                      <div className="flex flex-col">
                        {newSlide.dataSource &&
                          newSlide.summaryContent.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={`flex items-center gap-2 border border-slate-200 p-1 px-2 rounded-sm bg-white 
                                  ${
                                    isSummaryContentRemoveMode
                                      ? " hover:bg-red-50 hover:border-red-300 "
                                      : " hover:bg-slate-50 "
                                  }`}
                                onClick={() => {
                                  if (isSummaryContentRemoveMode) {
                                    handleSummaryContentRemove(index);
                                  }
                                }}
                              >
                                <div>
                                  <Select
                                    value={item.contentType}
                                    onValueChange={(value) =>
                                      handleSummaryContentTypeChange(
                                        value,
                                        index
                                      )
                                    }
                                    disabled={isSummaryContentRemoveMode}
                                  >
                                    <SelectTrigger
                                      id={`summary-content-type-${index}`}
                                      className={"bg-white"}
                                    >
                                      <SelectValue placeholder="Select content type" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      {SUMMARRY_CONTENT_LIST.map(
                                        (content, index) => (
                                          <SelectItem
                                            key={index}
                                            value={content.value}
                                          >
                                            {content.label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Select
                                    value={item.dataBy}
                                    onValueChange={(value) =>
                                      handleSummaryContentDataByChange(
                                        value,
                                        index
                                      )
                                    }
                                    disabled={isSummaryContentRemoveMode}
                                  >
                                    <SelectTrigger
                                      id={`summary-content-data-by-${index}`}
                                      className={"bg-white"}
                                    >
                                      <SelectValue placeholder="Select data by" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      {CUSTOM_TABLE.filter((itemf) =>
                                        item.contentType === "average-cpx"
                                          ? itemf.value.startsWith("cp")
                                          : !itemf.value.startsWith("cp")
                                      ).map((content, index) => (
                                        <SelectItem
                                          key={index}
                                          value={content.value}
                                        >
                                          {content.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {isSummaryContentRemoveMode ? (
                                  <div>
                                    <X className="h-3 w-3 text-red-500" />
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <button
                                      className={`hover:bg-slate-100 rounded p-0.5 ${
                                        index === 0 && "hidden"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSummaryContentPositionChange(
                                          "up",
                                          index
                                        );
                                      }}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </button>
                                    <button
                                      className={`hover:bg-slate-100 rounded p-0.5 ${
                                        index ===
                                          newSlide.summaryContent.length - 1 &&
                                        "hidden"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSummaryContentPositionChange(
                                          "down",
                                          index
                                        );
                                      }}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
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
