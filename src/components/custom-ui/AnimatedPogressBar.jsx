import React from "react";

function AnimatedPogressBar() {
  return (
    <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[loadingBar_1.4s_ease-in-out_infinite]" />
      {/* Custom animation */}
      <style>
        {`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(50%); }
              100% { transform: translateX(200%); }
            }
          `}
      </style>
    </div>
  );
}

export default AnimatedPogressBar;
