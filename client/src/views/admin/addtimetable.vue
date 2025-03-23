<template>
  <div class="upload-container">
    <success v-if="successmessage" :messagevalue="successmessage"/>
    
    <div class="upload-card">
      <h2>Upload Timetable</h2>
      
      <div class="upload-steps">
        <div class="step">
          <span class="step-number">1</span>
          <div class="program-selector">
            <label>Select Program</label>
            <div class="select-wrapper">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search programs..."
                class="search-input"
                @focus="showDropdown = true"
              />
              <i class="fas fa-search search-icon"></i>
              
              <div v-show="showDropdown" class="custom-dropdown">
                <div 
                  v-for="option in filteredOptions" 
                  :key="option.program_id"
                  class="dropdown-item"
                  :class="{ 'selected': option.program_id === selectedOption }"
                  @click="selectProgram(option)"
                >
                  {{ option.program_name }}
                </div>
                <div v-if="filteredOptions.length === 0" class="no-results">
                  No programs found
                </div>
              </div>
            </div>
            <div v-if="selectedProgramName" class="selected-program">
              Selected: {{ selectedProgramName }}
            </div>
          </div>
        </div>

        <div class="step">
          <span class="step-number">2</span>
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
              :disabled="!selectedOption || !tableData.length">
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
              <th>Program</th>
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import * as XLSX from "xlsx";
import axios from "axios";
import success from "@/components/success.vue";

const succesbool = ref(false);
const successmessage = ref("");
const tableHeaders = ref([]);
const tableData = ref([]);
const selectedOption = ref("");
const options = ref([]);
const fileInput = ref(null);

const searchQuery = ref('');
const showDropdown = ref(false);
const selectedProgramName = ref('');

const getprogramoptions = async () => {
  try {
    const response = await axios.post("/api/user/getprogramfromdb");
    options.value = response.data;
  } catch (err) {
    console.error("Error fetching programs:", err);
  }
};

onMounted(async () => {
  await getprogramoptions();
});

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
    const response = await axios.post("/api/admin/uploadtimetable", modifiedData);
    console.log("Data sent successfully:", response.data);
    if (response.data.success) {
      succesbool.value = true;
      successmessage.value = response.data.message;
    }
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const filteredOptions = computed(() => {
  if (!searchQuery.value) return options.value;
  const query = searchQuery.value.toLowerCase();
  return options.value.filter(option => 
    option.program_name.toLowerCase().includes(query)
  );
});

const selectProgram = (option) => {
  selectedOption.value = option.program_id;
  selectedProgramName.value = option.program_name;
  searchQuery.value = '';
  showDropdown.value = false;
};

onMounted(() => {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.select-wrapper');
    if (dropdown && !dropdown.contains(e.target)) {
      showDropdown.value = false;
    }
  });
});

const isDragging = ref(false);

const handleDragOver = (e) => {
  isDragging.value = true;
};

const handleDragLeave = (e) => {
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
