<template>
  <div class="upload-container">
    <success v-if="successmessage" :messagevalue="successmessage" />

    <div class="upload-card">
      <h2>Upload Timetable</h2>

      <div class="upload-steps">
        <div class="step">
          <span class="step-number">1</span>
          <div class="file-upload">
            <label>Upload Excel File</label>
            <div class="upload-box" @click="triggerFileInput" @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" :class="{ 'dragging': isDragging }">
              <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" class="hidden-input" />
              <i class="fas fa-cloud-upload-alt"></i>
              <p>{{ isDragging ? 'Drop file here' : 'Click to upload or drag and drop' }}</p>
              <p class="file-type">Excel files only (.xlsx, .xls)</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="sendDataToBackend" class="submit-btn" :disabled="!tableData.length">
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
  "BSCYS-F25 Green": 1,
  "BSCYS-F25 Blue": 2,
  "BSAI-F25 Green": 3,
  "BSAI-F25 Blue": 4,
  "BSAI-F25 Red": 5,
  "BSAI-F25 Yellow": 6,
  "BSAI-F25 Orange": 7,
  "BSDS-F25 Green": 8,
  "BSDS-F25 Blue": 9,
  "BSCS-F25 Green": 10,
  "BSCS-F25 Blue": 11,
  "BSCS-F25 Red": 12,
  "BSCS-F25 Yellow": 13,
  "BSSE-F25 Green": 14,
  "BSSE-F25 Blue": 15,
  "BSSE-F25 Red": 16,
  "BSCYS-F24 Green": 17,
  "BSCYS-F24 Blue": 18,
  "BSAI-F24 Green": 19,
  "BSAI-F24 Blue": 20,
  "BSAI-F24 Red": 21,
  "BSAI-F24 Yellow": 22,
  "BSAI-F24 Orange": 23,
  "BSDS-F24": 24,
  "BSCS-F24 Green": 25,
  "BSCS-F24 Blue": 26,
  "BSCS-F24 Red": 27,
  "BSCS-F24 Yellow": 28,
  "BSSE-F24 Green": 29,
  "BSSE-F24 Blue": 30,
  "BSSE-F24 Red": 31,
  "BSAI-S24 Green": 32,
  "BSAI-S24 Blue": 33,
  "BSCS-S24": 34,
  "BSCYS-F23 Green": 35,
  "BSCYS-F23 Blue": 36,
  "BSAI-F23 Green": 37,
  "BSAI-F23 Blue": 38,
  "BSAI-F23 Red": 39,
  "BSAI-F23 Yellow": 40,
  "BSDS-F23": 41,
  "BSCS-F23 Green": 42,
  "BSCS-F23 Blue": 43,
  "BSCS-F23 Red": 44,
  "BSSE-F23 Green": 45,
  "BSSE-F23 Blue": 46,
  "BSAI-S23": 47,
  "BSDS-S23": 48,
  "BSCS-S23": 49,
  "BSSE-S23": 50,
  "BSAI-F22 Green": 51,
  "BSAI-F22 Blue": 52,
  "BSDS-F22": 53,
  "BSCS-F22 Green": 54,
  "BSCS-F22 Blue": 55,
  "BSSE-F22 Green": 56,
  "BSSE-F22 Blue": 57,
  "BSSE-F22 Red": 58,
  "BEE-F25": 59,
  "BEE-F24": 60,
  "BEE-F23": 61,
  "BEE-F22": 62,
  "Robotics-F25": 63,
  "Robotics-F24": 64,
  "Robotics-F23": 65,
  "BCE-F24": 66,
  "BCE-F25": 67,
  "C&EE-F25": 68,
  "C&EE-F24": 69,
  "C&EE-F22": 70,
  "C&EE-F23": 71,
  "MTE-F25": 72,
  "MTE-F24": 73,
  "MTE-F23": 74,
  "MTE-F22": 75,
  "BMCET-F25&S25": 76,
  "BBET-F25&S25": 77,
  "BMCET-S24&F24": 78,
  "BBET-S24&F24": 79,
  "BMCET-F23": 80,
  "BBET-F23": 81,
  "BMS-F25": 82,
  "BMS-F24": 83,
  "BMS-F23": 84,
  "BMS-S23": 85,
  "BMS-F22": 86,
  "BTY-F25": 87,
  "BTY-S25": 88,
  "BTY-F24": 89,
  "BTY-F23": 90,
  "BTY-S23": 91,
  "BTY-F22": 92,
  "MLT-F25": 93,
  "MLT-S25": 94,
  "PharmD-F25": 95,
  "PharmD-F24": 96,
  "PharmD-F23": 97,
  "PharmD-S23": 98,
  "DPT-F25": 99,
  "DPT-F24": 100,
  "DPT-F23": 101,
  "Psychology-F25": 102,
  "Psychology-S25": 103,
  "Psychology-F24": 104,
  "Psychology-F23": 105,
  "Psychology-F22": 106,
  "English-F25": 107,
  "English-F24": 108,
  "English-F23": 109,
  "English-S23": 110,
  "English-F22": 111,
  "BBA-F25": 112,
  "BBA-S25": 113,
  "BBA-F24": 114,
  "BBA-F23": 115,
  "BBA-S23": 116,
  "BBA-F22": 117,
  "A&F-F25": 118,
  "A&F-F22": 119,
  "BAN-F25": 120,
  "SDAAT-F25": 121,
  "SDAAT-S25": 122,
  "GameDesign-F24": 123,
  "GameDesign-F23": 124,
  "GameDesign-F22": 125,
  "AnimationDesign-F24": 126,
  "AnimationDesign-S24": 127,
  "AnimationDesign-F23": 128,
  "AnimationDesign-S23": 129,
  "AnimationDesign-F22": 130,
  "InfoDesign-F24": 131,
  "InfoDesign-S24": 132,
  "InfoDesign-F23": 133,
  "InfoDesign-S23": 134,
  "InfoDesign-F22": 135,
  "Architecture-F24": 136,
  "Architecture-F23": 137,
  "Architecture-F22": 138,
  "IntDesign-F24": 139,
  "IntDesign-S24": 140,
  "IntDesign-F23": 141,
  "TextileDesign-F24": 142,
  "TextileDesign-S24": 143,
  "TextileDesign-F23": 144,
  "TextileDesign-S23": 145,
  "TextileDesign-F22": 146,
  "FashionDesign-F24": 147,
  "FashionDesign-S24": 148,
  "FashionDesign-F23": 149,
  "FashionDesign-S23": 150,
  "FashionDesign-F22": 151,
  "BIF-F22": 153,
  "BSCYS-F25 Red":155,
  "IntDesign-S25":156,
  'FashionDesign-S25':157,
  "TextileDesign-S25":158,
  "InfoDesign-S25":159,
  "AnimationDesign-S25":160,
  "GameDesign-S25":161

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

