import React from "react";
import { Flame } from "lucide-react";

const SpiceLevelIndicator = ({ level }) => {
  const spiceLevels = {
    Mild: {
      color: "text-green-500",
      flames: 1,
      bg: "bg-green-200",
      tooltip: "Spicelevel - Light spice",
      text: "text-green-800",
    },
    Medium: {
      color: "text-orange-500",
      flames: 1,
      text: "text-orange-800",
      bg: "bg-orange-100",
      tooltip: "Spicelevel - Moderate heat",
    },
    Spicy: {
      color: "text-red-500",
      flames: 1,
      bg: "bg-red-100",
      text: "text-red-800",
      tooltip: "Spicelevel- Spicy Hot!",
    },
  };

  const config = spiceLevels[level] || spiceLevels.Mild;

  return (
    <div className="group relative">
      <div
        className={`flex items-center gap-0.5 px-2 py-1 rounded-full ${config.bg}`}
      >
        <p className={` text-sm ${config.text}`}>{level}</p>
        {[...Array(config.flames)].map((_, index) => (
          <Flame
            key={index}
            className={`w-4 h-4 ${config.color} ${
              index > 0 ? "-ml-2" : ""
            } transition-transform duration-300 hover:scale-110`}
            style={{
              transform: `rotate(${index % 2 === 0 ? "-15deg" : "15deg"})`,
            }}
          />
        ))}
      </div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {config.tooltip}
      </div>
    </div>
  );
};
const ShortlistedItem = ({ name, quantity, spiceLevel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md items-center p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center gap-1">
          {spiceLevel && <SpiceLevelIndicator level={spiceLevel} />}
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
            ×{quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShortlistedItem;
