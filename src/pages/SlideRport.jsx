import Overall from "@/components/slides/Overall";
import React from "react";

function SlideRport() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>Slide Report</h1>
      <div className="flex flex-col w-full items-center gap-2">
        <Overall />
      </div>
    </div>
  );
}

export default SlideRport;
