<template>
  <Line
    :chart-data="chartData"
    :width="400"
    :height="250"
    :chart-options="chartOptions"
  ></Line>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

// Reactive chart data
const chartData = ref({
  labels: [], 
  datasets: [
    {
      label: "Users Data",
      data: [],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
});


const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Accounts Created",
    },
  },
});


const getGraphData = async () => {
  try {
    const response = await axios.post("/api/admin/graphdata");
    const responseData = response.data; 
   
  
    const labels = responseData.map((item) => item.month); 
    const data = responseData.map((item) => item.userCount); 

   
    chartData.value.labels = labels;
    chartData.value.datasets[0].data = data;

  } catch (error) {
    console.error("Error getting graph data:", error);
  }
};

// Call getGraphData on component mount
onMounted(() => {
  getGraphData();
});
</script>
