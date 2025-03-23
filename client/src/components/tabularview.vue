<script setup>
import { ref, computed } from "vue";
import { onMounted } from "vue";
import api from "@/api";
import router from "@/router";
const timetableData = ref([]);
import { useTimetableStore } from "@/stores/timtable";
const usetimetable = useTimetableStore();

const getAllTimetable = async () => {
  try {
    const response = await api.post("/api/user/alltimetable");
    usetimetable.storedaywiseinlocal(response.data.timetable);

    console.log(timetableData.value);
  } catch (error) {
    console.error("Error in getting timetable:", error);
    if (error.response?.status === 401) {
      router.push("/signin");
    }
  }
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const structuredTimetable = computed(() => {
  let timetableMap = {};

  timetableData.value.forEach((entry) => {
    console.log(entry);

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

onMounted(async () => {
  await getAllTimetable();
  timetableData.value = usetimetable.getdaywiseinlocal();
});

// Add this function to format time
const formatTime = (timeRange) => {
  const [start, end] = timeRange.split('-');
  const formatHour = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  return `${formatHour(start)} - ${formatHour(end)}`;
};
</script>

<template>
  <main class="table-container">
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

<style scoped>
.table-container {
  width: 100%;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
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

/* Responsive design */
@media (max-width: 768px) {
  .table-container {
    padding: 1rem;
    border-radius: 8px;
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
  .table-container {
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
</style>
