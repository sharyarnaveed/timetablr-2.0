<template>
    <success v-if="successmessage" :messagevalue="successmessage"/>
    <div>
      <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
      <select  v-model="selectedOption">
        <option disabled value="">Select an option</option>
        <option v-for="option in options" :key="option.program_id" :value="option.program_id">{{ option.program_name }}</option>
      </select>
      <button @click="sendDataToBackend">Send to Backend</button>
  
     
      <table v-if="tableData.length">
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
            <th>Added Option</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
            <td>{{ selectedOption }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import * as XLSX from "xlsx";
  import axios from "axios";
  import success from "@/components/success.vue";
  const succesbool=ref(false)
  const successmessage=ref("")
  const tableHeaders = ref([]);
  const tableData = ref([]);
  const selectedOption = ref("");
  const options = ref([]); 


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



  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
       
        tableHeaders.value = jsonData[0] || [];
        tableData.value = jsonData.slice(1);
        console.log(tableData.value);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  

  const sendDataToBackend = async () => {
    if (!selectedOption.value) {
      alert("Please select an option!");
      return;
    }
  
    
    const modifiedData = tableData.value.map((row) => [...row, selectedOption.value]);
  
    try {
      const response = await axios.post("/api/admin/uploadtimetable",modifiedData,);
      console.log("Data sent successfully:", response.data);
      if (response.data.success) {
        succesbool.value=true;
        successmessage.value=response.data.message
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  </script>
  <style scoped>

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
  