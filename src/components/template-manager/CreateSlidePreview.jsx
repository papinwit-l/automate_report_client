import React, { memo, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

const CreateSlidePreview = memo(({ slide }) => {
  const {
    title,
    name,
    Component,
    table = [],
    metricConvLength = 2,
    metricData = [],
    summaryPosition = "bottom",
    extraContentType = "none",
    demographicChart = [],
    dataGroupBy = "",
    dataChannel = "All",
    advancedFilter = "",
    advancedFilterBy = "",
    advancedGroupBy = "",
    summaryContent = [],
    FBPicturePerformBy = "",
  } = slide;

  // console.log("🎯 slide:", slide);

  const dataSource = slide.dataSource;

  const buttonStatus = useMemo(() => {
    if (!Component) return true;
    if (!name) return true;
    if (name !== "single-table-slide") return false;
    if (dataSource === "") return true;
    if (!dataGroupBy && !advancedFilter) return true;
    if (advancedFilter && (!advancedFilterBy || !advancedGroupBy)) return true;
    return false;
  }, [
    Component,
    name,
    dataSource,
    dataGroupBy,
    advancedFilter,
    advancedFilterBy,
    advancedGroupBy,
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={buttonStatus}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-none !max-h-none w-auto h-auto p-8 bg-black/90">
        <div className="flex items-center justify-center">
          <div className="w-[1280px] h-[720px] bg-white shadow-2xl overflow-hidden">
            {Component &&
              (dataSource ? (
                <Component
                  title={title}
                  table={table}
                  metricConvLength={metricConvLength}
                  metricData={metricData}
                  dataSource={dataSource}
                  summaryPosition={summaryPosition}
                  extraContentType={extraContentType}
                  demographicChart={demographicChart}
                  dataGroupBy={dataGroupBy}
                  dataChannel={dataChannel}
                  advancedFilter={advancedFilter}
                  advancedFilterBy={advancedFilterBy}
                  advancedGroupBy={advancedGroupBy}
                  summaryContent={summaryContent}
                  FBPicturePerformBy={FBPicturePerformBy}
                />
              ) : (
                <Component
                  title={title}
                  table={table}
                  metricConvLength={metricConvLength}
                  metricData={metricData}
                />
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CreateSlidePreview.displayName = "CreateSlidePreview";

export default CreateSlidePreview;
