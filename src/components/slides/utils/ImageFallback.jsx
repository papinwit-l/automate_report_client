import React, { useState } from "react";

function ImageFallback({ adsPicture }) {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {!adsPicture || imageError ? (
        <div className="max-h-[265px] max-w-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500 font-medium">
              No image available
            </p>
          </div>
        </div>
      ) : (
        <img
          src={adsPicture}
          alt="ads preview"
          className="max-h-[265px] max-w-full object-contain w-auto"
          onError={() => setImageError(true)}
        />
      )}
    </>
  );
}

export default ImageFallback;
