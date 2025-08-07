import React, { useState } from "react";
import SlideHeader from "./SlideHeader";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

function MediaPlan({ mediaPlanData }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Function to determine if a cell should be highlighted based on content
  const getCellClassName = (cellValue, rowIndex, colIndex) => {
    const baseClasses = "border px-2 py-1 text-xs";

    // Header row styling
    if (rowIndex === 3) {
      return `${baseClasses} bg-gray-100 font-semibold text-center`;
    }

    // Summary rows styling (last few rows)
    if (rowIndex >= mediaPlanData.length - 6) {
      return `${baseClasses} bg-gray-50 font-medium`;
    }

    // Awareness/Performance rows
    if (rowIndex <= 2) {
      return `${baseClasses} bg-blue-50 font-medium text-center`;
    }

    // Platform name column
    if (colIndex === 1 && cellValue && cellValue.trim() !== "") {
      return `${baseClasses} bg-yellow-50 font-medium`;
    }

    // Numeric values
    if (
      cellValue &&
      (cellValue.includes("THB") ||
        cellValue.includes("%") ||
        /^\d+,?\d*$/.test(cellValue.trim()))
    ) {
      return `${baseClasses} text-right font-mono`;
    }

    return baseClasses;
  };

  // Function to format cell content
  const formatCellContent = (cellValue) => {
    if (!cellValue || cellValue.trim() === "") {
      return "\u00A0"; // Non-breaking space for empty cells
    }

    // Handle multi-line content
    return cellValue.split("\n").map((line, index) => (
      <div key={index} className={index > 0 ? "mt-1" : ""}>
        {line}
      </div>
    ));
  };

  if (!mediaPlanData || mediaPlanData.length === 0) {
    return (
      <div className="flex flex-col py-7 px-10 border w-full h-[720px] gap-2 relative group bg-white">
        <SlideHeader title={"Media Plan"} />
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No media plan data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="media-plan-component"
      className="flex flex-col py-7 px-10 border w-full h-[720px] gap-2 relative group bg-white overflow-hidden"
    >
      {/* EDIT BUTTON */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          onClick={() => {
            setIsEditModalOpen(true);
          }}
          size="sm"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      <SlideHeader title={"Media Plan"} />

      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              {mediaPlanData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={getCellClassName(cell, rowIndex, colIndex)}
                    >
                      {formatCellContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {/* <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-lg font-bold text-blue-600">750,000 THB</div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-lg font-bold text-green-600">3 Months</div>
          <div className="text-sm text-gray-600">Campaign Duration</div>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-lg font-bold text-purple-600">28-38</div>
          <div className="text-sm text-gray-600">Est. Leads/Month</div>
        </div>
      </div> */}
    </div>
  );
}

export default MediaPlan;
