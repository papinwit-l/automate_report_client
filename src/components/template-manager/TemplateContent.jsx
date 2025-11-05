import React from "react";

function TemplateContent({ slides = [] }) {
  console.log("🎯 slides:", slides);
  return (
    <main className="flex-1 overflow-y-auto bg-slate-200">
      <div className="flex flex-col gap-8 items-center py-4">
        {slides.map((slide, index) => {
          // console.log("slide", slide);
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
          } = slide;

          const id = `slide-${index}`;

          const dataSource = slide.dataSource;

          if (!Component) return null;

          return dataSource ? (
            <Component
              id={id}
              key={id}
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
            />
          ) : (
            <Component
              id={id}
              key={id}
              title={title}
              table={table}
              metricConvLength={metricConvLength}
              metricData={metricData}
            />
          );
        })}
      </div>
    </main>
  );
}

export default TemplateContent;
