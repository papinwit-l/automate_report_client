"use client";

import { FilterIcon, X } from "lucide-react";
import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { useData } from "@/contexts/DataContext";
import SearchCheckbox from "../custom-ui/SearchCheckbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import createAxiosInstance from "@/configs/axiosConfigs";

function SidebarProjectFilterSection({ sheetsID }) {
  const {
    enableProjectFilter,
    setEnableProjectFilter,
    projectList,
    setProjectList,
    projectFilter,
    setProjectFilter,
  } = useData();

  const [projectSearch, setProjectSearch] = React.useState("");
  const [projectSearchResults, setProjectSearchResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(sheetsID?.length > 0);

  const onEnableProjectFilterChange = (event) => {
    setEnableProjectFilter(event.target.checked);
  };

  const fetchProjectList = async () => {
    const axiosInstance = await createAxiosInstance();
    setIsLoading(true);
    setProjectList([]);
    setProjectFilter([]);
    try {
      const response = await axiosInstance.get(
        `/data-sheets/project-list/${sheetsID}`
      );
      const rawData = response.data.data;
      // console.log("🎯 rawData:", rawData);
      setProjectList(rawData);
      setProjectFilter(rawData);
    } catch (error) {
      console.error("Error fetching project list:", error);
      setProjectList([]);
      setProjectFilter([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sheetsID.length > 0) {
      fetchProjectList();
    } else {
      setIsLoading(false);
    }
  }, [sheetsID]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <FilterIcon className="h-4 w-4 text-green-600" />
          <h3 className="font-medium text-sm">Project Filter</h3>
        </div>
        <Card className="shadow-sm py-1">
          <CardContent className="p-4 py-2">
            <div className="flex items-center justify-center py-2">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <p className="text-sm text-gray-500">Loading projects...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return sheetsID.length ? (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <FilterIcon className="h-4 w-4 text-green-600" />
        <h3 className="font-medium text-sm">Project Filter</h3>
      </div>

      <Card className="shadow-sm py-1">
        <CardContent className="p-4 space-y-2 py-2">
          {/* <div className="flex items-center space-x-2">
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
          </div> */}

          <div className="flex flex-col gap-2">
            {/* <Label htmlFor="project-filter" className="text-sm font-medium">
                Projects
              </Label> */}
            <SearchCheckbox
              inputValue={projectSearch}
              setInputValue={setProjectSearch}
              items={projectList}
              filteredItems={projectSearchResults}
              setFilteredItems={setProjectSearchResults}
              selectedItem={projectFilter}
              setSelectedItem={setProjectFilter}
              className="w-full"
            />
          </div>
          {projectFilter && projectFilter.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {projectFilter.map((item, id) => {
                return (
                  <Badge
                    id={id}
                    key={id}
                    className="text-xs font-medium bg-amber-100 text-amber-700 hover:border-amber-300"
                  >
                    {item}{" "}
                    <button
                      onClick={() =>
                        setProjectFilter(
                          projectFilter.filter((i) => i !== item)
                        )
                      }
                    >
                      <X className="text-xs w-3 h-3 hover:cursor-pointer" />
                    </button>
                  </Badge>
                );
              })}
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
