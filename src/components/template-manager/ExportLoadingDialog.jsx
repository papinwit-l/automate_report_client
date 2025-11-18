import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2 } from "lucide-react";

function ExportLoadingDialog({ open, inputLogs }) {
  const [logs, setLogs] = useState([]);
  const [showFullLogs, setShowFullLogs] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (inputLogs) {
      setLogs((prev) => [...prev, inputLogs]);
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
        className="[&>button[aria-label='Close']]:hidden"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <span>Exporting slides...</span>
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-sm p-2">
          {showFullLogs ? (
            <>
              {logs.map((log, idx) => (
                <div key={idx} className="text-sm font-mono">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </>
          ) : (
            <div className="text-sm font-mono">
              {logs[logs.length - 1] || "Waiting..."}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFullLogs(!showFullLogs)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showFullLogs ? "Show Less" : "Show More Details"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default ExportLoadingDialog;
