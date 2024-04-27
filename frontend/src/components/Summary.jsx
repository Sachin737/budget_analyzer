import React, { useEffect, useState } from "react";
import BarChart from "./Barchart";

const Summary = ({ mySummary, salary }) => {
  const [data, setData] = useState();
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    delete mySummary.id;
    delete mySummary.user;
    delete mySummary.__v;
    delete mySummary._id;

    // percetage calculation
    const percentage = Object.values(mySummary).map((el) =>
      ((el / salary) * 100).toFixed(1)
    );

    // label for expense category
    const labelValues = Object.keys(mySummary);

    // add savings
    let sm  = 0;
    for(let i=0;i<percentage.length;i+=1){
      sm += parseFloat(percentage[i]);
    }           
    // console.log(percentage,sm)
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
  }, [mySummary]);

  return (
    <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-4 shadow-md mb-4 w-full md:w-[40%] md:mr-8 md:mb-0 md:ml-8">
      <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">Summary</h2>
      {data && <BarChart data={data} className="w-full p-4"></BarChart>}
    </div>
  );
};

export default Summary;
