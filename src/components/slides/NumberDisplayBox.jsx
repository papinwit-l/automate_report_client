import React from "react";

function NumberDisplayBox({ title, value }) {
  return (
    <div className="flex flex-col bg-gray-300 py-3 px-4 rounded-lg">
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl">{value}</h2>
    </div>
  );
}

export default NumberDisplayBox;
