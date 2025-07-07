import React from "react";

function NumberDisplayBox({ title, value, isConversion = false }) {
  return (
    <div
      className={`flex flex-col py-3 px-4 rounded-lg ${
        isConversion ? "bg-red-300" : "bg-gray-300"
      }`}
    >
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl">{value}</h2>
    </div>
  );
}

export default NumberDisplayBox;
