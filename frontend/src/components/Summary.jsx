import React, { useEffect, useState } from "react";
import { BarChart,BarChartHorizontal } from "./Barchart";

const Summary = ({ mySummary, salary }) => {
  const [data, setData] = useState();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    delete mySummary.id;
    delete mySummary.user;
    delete mySummary.__v;
    delete mySummary._id;

    // percentage calculation
    const percentage = Object.values(mySummary).map((el) =>
      ((el / salary) * 100).toFixed(1)
    );

    // label for expense category
    const labelValues = Object.keys(mySummary);

    // add savings
    let sm = 0;
    for (let i = 0; i < percentage.length; i += 1) {
      sm += parseFloat(percentage[i]);
    }
    percentage.push(100 - sm);
    labelValues.push("savings");

    setLabels(labelValues);
    setData({
      labels: labelValues,
      datasets: [
        {
          label: "% of salary",
          backgroundColor: "green",
          data: percentage,
          fill: false,
        },
      ],
    });
  }, [mySummary, salary]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="flex-grow md:w-[60%] bg-[#0F0F0F] rounded-lg p-4 shadow-md m-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
          Expense distribution
        </h2>
        {data && <BarChart data={data} className="w-full p-4" />}
      </div>
    </div>
  );
};

const MonthlySummary = ({ mySummary, salary }) => {
  const [data, setData] = useState();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    delete mySummary.id;
    delete mySummary.user;
    delete mySummary.__v;
    delete mySummary._id;

    // percentage calculation
    const percentage = Object.values(mySummary).map((el) =>
      ((el / salary) * 100).toFixed(1)
    );

    // label for expense category
    const labelValues = Object.keys(mySummary);

    // add savings
    let sm = 0;
    for (let i = 0; i < percentage.length; i += 1) {
      sm += parseFloat(percentage[i]);
    }
    percentage.push(100 - sm);
    labelValues.push("savings");

    setLabels(labelValues);
    setData({
      labels: labelValues,
      datasets: [
        {
          label: "% of salary",
          backgroundColor: "green",
          data: percentage,
          fill: false,
        },
      ],
    });
  }, [mySummary, salary]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="flex-grow md:w-[60%] bg-[#0F0F0F] rounded-lg p-4 shadow-md m-4 overflow-x-auto">
        <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
          Expense distribution
        </h2>
        {data && <BarChartHorizontal data={data} className="w-full p-4" />}
      </div>
    </div>
  );
};

export {Summary, MonthlySummary};
