import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BarChart = ({ data }) => {
  const options = {
    plugins: {
      datalabels: {
        color: "#fff", // Change the color of the data labels
        labels: {
          title: {
            font: {
              weight: "bold", // Change the font weight of the data labels
            },
          },
        },
        anchor: "end", // Change the anchor position of the data labels
        align: "-90", // Change the alignment of the data labels
      },
    },
    legend: {
      display: false, // Show or hide the legend
      position: "top", // Change the position of the legend
      labels: {
        color: "#fff", // Change the font color of the legend labels
        boxHeight: 10, // Change the height of the legend box
        boxWidth: 5, // Change the width of the legend box
      },
    },
  };    

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
