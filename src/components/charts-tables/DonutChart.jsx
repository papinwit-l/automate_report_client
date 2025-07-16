import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonutChart = ({
  data,
  title,
  width = 300,
  height = 300,
  innerRadius = 60,
  outerRadius = 120,
  showLabels = true,
  showLegend = true,
  paddingAngle = 2,
  labelDistance = 140,
  isPercentage = false,
}) => {
  // Transform percentage string data to chart format
  const transformDataForChart = (dataObj, defaultColors = {}) => {
    // Add safety checks
    if (
      !dataObj ||
      typeof dataObj !== "object" ||
      Object.keys(dataObj).length === 0
    ) {
      return [];
    }

    return Object.entries(dataObj).map(([key, percentage], index) => ({
      name: key,
      value: parseFloat(percentage.replace("%", "")),
      color: defaultColors[key] || getDefaultColor(index),
    }));
  };

  // Default color generator
  const getDefaultColor = (index) => {
    const colors = [
      "#3B82F6",
      "#EC4899",
      "#F97316",
      "#06B6D4",
      "#8B5CF6",
      "#EF4444",
      "#10B981",
    ];
    return colors[index % colors.length];
  };

  // Early return if no data or empty object
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        )}
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // Handle different data formats
  let chartData = [];
  if (Array.isArray(data)) {
    // Already formatted chart data
    chartData = data;
  } else if (typeof data === "object") {
    // Object with percentage strings (your format)
    chartData = transformDataForChart(data);
  }

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
    fill,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Adjustable label line length
    const lineLength1 = 7; // First segment length (shortened)
    const lineLength2 = 7; // Second segment length (shortened)

    // Calculate label position (outside the pie)
    const labelRadius = outerRadius + lineLength1 + lineLength2;
    const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    // Calculate line points
    const lineRadius = outerRadius + lineLength1;
    const lineX = cx + lineRadius * Math.cos(-midAngle * RADIAN);
    const lineY = cy + lineRadius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* Custom label line - first segment */}
        <line
          x1={x}
          y1={y}
          x2={lineX}
          y2={lineY}
          stroke={fill} // Use the same color as the chart segment
          strokeWidth={1}
        />
        {/* Custom label line - second segment */}
        {/* <line
          x1={lineX}
          y1={lineY}
          x2={labelX}
          y2={labelY}
          stroke={fill} // Use the same color as the chart segment
          strokeWidth={1}
        /> */}

        {/* Label text */}
        <text
          x={labelX}
          y={labelY}
          fill={fill}
          textAnchor={labelX > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize="10"
          fontWeight="500"
        >
          {`${value}${isPercentage ? "%" : ""}`}
        </text>
      </g>
    );
  };

  const renderCustomizedLabel = ({ percent, x, y, index }) => {
    const color = chartData[index].color;

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const RenderCustomizedLabelLine = (props) => {
    const { points, stroke } = props;

    // Add safety checks for points
    if (!points || !Array.isArray(points) || points.length < 3) {
      return null;
    }

    // Ensure each point has x and y properties
    const [start, mid, end] = points;
    if (
      !start ||
      !mid ||
      !end ||
      typeof start.x !== "number" ||
      typeof start.y !== "number" ||
      typeof mid.x !== "number" ||
      typeof mid.y !== "number" ||
      typeof end.x !== "number" ||
      typeof end.y !== "number"
    ) {
      return null;
    }

    // Calculate center from the pie chart context
    const cx = width / 2;
    const cy = height / 2;

    const shortenedMid = {
      x: mid.x,
      y: mid.y,
    };

    const shortenedEnd = {
      x: end.x > cx ? cx + outerRadius + 20 : cx - outerRadius - 20,
      y: end.y,
    };

    return (
      <polyline
        stroke={stroke}
        strokeWidth={1}
        fill="black"
        points={`${start.x},${start.y} ${shortenedMid.x},${shortenedMid.y} ${shortenedEnd.x},${shortenedEnd.y}`}
      />
    );
  };

  // Loading/empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        )}
        <div className="text-center text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center ">
      {title && <h3 className="text-lg font-semibold text-center">{title}</h3>}

      <div className="flex w-full items-center gap-4">
        {/* Chart */}
        <div className="relative">
          <PieChart width={width} height={height}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              dataKey="value"
              //   label={isPercentage ? renderCustomizedLabel : { fontSize: 12 }}
              //   labelLine={{ strokeWidth: 10 }}
              label={CustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col justify-center gap-2 text-[10px]">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
