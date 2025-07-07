import Overall from "@/components/slides/Overall";
import { Button } from "@/components/ui/button";
import React from "react";

function SlideRport() {
  const [isOverallEditModalOpen, setIsOverallEditModalOpen] =
    React.useState(false);
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1>Slide Report</h1>
      <div className="flex flex-col w-full items-center gap-2">
        <div className="flex gap-2">
          <Button onClick={() => setIsOverallEditModalOpen(true)}>Edit</Button>
          <Overall
            isOverallEditModalOpen={isOverallEditModalOpen}
            setIsOverallEditModalOpen={setIsOverallEditModalOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default SlideRport;
