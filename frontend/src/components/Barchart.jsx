import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BarChart = ({ data }) => {
  const options = {
    plugins: {
      datalabels: {
        display: false,
      },

      legend: {
        display: true, // Show or hide the legend
        position: "top", // Change the position of the legend
        labels: {
          color: "#fff", // Change the font color of the legend labels
          boxHeight: 10, // Change the height of the legend box
          boxWidth: 10, // Change the width of the legend box
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking for x-axis
        grid: {
          color: "#242323", // Change the color of the x-axis grid lines
        },
      },
      y: {
        stacked: true, // Enable stacking for y-axis
        grid: {
          color: "#242323", // Change the color of the y-axis grid lines
        },
      },
    },
  };

  // Chart.register(ChartDataLabels);

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
