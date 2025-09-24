// import React from "react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Loader2, Presentation } from "lucide-react";

// const ExportLoadingDialog = ({ isOpen }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={() => {}}>
//       <DialogContent
//         className="sm:max-w-md border-0 shadow-2xl"
//         hideCloseButton
//       >
//         <div className="flex flex-col items-center justify-center py-8 px-6">
//           {/* Animated Icon Container */}
//           <div className="relative mb-6">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
//               <Presentation className="h-8 w-8 text-white" />
//             </div>
//             <div className="absolute inset-0 w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
//           </div>

//           {/* Title */}
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             Creating Presentation
//           </h3>

//           {/* Description */}
//           <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">
//             Exporting your slides to Google Slides. This may take a few
//             moments...
//           </p>

//           {/* Animated Dots */}
//           <div className="flex space-x-1">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
//             <div
//               className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0.1s" }}
//             ></div>
//             <div
//               className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
//               style={{ animationDelay: "0.2s" }}
//             ></div>
//           </div>

//           {/* Warning Text */}
//           <p className="text-xs text-gray-400 text-center mt-6">
//             Please don't close this window
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ExportLoadingDialog;

import React from "react";
import { Loader2, Presentation } from "lucide-react";

const ExportLoadingDialog = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 transition-opacity" />

      {/* Modal */}
      <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl border-0 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex flex-col items-center justify-center py-8 px-6">
            {/* Animated Icon Container */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Presentation className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Creating Presentation
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 text-center mb-4 max-w-xs">
              Exporting your slides to Google Slides. This may take a few
              moments...
            </p>

            {/* Animated Dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>

            {/* Warning Text */}
            <p className="text-xs text-gray-400 text-center mt-6">
              Please don't close this window
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportLoadingDialog;
