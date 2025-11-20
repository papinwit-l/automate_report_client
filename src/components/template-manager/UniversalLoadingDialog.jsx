import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Cog, Loader2 } from "lucide-react";
import AnimatedPogressBar from "../custom-ui/AnimatedPogressBar";

function UniversalLoadingDialog({ title, message, isProcessing }) {
  return (
    <Dialog open={isProcessing}>
      <DialogContent
        className="
          [&>button[data-slot='dialog-close']]:hidden 
          sm:max-w-md w-full max-w-lg 
          bg-white/80 dark:bg-zinc-900/80 
          backdrop-blur-xl
          border border-white/20 
          shadow-2xl 
          rounded-2xl 
          p-8
          animate-in fade-in zoom-in-95
        "
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center text-center gap-4">
              {/* Spinner */}
              <div className="flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <Cog className="w-8 h-8 text-white animate-spin" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {title}
              </h2>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>

        {/* Message */}
        <p className="text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 bg-white py-4 rounded-md">
          {message}
        </p>

        {/* Animated progress bar */}
        <AnimatedPogressBar />
      </DialogContent>
    </Dialog>
  );
}

export default UniversalLoadingDialog;
