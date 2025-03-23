<!-- CircularProgress.vue -->
<template>
    <div class="progress-wrapper" :style="wrapperStyle">
      <div class="glow-container" :style="glowStyle"></div>
      
      <svg :width="size" :height="size" viewBox="0 0 100 100">
        <!-- Outer decorative circle -->
        <circle
          class="decorative-circle"
          cx="50"
          cy="50"
          :r="radius + 8"
          fill="none"
          stroke="#333333"
          stroke-width="0.2"
          opacity="0.15"
        />
        
        <!-- Background track -->
        <circle
          class="progress-background"
          cx="50"
          cy="50"
          :r="radius"
          stroke="#E5E5E5"
          :stroke-width="strokeWidth"
          fill="none"
          stroke-dasharray="2,2"
        />
        
        <!-- Progress circle -->
        <circle
          class="progress-circle"
          cx="50"
          cy="50"
          :r="radius"
          stroke="#000000"
          :stroke-width="strokeWidth"
          fill="none"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :style="progressStyle"
        />
        
        <g class="center-content">
          <text
            v-if="showLabel"
            x="50"
            y="45"
            text-anchor="middle"
            fill="#000000"
            class="percentage-text"
            :style="textStyle"
          >
            {{ formattedValue }}
          </text>
          
          <text
            v-if="showLabel"
            x="50"
            y="65"
            text-anchor="middle"
            fill="#666666"
            class="label-text"
            :style="labelStyle"
          >
            Progress
          </text>
        </g>
        
        <!-- Completion pulse effect -->
        <circle
          v-if="isComplete"
          class="pulse-circle"
          cx="50"
          cy="50"
          :r="radius"
          stroke="#000000"
          stroke-width="1"
          fill="none"
        />
      </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  progressColor?: string;
  backgroundColor?: string;
  textColor?: string;
  animationDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  strokeWidth: 4,
  showLabel: true,
  progressColor: '#000000',
  backgroundColor: '#E5E5E5',
  textColor: '#000000',
  animationDuration: 1000
});

const previousValue = ref(0);
const isAnimating = ref(false);

const radius = computed(() => 50 - (props.strokeWidth / 2));
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => {
  const progress = props.value / 100;
  return circumference.value * (1 - progress);
});

const formattedValue = computed(() => `${Math.round(props.value)}%`);
const isComplete = computed(() => props.value >= 100);

const wrapperStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const progressStyle = computed(() => ({
  transition: `stroke-dashoffset ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  transform: 'rotate(-90deg)',
  transformOrigin: '50% 50%',
  filter: isComplete.value ? 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' : 'none'
}));

const textStyle = computed(() => ({
  fontSize: `${props.size / 5}px`,
  fontWeight: '600',
  opacity: '0.9',
  animation: isAnimating.value ? 'scale-text 0.5s ease-out' : 'none'
}));

const labelStyle = computed(() => ({
  fontSize: `${props.size / 10}px`,
  fontWeight: '500',
  opacity: '0.7'
}));

const glowStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  opacity: isComplete.value ? 0.2 : 0
}));

watch(() => props.value, (newValue, oldValue) => {
  previousValue.value = oldValue;
  isAnimating.value = true;
  
  setTimeout(() => {
    isAnimating.value = false;
  }, props.animationDuration);
});

onMounted(() => {
  previousValue.value = props.value;
});
</script>

<style scoped>
.progress-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
}

.glow-container {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(0,0,0,0.08) 0%, transparent 70%);
    transition: opacity 0.5s ease;
}

.progress-circle {
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.2));
}

.decorative-circle {
    opacity: 0;
    animation: fade-in 1.5s ease forwards;
}

.percentage-text {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-weight: 600;
    letter-spacing: -0.02em;
}

.label-text {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.7em;
    font-weight: 500;
}

.pulse-circle {
    animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.02);
        opacity: 0.1;
    }
    100% {
        transform: scale(1);
        opacity: 0.3;
    }
}

@keyframes scale-text {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 0.15; }
}

* {
    transition: all 0.3s ease;
}
</style>