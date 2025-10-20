import React from "react";
import { useData } from "@/contexts/dataContext";
import SlideHeader from "../slides/SlideHeader";

function BlankMediaPlan({ id = "media-plan", title = "Media Plan" }) {
  const { loading, error, refetch } = useData();

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-4 items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      id={id}
      data-exportable={true}
      data-export-title={id}
      className="flex flex-col py-7 px-10 border w-7xl h-[720px] gap-2 relative group bg-white"
    >
      <SlideHeader title={title} />
    </div>
  );
}

export default BlankMediaPlan;
