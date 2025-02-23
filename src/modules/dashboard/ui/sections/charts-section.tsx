import React from "react";
import { LineChartComponent } from "../components/line-chart";

export const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <LineChartComponent />
      <LineChartComponent />
    </div>
  );
};
