<template>
    <div>
        <select  v-model="selectedOption">
        <option disabled value="">Select an option</option>
        <option v-for="option in options" :key="option.program_id" :value="option.program_id">{{ option.program_name }}</option>
      </select>
<button @click="gettimetable" type="submit">Search</button>
<button @click="deletetimetable" type="submit">Delete Timetable</button>
    </div>

    <table>
        <tr>
          <th>Day</th>
          <th>Start Time</th>
          <th>End Time</th>

          <th>Program</th>

          <th>Course Name</th>
          <th>Venue</th>


        </tr>
        <tr v-for="(data, index) in timetable" :key="data.timetable_id">
          <td>{{ data.day}}</td>
          <td>{{ data.start_time}}</td>
          <td>{{ data.end_time}}</td>
          <td>{{ data.program_name}}</td>
          <td>{{ data.course_name}}</td>
          <td>{{ data.venue}}</td>

        
      
        </tr>
      </table>
    
</template>

<script setup>
  import { onMounted, ref } from "vue";
  const selectedOption = ref("");

  const options = ref([]); 
  import axios from "axios";
const timetable=ref()

  const getprogramoptions = async () => {
  try {
    const response = await axios.post("/api/user/getprogramfromdb");
    options.value = response.data;
  } catch (err) {
    console.error("Error fetching programs:", err);
  }
};
onMounted(async()=>{
await getprogramoptions();
})


const gettimetable=async()=>
{
    try {
        
        const response = await axios.post("/api/admin/timetabledata", {program_id:selectedOption.value}) 
        // console.log(response.data);
        timetable.value=response.data.timetable
        console.log(timetable.value);
    } catch (error) {
        console.log("error in getting timetale",error);
    }
}

const deletetimetable=async()=>
{
    try {
        
        const response = await axios.post("/api/admin/deletetimetabledata", {program_id:selectedOption.value}) 
        // console.log(response.data);
        if(response.data.success)
    {
        alert("timetable deleted")
    }
        
    } catch (error) {
        console.log("error in deleting timetale",error);
    }
}



</script>

<style  scoped>

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  overflow-y: auto;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>