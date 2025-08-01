<template>
  <div class="upload-container">
    <success v-if="successmessage" :messagevalue="successmessage"/>

    <div class="upload-card">
      <h2>Upload Timetable</h2>

      <div class="upload-steps">
        <div class="step">
          <span class="step-number">1</span>
          <div class="file-upload">
            <label>Upload Excel File</label>
            <div 
              class="upload-box" 
              @click="triggerFileInput"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
              :class="{ 'dragging': isDragging }"
            >
              <input type="file" 
                    ref="fileInput"
                    @change="handleFileUpload" 
                    accept=".xlsx, .xls"
                    class="hidden-input" />
              <i class="fas fa-cloud-upload-alt"></i>
              <p>{{ isDragging ? 'Drop file here' : 'Click to upload or drag and drop' }}</p>
              <p class="file-type">Excel files only (.xlsx, .xls)</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="sendDataToBackend" 
              class="submit-btn"
              :disabled="!tableData.length">
        Upload Timetable
      </button>
    </div>

    <div class="preview-section" v-if="tableData.length">
      <h3>Preview</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td v-for="(header, cellIndex) in tableHeaders" :key="cellIndex">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Debug section to show program mappings -->
    <div class="debug-section" v-if="tableData.length">
      <h4>Program Mappings:</h4>
      <ul>
        <li v-for="(mapping, index) in programMappings" :key="index">
          Sheet: "{{ mapping.sheetName }}" → 
          <span v-if="mapping.programId">Program ID: {{ mapping.programId }}</span>
          <span v-else class="warning">⚠️ No matching program ID found</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import * as XLSX from "xlsx";
import axios from "axios";
import success from "@/components/success.vue";

const successmessage = ref("");
const tableHeaders = ref([]);
const tableData = ref([]);
const fileInput = ref(null);
const isDragging = ref(false);

// Program mapping data
const programMap = {
  "BSSE-F24 Green": 1,
  "BSSE-F24 Blue": 2,
  "BSCS-F24 Green": 3,
  "BSCS-F24 Blue": 4,
  "BSCS-F24 Red": 5,
  "BSDS-F24": 6,
  "BSAI-F24 Green": 7,
  "BSAI-F24 Blue": 8,
  "BSAI-F24 Red": 9,
  "BSAI-F24 Yellow": 10,
  "CYS-F24 Green": 11,
  "CYS-F24 Blue": 12,
  "BSCS-S24": 13,
  "BSAI-S24 Green": 14,
  "BSAI-S24 Blue": 15,
  "BSSE-F23 Green": 16,
  "BSSE-F23 Blue": 17,
  "BSCS-F23 Green": 18,
  "BSCS-F23 Blue": 19,
  "BSCS-F23 Red": 20,
  "BSDS-F23": 21,
  "BSAI-F23 Green": 22,
  "BSAI-F23 Blue": 23,
  "BSAI-F23 Red": 24,
  "BSAI-F23 Yellow": 25,
  "CYS-F23 Green": 26,
  "CYS-F23 Blue": 27,
  "BSSE-S23": 28,
  "BSCS-S23": 29,
  "BSDS-S23": 30,
  "BSAI-S23": 31,
  "BSSE-F22 Green": 32,
  "BSSE-F22 Blue": 33,
  "BSSE-F22 Red": 34,
  "BSCS-F22 Green": 35,
  "BSCS-F22 Blue": 36,
  "BSDS-F22": 37,
  "BSAI-F22 Green": 38,
  "BSAI-F22 Blue": 39,
  "BSSE-F21": 40,
  "BSCS-F21": 41,
  "BSDS-F21": 42,
  "BSAI-F21": 43,
  "SDAAT-F24": 44,
  "SDAAT-S24": 45,
  "Game+Animation-III": 46,
  "Game+Animation-IV": 47,
  "Game+Animation-V": 48,
  "Fashion-III": 49,
  "Fashion-IV": 50,
  "Fashion-V": 51,
  "Textile-III": 52,
  "Textile-IV": 53,
  "Textile-V": 54,
  "Architecture-III": 55,
  "Architecture-V": 56,
  "Interior-III": 57,
  "Information-III": 58,
  "Information-IV": 59,
  "Information-V": 60,
  "Information-VII": 61,
  "BSSE-F24 Red": 62,
  "SDAAT-S25": 63,
  "Game+Animation-VI": 64,
  "Information Design-VI": 65,
  "Interior-IV": 66,
  "Architecture-IV": 67,
  "Architecture-VI": 68,
  "BSCS-F24 Yellow": 69,
  "BSAI-F24 Orange": 70,
  "Fashion-VI": 71,
  "Textile-VI": 72,
  "Information-VIII": 73
};


// Computed property to show program mappings for debugging
const programMappings = computed(() => {
  const uniquePrograms = [...new Set(tableData.value.map(row => row.Program))];
  return uniquePrograms.map(sheetName => ({
    sheetName,
    programId: getProgramId(sheetName)
  }));
});

