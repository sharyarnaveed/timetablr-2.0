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
</script>

<template>
  <main class="homepanelmain">
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in structuredTimetable" :key="index">
          <td>{{ row.time }}</td>
          <td v-for="day in days" :key="day">{{ row[day] || "-" }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.container {
  width: 100%;
  margin: auto;
  overflow: auto;
  text-align: center;
  height: 90%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  font-size: 0.7rem;
}

th {
  background-color: #f4f4f4;
  font-size: 0.9rem;
}
</style>
