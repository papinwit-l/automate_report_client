import React, { memo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

const CreateSlidePreview = memo(({ slide }) => {
  const {
    title,
    Component,
    table = [],
    metricConvLength = 2,
    metricData = [],
    summaryPosition = "bottom",
    extraContentType = "none",
    demographicChart = [],
    dataGroupBy = "",
    dataChannel = "All",
    summaryContent = [],
    FBPicturePerformBy = "",
  } = slide;

  const dataSource = slide.dataSource;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!Component || dataSource === ""}
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
