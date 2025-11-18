import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

function ExportLoadingDialog({ open, inputLogs }) {
  const [logs, setLogs] = useState([]);
  const [showFullLogs, setShowFullLogs] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (inputLogs) {
      setLogs(inputLogs);
    }
  }, [inputLogs]);

  useEffect(() => {
    if (!open) {
      setLogs([]);
      setShowFullLogs(false);
    }
  }, [open]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="[&>button[aria-label='Close']]:hidden sm:max-w-md"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin relative" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Exporting slides
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <div
              className={`bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200/60 shadow-sm transition-all duration-300 ${
                showFullLogs ? "max-h-96 p-4" : "p-3"
              } overflow-hidden`}
            >
              <div
                className={`${
                  showFullLogs ? "max-h-80 overflow-y-auto" : ""
                } space-y-2`}
              >
                {showFullLogs ? (
                  <>
                    {logs.map((log, idx) => (
                      <div
                        key={idx}
                        className="text-sm font-mono text-gray-700 bg-white/60 px-3 py-2 rounded border border-gray-200/40 animate-in fade-in slide-in-from-bottom-1 duration-200"
                      >
                        {log}
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </>
                ) : (
                  <div className="text-sm font-mono text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                    {inputLogs[inputLogs.length - 1] ||
                      "Initializing export..."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowFullLogs(!showFullLogs)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-all duration-200 group"
          >
            <span>{showFullLogs ? "Show Less" : "Show All Logs"}</span>
            {showFullLogs ? (
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-gray-200/60">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

export default ExportLoadingDialog;
