import { FilterIcon } from "lucide-react";
import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { useData } from "@/contexts/DataContext";
import axiosInstance from "@/configs/axiosConfigs";

function SidebarProjectFilterSection({ sheetsID }) {
  const {
    enableProjectFilter,
    setEnableProjectFilter,
    projectList,
    setProjectList,
    projectFilter,
    setProjectFilter,
  } = useData();

  const onEnableProjectFilterChange = (event) => {
    setEnableProjectFilter(event.target.checked);
  };

  const fetchProjectList = async () => {
    const response = await axiosInstance.get(
      `/data-sheets/project-list/${sheetsID}`
    );
    const rawData = response.data.data;
    const projectIndex = rawData[0].findIndex((item) => item === "Project");
    console.log("🎯 rawData:", rawData);
    console.log("🎯 projectIndex:", projectIndex);
    console.log("🎯 projectList:", rawData[0][projectIndex]);
  };

  useEffect(() => {
    if (sheetsID.length > 0) {
      fetchProjectList();
    }
  }, [sheetsID]);

  return sheetsID.length ? (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <FilterIcon className="h-4 w-4 text-green-600" />
        <h3 className="font-medium text-sm">Project Filter</h3>
      </div>

      <Card className="shadow-sm py-1">
        <CardContent className="p-4 space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="project-filter-enable"
              checked={enableProjectFilter}
              onChange={onEnableProjectFilterChange}
              className="rounded border-gray-300"
            />
            <Label
              htmlFor="project-filter-enable"
              className="text-sm font-medium"
            >
              Enable project filter
            </Label>
          </div>

          {enableProjectFilter && (
            <div className="pt-2 flex flex-col gap-2">
              <Label htmlFor="project-filter" className="text-sm font-medium">
                Projects
              </Label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  ) : (
    <></>
  );
}

export default SidebarProjectFilterSection;
