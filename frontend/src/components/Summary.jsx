import React, { useEffect, useState } from "react";
import { BarChart, BarChartHorizontal } from "./Barchart";
import _, { update } from "lodash";

const Summary = ({ mySummary, salary }) => {
  const [data, setData] = useState();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (!mySummary || salary === 0) return;

    const updatedSummary = _.omit(mySummary, ["id", "user", "__v", "_id"]);

    // percentage calculation
    const percentage = Object.values(updatedSummary).map((el) =>
      ((el / salary) * 100).toFixed(1)
    );

    // label for expense category
    const labelValues = Object.keys(updatedSummary);

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

const MonthlySummary = ({
  mySummary,
  salary,
  selectedYear,
  setSelectedYear,
}) => {
  const [data, setData] = useState();
  const [updatedSummary, setUpdatedSummary] = useState([]);

  // Label for expense categories
  const labelValues = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const tmpObj = [];
    // Extract data from mySummary to format it for display
    for (const x of mySummary?.data?.expenses || []) {
      const dateObj = new Date(x.purchasedAt);
      const month = dateObj.toLocaleString("default", { month: "long" });
      const year = dateObj.getFullYear();

      tmpObj.push({
        item: x.commodityName,
        totalCost: x.cost,
        month: month,
        year: year,
      });
    }
    setUpdatedSummary(tmpObj);
  }, [mySummary]);

  useEffect(() => {
    if (selectedYear.length === 0) {
      setSelectedYear(new Date().getFullYear().toString());
    }
  }, []);

  useEffect(() => {
    // Filter data based on selectedYear
    const filteredData = updatedSummary.filter(
      (entry) => entry.year.toString() === selectedYear
    );

    // Prepare data for display
    const labels = labelValues.map((month) => month.slice(0, 3)); // Shorten month names
    const dataset = {
      label: "Expense (in rupees)",
      backgroundColor: "green",
      data: labels.map((label) => {
        const filteredEntry = filteredData.find((entry) =>
          entry.month.startsWith(label)
        );
        return filteredEntry ? filteredEntry.totalCost : 0;
      }),
      fill: false,
    };

    // console.log(dataset);

    setData({
      labels: labels,
      datasets: [dataset],
    });
  }, [updatedSummary, salary, selectedYear]);

  const handleYearChange = (event) => {
    try {
      const year = event.target.value;
      setSelectedYear(year); // Update selectedYear state
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="flex-grow md:w-[60%] bg-[#0F0F0F] rounded-lg p-4 shadow-md m-4 overflow-x-auto">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Expense {selectedYear}
          </h2>
          <div className="flex flex-row h-8 items-center">
            <label htmlFor="year" className="text-[#EEEEEE] mr-2">
              Filter:
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 bg-white rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Year</option>
              {_.uniq(updatedSummary.map((entry) => entry.year)).map(
                (year, index) => (
                  <option key={index} value={year.toString()}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        {data && <BarChartHorizontal data={data} className="w-full p-8" />}
      </div>
    </div>
  );
};

export { Summary, MonthlySummary };
