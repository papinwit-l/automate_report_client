import React from "react";

function TemplateContent({ slides = [] }) {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-200">
      <div className="flex flex-col gap-8 items-center py-4">
        {slides.map((slide, index) => {
          // console.log("slide", slide);
          const id = `slide-${index}`;
          const Component = slide.Component;
          const table = slide.table || [];
          const metricData = slide.metricData || [];
          const metricConvLength = slide.metricConvLength || 2;
          if (!Component) return null;
          return (
            <Component
              key={index}
              id={id}
              title={slide.title}
              table={table}
              metricData={metricData}
              metricConvLength={metricConvLength}
            />
          );
        })}
      </div>
    </main>
  );
}

export default TemplateContent;
