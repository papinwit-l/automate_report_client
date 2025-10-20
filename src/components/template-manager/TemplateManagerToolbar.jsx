import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

function TemplateManagerToolbar({ slideTemplates, setSlideTemplates }) {
  const [showSlideSection, setShowSlideSection] = useState(true);
  return (
    <div className="h-full w-xs bg-slate-100 border-r p-4">
      {/* Slide Section */}
      <div className="flex flex-col rounded-md border border-slate-200 bg-white p-2">
        {/* Slide Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Slides</h2>
          <button
            onClick={() => setShowSlideSection(!showSlideSection)}
            className="flex items-center gap-2 text-sm text-slate-500"
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
          <div className="flex flex-col gap-2">
            {slideTemplates.map((slide, index) => {
              const id = `slide-${index}`;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 border-b border-slate-200 hover:bg-slate-50"
                >
                  {slide.title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateManagerToolbar;
