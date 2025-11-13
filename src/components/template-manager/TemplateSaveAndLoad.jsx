import React, { useRef } from "react";
import { Button } from "../ui/button";
import { CREATE_SLIDE_LIST } from "@/configs/templateManagerConfig";
import { useData } from "@/contexts/DataContext";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function TemplateSaveAndLoad(props) {
  const { slide, setSlide } = props;
  const { isNoData } = useData();

  const fileInputRef = useRef(null);

  const handleSave = async () => {
    try {
      // Check if File System Access API is supported
      if ("showSaveFilePicker" in window) {
        // Show native save dialog
        const handle = await window.showSaveFilePicker({
          suggestedName: `slide-template-${Date.now()}.json`,
          types: [
            {
              description: "JSON Files",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });

        // Create a writable stream
        const writable = await handle.createWritable();

        // Write the data
        const dataStr = JSON.stringify(slide, null, 2);
        await writable.write(dataStr);

        // Close the file
        await writable.close();

        console.log("File saved successfully!");
      } else {
        // Fallback to download method for unsupported browsers
        handleSaveDownload();
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        console.error("Error saving file:", error);
        alert("Error saving file");
      }
    }
  };

  // Fallback download method
  const handleSaveDownload = () => {
    const dataStr = JSON.stringify(slide, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `slide-template-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoad = async () => {
    try {
      // Check if File System Access API is supported
      if ("showOpenFilePicker" in window) {
        // Show native open dialog
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: "JSON Files",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
          multiple: false,
        });

        // Read the file
        const file = await fileHandle.getFile();
        const contents = await file.text();

        // Parse and set data
        const loadedData = JSON.parse(contents);
        const completeData = loadedData.map((item) => {
          // Map Component to loaded data
          const name = item.name;

          const slideDetect = CREATE_SLIDE_LIST.find((sld) => {
            // console.log("🎯 slide:", sld);
            return sld.name === name;
          });

          return {
            ...item,
            Component: slideDetect.Component || null,
          };
        });
        // setSlide(loadedData);
        console.log("completeData", completeData);
        setSlide(completeData);

        console.log("File loaded successfully!");
      } else {
        // Fallback to input method
        fileInputRef.current?.click();
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== "AbortError") {
        console.error("Error loading file:", error);
        alert("Error loading file");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target.result);
        setSlide(loadedData);
        console.log("Template loaded successfully!");
      } catch (error) {
        console.error("Error loading template:", error);
        alert("Error loading file. Please make sure it's a valid JSON file.");
      }
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleSave}>Save</Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button onClick={handleLoad} disabled={isNoData}>
                {isNoData && <AlertCircle className="w-4 h-4" />}
                Load
              </Button>
            </span>
          </TooltipTrigger>
          {isNoData && (
            <TooltipContent>
              <p>Please load data from raw dashboard first.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Hidden file input - fallback for unsupported browsers */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default TemplateSaveAndLoad;
