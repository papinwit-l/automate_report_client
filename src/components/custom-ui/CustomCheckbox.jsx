import React from "react";

function CustomCheckbox({ checked }) {
  return (
    <div className="relative inline-flex items-center">
      <div
        className={`w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center ${
          checked ? "bg-teal-500 border-teal-500" : "bg-white"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g id="Interface / Check">
                {" "}
                <path
                  id="Vector"
                  d="M6 12L10.2426 16.2426L18.727 7.75732"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}

export default CustomCheckbox;
