import { MoveDown, MoveUp } from "lucide-react";
import React from "react";

function NumberDisplayBox({
  title,
  value,
  isConversion = false,
  compareValue = "No data",
  isNegative = false,
}) {
  return (
    <div
      className={`flex flex-col py-3 px-4 rounded-lg ${
        isConversion ? "bg-red-300" : "bg-gray-300"
      }`}
    >
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl">{value}</h2>
      <p
        className={`text-xs flex items-center ${
          compareValue == "No data"
            ? ""
            : isNegative
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {compareValue == "No data" ? (
          ""
        ) : isNegative ? (
          <MoveDown className="h-3 w-3" />
        ) : (
          <MoveUp className="h-3 w-3" />
        )}{" "}
        {compareValue}
      </p>
    </div>
  );
}

export default NumberDisplayBox;
