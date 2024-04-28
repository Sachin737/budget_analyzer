import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const SummaryPieChart = ({ salary, investment, expense }) => {
  const [saving, setSaving] = useState(0);

  useEffect(() => {
    setSaving(salary - investment - expense);
    // console.log(salary, investment, expense, saving);
  }, [salary, investment, expense, saving]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="flex-grow md:w-[60%] bg-[#0F0F0F] rounded-lg p-4 shadow-md m-4 overflow-x-auto">
        <div className="flex flex-row items-center justify-around">
        <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">Summary</h2>
        <h3 className="text-md font-light text-[#EEEEEE] mb-4 border border-solid border-purple-500 rounded-lg py-2 px-1 bg-purple-900">salary: {salary}</h3>
        </div>
        <PieChart
          width={600}
          height={320}
          series={[
            {
              arcLabel: (item) =>
                `${((100 * item.value) / salary).toFixed(2)}%`,
              arcLabelMinAngle: 10,
              data: [
                { id: 0, value: investment, label: "investment" },
                { id: 1, value: expense, label: "expense", color: "#ff1b1e" },
                { id: 2, value: saving, label: "saving", color: "#a5cc00" },
              ],

              highlightScope: { faded: "global", highlighted: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },

              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 360,
              cx: 200,
              cy: 150,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryPieChart;
