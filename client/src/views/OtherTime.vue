<template>
  <main class="timetable-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th class="time-header">Time</th>
            <th v-for="day in days" :key="day" class="day-header">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in structuredTimetable" :key="index">
            <td class="time-cell">{{ formatTime(row.time) }}</td>
            <td 
              v-for="day in days" 
              :key="day"
              :class="{'has-class': row[day]}"
            >
              {{ row[day] || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, defineAsyncComponent, computed } from 'vue';

const timetableData = ref([]);

const prop = defineProps({
  programid: String
});

const gettimetable = async (id) => {
  try {
    const responce = await axios.post("/api/user/gettimetable", { id: id });
    timetableData.value = responce.data;
  } catch (error) {
    console.log("error in getting timetable", error);
  }
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const structuredTimetable = computed(() => {
  let timetableMap = {};

  timetableData.value.forEach((entry) => {
    const key = `${entry.start_time}-${entry.end_time}`;
    if (!timetableMap[key]) {
      timetableMap[key] = { time: key };
    }
    timetableMap[key][entry.day] = entry.course_name;
  });

  return Object.values(timetableMap).sort((a, b) =>
    a.time.localeCompare(b.time)
  );
});

// Add time formatting function
const formatTime = (timeRange) => {
  const [start, end] = timeRange.split('-');
  const formatHour = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  return `${formatHour(start)} - ${formatHour(end)}`;
};

onMounted(async () => {
  await gettimetable(prop.programid);
});
</script>

<style scoped>
.timetable-container {
  height: 82vh;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  height: 100%;
  overflow: auto;
  border-radius: 8px;
  background: white;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

th {
  background: #1b1b1d;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-header {
  background: #000;
  left: 0;
  z-index: 11;
}

.day-header {
  white-space: nowrap;
}

td {
  font-size: 0.9rem;
  color: #333;
  transition: all 0.3s ease;
}

.time-cell {
  background: #f8f8f8;
  font-weight: 500;
  color: #1b1b1d;
  position: sticky;
  left: 0;
  z-index: 9;
  white-space: nowrap;
}

tr:hover td {
  background: #f5f5f5;
}

tr:hover .time-cell {
  background: #eee;
}

.has-class {
  font-weight: 500;
  background: rgba(27, 27, 29, 0.03);
}

/* Custom scrollbar */
.table-wrapper::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #1b1b1d;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #000;
}

/* Responsive styles */
@media (max-width: 768px) {
  .timetable-container {
    padding: 1rem;
    height: 85vh;
  }

  th, td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .time-cell {
    font-size: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .timetable-container {
    padding: 2rem;
  }

  th, td {
    padding: 1.25rem;
  }

  th {
    font-size: 1rem;
  }

  td {
    font-size: 0.95rem;
  }
}
</style>