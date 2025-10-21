import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

function TemplateManagerToolbar({ slideTemplates, setSlideTemplates }) {
  const [showSlideSection, setShowSlideSection] = useState(true);
  const [showDataSection, setShowDataSection] = useState(true);

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

  return (
    <div className="h-full w-xs bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 p-4 flex flex-col gap-4">
      {/* Data Section */}
      <div className="flex flex-col rounded-lg overflow-hidden shadow-sm border border-slate-200">
        {/* Data Section Title */}
        <div className="flex items-center justify-between bg-white p-3 cursor-pointer transition-colors">
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
        {/* Data Section Content - Add your content here */}
        {showDataSection && (
          <div className="p-3 bg-slate-50/50">
            {/* Data content goes here */}
          </div>
        )}
      </div>

      {/* Slide Section */}
      <div className="flex flex-col rounded-lg overflow-hidden shadow-sm border border-slate-200">
        {/* Slide Section Title */}
        <div className="flex items-center justify-between bg-white p-3 cursor-pointer transition-colors">
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
          <div className="flex flex-col gap-1.5 p-2 bg-slate-50/50">
            {slideTemplates.map((slide, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <span className="text-sm text-slate-700 font-medium truncate flex-1">
                  {slide.title}
                </span>
                <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      onClick={() => handleSlideSwap(index, "up")}
                      className="flex items-center justify-center p-1 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      aria-label="Move slide up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  )}
                  {index < slideTemplates.length - 1 && (
                    <button
                      onClick={() => handleSlideSwap(index, "down")}
                      className="flex items-center justify-center p-1 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      aria-label="Move slide down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateManagerToolbar;
