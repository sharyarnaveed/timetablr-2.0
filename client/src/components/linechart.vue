<template>
  <div class="chart-container">
    <div class="chart-wrapper">
      <Line
        :chart-data="chartData"
        :chart-options="chartOptions"
      ></Line>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
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

// Reactive chart data with improved styling
const chartData = ref({
  labels: [], 
  datasets: [
    {
      label: "Users Created",
      data: [],
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: "rgb(75, 192, 192)",
      tension: 0.4,
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(75, 192, 192)',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
});

// Enhanced chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 14,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      }
    },
    title: {
      display: true,
      text: "User Growth Over Time",
      font: {
        size: 20,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 30
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#666',
      bodyFont: {
        size: 14
      },
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `Users: ${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
});

const getGraphData = async () => {
  try {
    const response = await axios.post("/api/admin/graphdata");
    const responseData = response.data;
    
    // Format data for better display
    const labels = responseData.map(item => {
      const date = new Date(item.month);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });
    const data = responseData.map(item => item.userCount);

    chartData.value.labels = labels;
    chartData.value.datasets[0].data = data;
  } catch (error) {
    console.error("Error getting graph data:", error);
  }
};

onMounted(() => {
  getGraphData();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  position: relative;
  height: 60vh;
  min-height: 300px;
  max-height: 600px;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 0.5rem;
  }

  .chart-wrapper {
    height: 50vh;
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    height: 40vh;
    min-height: 200px;
  }
}
</style>
