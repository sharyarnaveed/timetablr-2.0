<template>
  <div class="">
    <div class="chart-header">
      <h2 class="chart-title">Program Enrollment Statistics</h2>
      <div class="chart-controls">
        <select v-model="displayCount" @change="updateChart" class="count-select">
          <option value="10">Top 10</option>
          <option value="15">Top 15</option>
          <option value="20">Top 20</option>
          <option value="-1">All Programs</option>
        </select>
      </div>
    </div>
    
    <div class="chart-stats" v-if="chartData.length > 0">
      <div class="stat-item">
        <span class="stat-label">Total Programs:</span>
        <span class="stat-value">{{ chartData.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Enrollments:</span>
        <span class="stat-value">{{ totalEnrollments }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Average per Program:</span>
        <span class="stat-value">{{ averageEnrollments }}</span>
      </div>
    </div>

    <div class="chart-wrapper">
      <canvas ref="chartCanvas" id="programChart"></canvas>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading enrollment data...</p>
    </div>
    
    <div v-if="error" class="error">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

// Reactive data
const chart = ref(null)
const chartCanvas = ref(null)
const loading = ref(false)
const error = ref(null)
const chartData = ref([])
const displayCount = ref(15)

// Computed properties
const totalEnrollments = computed(() => {
  return chartData.value.reduce((sum, item) => sum + item.count, 0)
})

const averageEnrollments = computed(() => {
  if (chartData.value.length === 0) return 0
  return Math.round(totalEnrollments.value / chartData.value.length * 10) / 10
})

const displayedData = computed(() => {
  if (displayCount.value === -1) return chartData.value
  return chartData.value.slice(0, displayCount.value)
})

// Methods
const fetchDataAndCreateChart = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/admin/getuserprograminfo')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Sort data by count in descending order
    chartData.value = data.sort((a, b) => b.count - a.count)
    createChart()
    
  } catch (err) {
    error.value = `Failed to load data: ${err.message}`
    console.error('Error fetching chart data:', err)
  } finally {
    loading.value = false
  }
}

const createChart = () => {
  if (chart.value) {
    chart.value.destroy()
  }

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  const data = displayedData.value
  
  // Extract labels and counts
  const labels = data.map(item => item.program)
  const counts = data.map(item => item.count)
  
  // Create dynamic colors based on enrollment count
  const colors = counts.map((count, index) => {
    const intensity = Math.max(0.4, count / Math.max(...counts))
    const hue = (240 - (index * 15)) % 360 // Blue to purple range
    return `hsla(${hue}, 70%, 60%, ${intensity})`
  })

  const borderColors = counts.map((count, index) => {
    const hue = (240 - (index * 15)) % 360
    return `hsla(${hue}, 70%, 50%, 0.8)`
  })

  chart.value = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Enrollments',
        data: counts,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: colors.map(color => color.replace(/[\d.]+\)$/g, '0.8)')),
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Program Enrollment Distribution ${displayCount.value === -1 ? '(All Programs)' : `(Top ${displayCount.value})`}`,
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: 25,
          color: '#2d3748'
        },
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            title: (context) => {
              return `Program: ${context[0].label}`
            },
            label: (context) => {
              const percentage = ((context.parsed.y / totalEnrollments.value) * 100).toFixed(1)
              return [
                `Enrollments: ${context.parsed.y}`,
                `Percentage: ${percentage}%`
              ]
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Students',
            font: {
              size: 14,
              weight: '600'
            }
          },
          ticks: {
            stepSize: 1,
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          }
        },
        x: {
          title: {
            display: true,
            text: 'Program Code',
            font: {
              size: 14,
              weight: '600'
            }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 11
            },
            color: '#4a5568'
          },
          grid: {
            display: false
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
      }
    }
  })
}

const updateChart = () => {
  if (chart.value && chartData.value.length > 0) {
    createChart()
  }
}

const refreshChart = () => {
  fetchDataAndCreateChart()
}

// Lifecycle hooks
onMounted(() => {
  fetchDataAndCreateChart()
})

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-title {
  color: #2d3748;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 153, 225, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.count-select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.count-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.chart-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.chart-wrapper {
  position: relative;
  height: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  color: #4a5568;
}

.loading p {
  margin: 16px 0 0 0;
  font-size: 16px;
  font-weight: 600;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: rgba(254, 178, 178, 0.9);
  border: 2px solid #fc8181;
  border-radius: 12px;
  color: #c53030;
  font-weight: 600;
  margin-top: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 1024px) {
  .chart-container {
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .chart-title {
    font-size: 24px;
    text-align: center;
  }
  
  .chart-controls {
    justify-content: center;
  }
  
  .chart-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .chart-wrapper {
    height: 400px;
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .chart-title {
    font-size: 20px;
  }
  
  .chart-wrapper {
    height: 350px;
  }
  
  .chart-stats {
    gap: 12px;
  }
  
  .stat-value {
    font-size: 18px;
  }
}
</style>