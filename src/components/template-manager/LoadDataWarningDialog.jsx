import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

function LoadDataWarningDialog({ open, onOpenChange, onCancel }) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button[data-slot='dialog-close']]:hidden sm:max-w-md">
        <DialogHeader className="flex flex-col gap-4">
          {/* Icon with gradient background */}
          <div className="mx-auto flex h-12 w-12 mb-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>

          {/* Title */}
          <DialogTitle className="text-center text-xl mb-0">
            Data Required
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="text-center leading-relaxed">
            You need to load data before editing this template. Please load your
            data first to enable template editing features.
          </DialogDescription>
        </DialogHeader>

        {/* Footer with centered button */}
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleCancel} className="w-full sm:w-auto">
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LoadDataWarningDialog;