// Helper function to convert Excel time values to HH:mm format
const convertExcelTime = (value) => {
  if (!value && value !== 0) return "";
  
  // If it's already a string in time format
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === "--:--" || trimmed === "") return "";
    
    // If already in HH:mm or HH:mm:ss format
    if (trimmed.includes(":")) {
      const parts = trimmed.split(":");
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    
    // Try parsing AM/PM format like "9:00 AM"
    const ampmMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1]);
      const minutes = parseInt(ampmMatch[2]);
      const period = ampmMatch[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
  // If it's a number (Excel stores time as fraction of day)
  if (typeof value === 'number') {
    // Excel time is fraction of day (0.5 = 12:00 PM)
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return "";
};

// Helper to parse ranges like "10:30 - 12:00" or "9:00 AM - 11:15 AM"
const parseTimeRange = (value) => {
  if (!value) return { start: "", end: "" };

  const text = value
    .toString()
    .replace(/[\u2013\u2014]/g, "-") // normalize dashes
    .replace(/\s+/g, " ")
    .trim();

  // Match "hh:mm - hh:mm" optionally with AM/PM on either side
  const match = text.match(/(\d{1,2}:\d{2})(?:\s*(AM|PM))?\s*-\s*(\d{1,2}:\d{2})(?:\s*(AM|PM))?/i);
  if (match) {
    const startRaw = `${match[1]}${match[2] ? ` ${match[2]}` : ""}`;
    const endRaw = `${match[3]}${match[4] ? ` ${match[4]}` : ""}`;
    return {
      start: convertExcelTime(startRaw),
      end: convertExcelTime(endRaw)
    };
  }

  // If not a range, fall back to single-time conversion
  const single = convertExcelTime(text);
  return { start: single, end: "" };
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });

    const allSheetData = [];
    const headersSet = new Set();

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      
      // Get raw data to handle time values properly
      const jsonDataRaw = XLSX.utils.sheet_to_json(sheet, { 
        header: 1,
        raw: true,
        defval: null
      });

      if (jsonDataRaw.length < 2) return;

      const headers = jsonDataRaw[0];
      const rows = jsonDataRaw.slice(1);

      headers.forEach((h) => {
        if (h) headersSet.add(h);
      });

      rows.forEach((row) => {
        const rowObj = {};
        headers.forEach((h, i) => {
          if (!h) return;
          
          // Convert time values from Excel format
          if (h === "Start Time" || h === "End Time") {
            rowObj[h] = convertExcelTime(row[i]);
          } else if (h.toString().trim().toLowerCase().includes("time")) {
            // Capture combined time columns like "10:30 - 12:00"
            rowObj[h] = row[i] !== null && row[i] !== undefined ? row[i].toString().trim() : "";
          } else {
            rowObj[h] = row[i] !== null && row[i] !== undefined ? row[i].toString().trim() : "";
          }
        });

        // If Start/End are empty but a combined Time column exists, split it
        if (!rowObj["Start Time"] || !rowObj["End Time"]) {
          const timeKey = Object.keys(rowObj).find((key) => {
            const lower = key.toString().toLowerCase();
            return lower.includes("time") && lower !== "start time" && lower !== "end time";
          });

          const combinedTime = timeKey ? rowObj[timeKey] : "";
          const { start, end } = parseTimeRange(combinedTime);
          rowObj["Start Time"] = rowObj["Start Time"] || start;
          rowObj["End Time"] = rowObj["End Time"] || end;
        }

        // Get program ID instead of sheet name
        const programId = getProgramId(sheetName);

        // Standardize field names for backend
        rowObj["Program"] = sheetName;
        rowObj["Program_ID"] = programId;
        rowObj["Day"] = rowObj["Day"] || rowObj["day"] || "";
        rowObj["Professor"] = rowObj["Professor"] || rowObj["professor"] || "";
        rowObj["Location"] = rowObj["Location"] || rowObj["location"] || "";
        rowObj["Subject"] = rowObj["Subject"] || rowObj["subject"] || "";

        allSheetData.push(rowObj);
      });
    });

    tableHeaders.value = Array.from(headersSet).concat(["Program", "Program_ID"]);
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
  let skippedRows = 0;

  tableData.value.forEach(row => {
    const program_id = row.Program_ID;
    if (!program_id) return;

    // Skip rows with missing time values
    const startTime = row["Start Time"];
    const endTime = row["End Time"];
    
    if (!startTime || !endTime) {
      skippedRows++;
      console.warn('Skipping row with missing times:', row);
      return;
    }

    if (!groupedData[program_id]) {
      groupedData[program_id] = [];
    }

    // Convert day abbreviation to full name
    const dayAbbreviation = row.Day.trim();
    const fullDayName = dayMap[dayAbbreviation] || dayAbbreviation;

    groupedData[program_id].push([
      fullDayName,                  // full day name
      startTime,                    // start_time
      endTime,                      // end_time
      row.Subject,                  // course_name (from Subject)
      row.Professor,                // teacher_name (from Professor)
      row.Location                  // venue (from Location)
    ]);
  });

  if (skippedRows > 0) {
    const proceed = confirm(`Warning: ${skippedRows} rows will be skipped because they have missing Start Time or End Time values. Do you want to continue?`);
    if (!proceed) return;
  }

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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