// Function to get program ID from sheet name
const getProgramId = (sheetName) => {
  // First try exact match
  if (programMap[sheetName]) {
    return programMap[sheetName];
  }
  
  // Try case-insensitive match
  const upperSheetName = sheetName.toUpperCase();
  for (const [programName, programId] of Object.entries(programMap)) {
    if (programName.toUpperCase() === upperSheetName) {
      return programId;
    }
  }
  
  // Try partial match (if sheet name contains program name)
  for (const [programName, programId] of Object.entries(programMap)) {
    if (upperSheetName.includes(programName.toUpperCase()) || programName.toUpperCase().includes(upperSheetName)) {
      return programId;
    }
  }
  
  return null; // No match found
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const allSheetData = [];
    const headersSet = new Set();

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length < 2) return;

      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      headers.forEach((h) => headersSet.add(h));

      const timeColIndex = headers.findIndex(header =>
        rows.some(row => typeof row[headers.indexOf(header)] === 'string' && row[headers.indexOf(header)].includes('-'))
      );

      rows.forEach((row) => {
        let startTime = "", endTime = "";
        if (timeColIndex !== -1 && typeof row[timeColIndex] === "string") {
          const [start, end] = row[timeColIndex].split("-").map(str => str?.trim());
          startTime = start || "";
          endTime = end || "";
        }

        const rowObj = {};
        headers.forEach((h, i) => {
          rowObj[h] = row[i] || "";
        });

        // Get program ID instead of sheet name
        const programId = getProgramId(sheetName);
        
        // Standardize field names for backend
        rowObj["Program"] = sheetName;
        rowObj["Program_ID"] = programId;
        rowObj["Start Time"] = startTime;
        rowObj["End Time"] = endTime;
        rowObj["Day"] = rowObj["Day"] || rowObj["day"] || "";
        rowObj["Professor"] = rowObj["Professor"] || rowObj["professor"] || "";
        rowObj["Location"] = rowObj["Location"] || rowObj["location"] || "";
        rowObj["Subject"] = rowObj["Subject"] || rowObj["subject"] || "";
        
        allSheetData.push(rowObj);
      });
    });

    tableHeaders.value = Array.from(headersSet).concat(["Program", "Program_ID", "Start Time", "End Time"]);
    tableData.value = allSheetData;
  };

  reader.readAsArrayBuffer(file);
};

const sendDataToBackend = async () => {
  if (!tableData.value.length) {
    alert("Please upload a timetable file first!");
    return;
  }

  // Day abbreviation to full name mapping
  const dayMap = {
    'Mo': 'Monday',
    'Tu': 'Tuesday',
    'We': 'Wednesday',
    'Th': 'Thursday',
    'Fr': 'Friday',
    'Sa': 'Saturday',
    'Su': 'Sunday'
  };

  // Group data by program_id
  const groupedData = {};

  tableData.value.forEach(row => {
    const program_id = row.Program_ID;
    if (!program_id) return;

    if (!groupedData[program_id]) {
      groupedData[program_id] = [];
    }

    // Convert day abbreviation to full name
    const dayAbbreviation = row.Day.trim();
    const fullDayName = dayMap[dayAbbreviation] || dayAbbreviation;

    groupedData[program_id].push([
      fullDayName,                  // full day name
      row["Start Time"],            // start_time
      row["End Time"],              // end_time
      row.Subject,                  // course_name (from Subject)
      row.Professor,                // teacher_name (from Professor)
      row.Location                  // venue (from Location)
    ]);
  });

  // Convert to array format expected by backend
  const dataToSend = Object.entries(groupedData).map(([program_id, rows]) => ({
    program_id: parseInt(program_id),
    rows
  }));

  try {
    console.log("Sending data to backend:", dataToSend); // For debugging
    const response = await axios.post("/api/admin/uploadtimetable", dataToSend);
    if (response.data.success) {
      successmessage.value = response.data.message;
    }
  } catch (error) {
    console.error("Error sending data:", error);
    alert("Error uploading timetable. Please check console for details.");
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    alert('Please upload an Excel file (.xlsx or .xls)');
    return;
  }
  const input = fileInput.value;
  input.files = e.dataTransfer.files;
  handleFileUpload({ target: input });
};
</script>

<style scoped>
.upload-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.upload-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.upload-steps {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.step {
  position: relative;
  padding-left: 3rem;
}

.step-number {
  position: absolute;
  left: 0;
  top: 0;
  width: 2rem;
  height: 2rem;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.program-selector label,
.file-upload label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.upload-box {
  border: 2px dashed #ddd;
  padding: 2rem;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box.dragging {
  border-color: #4CAF50;
  background: #e8f5e9;
  transform: scale(1.02);
}

.upload-box:hover {
  border-color: #4CAF50;
}

.upload-box i {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.upload-box p {
  margin: 0.5rem 0;
  color: #666;
}

.hidden-input {
  display: none;
}

.file-type {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.preview-section {
  margin-top: 2rem;
}

.table-container {
  margin-top: 1rem;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

tr:hover {
  background: #f9f9f9;
}

.debug-section {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.debug-section h4 {
  margin-bottom: 1rem;
  color: #333;
}

.debug-section ul {
  list-style: none;
  padding-left: 0;
}

.debug-section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.warning {
  color: #dc3545;
  font-weight: bold;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.selected {
  background: #e8f5e9;
  color: #4CAF50;
}

.no-results {
  padding: 0.75rem;
  text-align: center;
  color: #666;
}

.selected-program {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4CAF50;
}

.custom-dropdown {
  scrollbar-width: thin;
  scrollbar-color: #4CAF50 #f5f5f5;
}

.custom-dropdown::-webkit-scrollbar {
  width: 6px;
}

.custom-dropdown::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.custom-dropdown::-webkit-scrollbar-thumb {
  background-color: #4CAF50;
  border-radius: 3px;
}
</style>