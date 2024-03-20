import React, {useEffect, useRef, useState} from 'react';
import { ILaneStats } from './ILaneStats';
import { Chart, LinearScale, CategoryScale } from 'chart.js';
import {BoxPlotController, BoxAndWiskers, BoxPlotChart} from '@sgratzl/chartjs-chart-boxplot';



function LaneStatsChart({ data }: { data: ILaneStats[] }) {
  const [chartData, setChartData] = useState({
    labels: ['none'],
    datasets: [
      {
        label: 'Days (Excl. Blocked, Wknds, Holidays)',
        data: [0],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        outliersColor: 'gray',
      },
    ],
  });
  const chartRef = useRef<Chart | null>(null);

 
  let chart = undefined; 
  // Use Chart.js library to render the chart after component mounts
  useEffect(() => {

    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart before creating a new one
    }

    const canvas = document.getElementById('laneStatsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if(!ctx)
      return;
    
    // ... code to create a new chart using ctx and data
    chartRef.current = new BoxPlotChart(ctx, {
      data:chartData
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up the chart on component unmount
      }
    };
    


  }, [chartData]);
  
  useEffect(() => {
    if (!data || data.length === 0) return;

    const labels = data.map((item) => item.title);
    const daysData = data.map((item) => item.daysInActiveLanesExcludingBlockedWeekendAndHolidays);
   

    setChartData({
      labels,
      datasets: [
        {
          label: 'Days (Excl. Blocked, Wknds, Holidays)',
          data: daysData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          outliersColor: 'gray',
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2>Box Plot of Days (Excl. Blocked, Wknds, Holidays)</h2>
      <canvas id="laneStatsChart" width="600" height="400"></canvas>
    </div>
  );

  
}

export default LaneStatsChart;