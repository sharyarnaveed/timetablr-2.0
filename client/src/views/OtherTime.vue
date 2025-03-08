<template>
    <main class="homepanelmainother">
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

<script setup>
import axios from 'axios';
import { onMounted, ref ,defineAsyncComponent,computed} from 'vue';
const timetableData = ref([]);


const prop=defineProps({
    programid:String
})



const gettimetable=async(id)=>
{
    try {
        const responce=await axios.post("/api/user/gettimetable",{id:id})
        timetableData.value=responce.data
        
    } catch (error) {
        console.log("error in getting timetable",error);
        
    }
}


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






onMounted(async()=>
{
   await gettimetable(prop.programid)
})
</script>



<style scoped>
.homepanelmainother{
    height: 82vh;
    overflow: auto;
}

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