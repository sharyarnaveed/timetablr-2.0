<script setup>
import { onMounted, ref, watch } from "vue";
import { useProgramsStore } from "@/stores/programs";
import axios from "axios";
import confirm from "@/components/success.vue";

const buttoncon = ref(false);
const searchQuery = ref("");
const searchQueryCourses = ref("");
const errorResponse = ref("");
const look = ref(false);
const error = ref(false);
const successMsg = ref(false);
const successMessage = ref("");
const options = ref([]);
const courseOptions = ref([]);
const filteredOptions = ref([]);
const filteredCourseOptions = ref([]);
const showOptions = ref(false);
const showCourseOptions = ref(false);

const myprograms = useProgramsStore();

const signupData = ref({
  program_id: "", // Changed from program to program_id
  course: ""
});

// Fetch program options
const getProgramOptions = async () => {
  try {
    const response = await axios.post("/api/user/getprogramfromdb");
    await myprograms.setprograms(response.data);
    options.value = await myprograms.programs;
    filteredOptions.value = options.value;
  } catch (err) {
    console.error("Error fetching programs:", err);
    errorResponse.value = "Failed to load programs";
    error.value = true;
  }
};

// Fetch courses based on selected program
const getCourseOptions = async (programName) => {
  try {
    const response = await axios.post("/api/user/getcoursesfromdb", {
      program: programName
    });
    courseOptions.value = response.data;
    filteredCourseOptions.value = response.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    errorResponse.value = "Failed to load courses";
    error.value = true;
  }
};

onMounted(async () => {
  await getProgramOptions();
});

// Filter programs
const filterOptions = () => {
  if (!searchQuery.value) {
    filteredOptions.value = options.value;
    return;
  }
  
  filteredOptions.value = options.value.filter((option) =>
    option.program_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

// Filter courses
const filterOptionsCourses = () => {
  if (!searchQueryCourses.value) {
    filteredCourseOptions.value = courseOptions.value;
    return;
  }
  
  filteredCourseOptions.value = courseOptions.value.filter((option) =>
    option.course_name.toLowerCase().includes(searchQueryCourses.value.toLowerCase())
  );
};

watch(searchQuery, filterOptions);
watch(searchQueryCourses, filterOptionsCourses);

// Select program and fetch related courses
const selectOption = async (option, option_id) => {
  searchQuery.value = option;
  signupData.value.program_id = option_id; // Store the ID instead of the name
  showOptions.value = false;
  
  // Reset course selection when program changes
  searchQueryCourses.value = "";
  signupData.value.course = "";
  
  // Fetch courses for selected program
  await getCourseOptions(option_id);
};

// Select course
const selectCourseOption = (option) => {
  searchQueryCourses.value = option;
  signupData.value.course = option;
  showCourseOptions.value = false;
};

const checkProgram = async (userval) => {
  return options.value.some((thepro) => thepro.program_name === userval);
};

const checkCourse = async (userval) => {
  return courseOptions.value.some((course) => course.course_name === userval);
};

const handleSubmit = async () => {
    buttoncon.value = true;

  if (!searchQuery.value || !searchQueryCourses.value) {
    errorResponse.value = "Please select both program and course";
    error.value = true;
    return;
  }

  // No need to set program_id here since it's already set in selectOption
  signupData.value.course = searchQueryCourses.value;
  
  look.value = await checkProgram(searchQuery.value) && 
               await checkCourse(signupData.value.course);

  if (!look.value) {
    errorResponse.value = "Please select valid program and course from the options";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
    return;
  }

  try {
    const response = await axios.post("/api/user/addcourse", signupData.value);
    
    if (response.data.success) {
      successMsg.value = true;
      successMessage.value = response.data.message;
      
      setTimeout(() => {
        signupData.value = {
          program_id: "", // Reset with program_id instead of program
          course: ""
        };
        searchQuery.value = "";
        searchQueryCourses.value = "";
        successMsg.value = false;
      }, 3000);
    } else {
      errorResponse.value = response.data.message || "An error occurred";
      error.value = true;
      setTimeout(() => {
        error.value = false;
      }, 3000);
    }
  } catch (err) {
    console.error("Error during Adding Course:", err);
    errorResponse.value = err.response?.data?.message || "An error occurred";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
  } finally {
    buttoncon.value = false;
  }
};

</script>

<template>
  <main class="notclasscon">
    <confirm v-if="successMsg" :messagevalue="successMessage" />
    
    <section class="signupsec">
      <form @submit.prevent="handleSubmit" class="signupform">
        <h2>Add Course</h2>
        <div class="signupinputs">
          <p v-if="error" class="error" role="alert">{{ errorResponse }}</p>
          
          <!-- Program Selection -->
          <div class="searchfilter">
            <input
              type="text"
              required
              pattern="^[A-Za-z0-9 ]+$"
              v-model="searchQuery"
              @input="filterOptions"
              placeholder="Choose Your Program From Options"
              @focus="showOptions = true"
              aria-label="Program"
              aria-expanded="showOptions"
              role="combobox"
            />
            <ul v-if="showOptions && filteredOptions.length" role="listbox">
              <li
                v-for="(option, index) in filteredOptions"
                :key="index"
                @click="selectOption(option.program_name,option.program_id)"
                role="option"
                :aria-selected="searchQuery === option.program_name"
              >
                {{ option.program_name }}
              </li>
            </ul>
          </div>

          <!-- Course Selection -->
          <div class="searchfilter">
            <input
              type="text"
              required
             
              v-model="searchQueryCourses"
              @input="filterOptionsCourses"
              placeholder="Choose Your Course From Options"
              @focus="showCourseOptions = true"
              aria-label="Course"
              aria-expanded="showCourseOptions"
              role="combobox"
              :disabled="!searchQuery"
            />
            <ul v-if="showCourseOptions && filteredCourseOptions.length" role="listbox">
              <li
                v-for="(option, index) in filteredCourseOptions"
                :key="index"
                @click="selectCourseOption(option.course_name)"
                role="option"
                :aria-selected="searchQueryCourses === option.course_name"
              >
                {{ option.course_name }}
              </li>
            </ul>
          </div>
          
          <button type="submit" :disabled="buttoncon">
            {{buttoncon ? "Adding Course" : "Add Course"}}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media only screen and (max-width: 349px) {
  .error {
    font-family: var(--majorfont);
    font-size: 1.4rem;
    color: red;
  }
  .signupconn {
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 12px;
  }
  .logo {
    /* border:2px solid green; */
    height: 7%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo h1 {
    font-family: var(--majorfont);
    font-weight: 500;
    font-size: 1.8rem;
  }
  .signupsec {
    /* border:2px solid purple; */
    height: 93%;
    display: flex;
    align-items: end;
    /* justify-content: center; */
  }

  .signupform {
    /* border: 2px solid brown; */
    height: 95%;
    border-radius: 10px;
    align-items: center;
    background-color: var(--peach_color);
    display: flex;
    padding: 8px 5px;
    flex-direction: column;
    width: 100%;
  }
  .signupform h2 {
    font-family: var(--majorfont);
    font-size: 1.5rem;
  }

  .signupinputs {
    /* border: 2px solid purple; */
    height: 87%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 92%;
    background-color: var(--peach_color);
    border: none;
    border-bottom: 2px dotted black;
    height: 10%;
    font-size: 1rem;
    outline: none;
    padding: 2px 5px;
    font-family: var(--majorfont);
    font-family: 500;
  }
  .signupinputs input::placeholder {
    color: black;
  }

  .signupinputs button {
    height: 14%;
    width: 50%;
    background-color: black;
    border: none;
    border-radius: 5px;
    color: var(--peach_color);
    font-family: var(--majorfont);
    font-size: 1rem;
  }

  .alreadyacc {
    /* border: 2px solid blue; */
    width: 100%;
    height: 6%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-family: var(--majorfont);
  }
  .searchfilter {
    width: 92%;
    height: 12%;
    /* border: 2px solid blue; */
  }
  .searchfilter input {
    height: 100%;
    width: 100%;
  }
  ul {
    border: 2px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    list-style: none;
    position: absolute;
    background-color: white;
    width: 50%;
  }

  li {
    padding: 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.096);
    cursor: pointer;
  }

  li:hover {
    background-color: #eee;
  }
}

.signupinputs button:disabled{
  background-color: var(--peach_color);
  border: 2px solid black;
  color: black;
}

@media only screen and (min-width: 350px) {
  .error {
    font-family: var(--majorfont);
    font-size: 1.6rem;
    color: red;
  }
  .signupconn {
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 12px;
  }
  .logo {
    /* border:2px solid green; */
    height: 7%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo h1 {
    font-family: var(--majorfont);
    font-weight: 500;
    font-size: 1.8rem;
  }
  .signupsec {
    /* border:2px solid purple; */
    height: 93%;
    width: 100%;
    padding: 0px 10px;
    display: flex;
    align-items: end;
    /* justify-content: center; */
  }

  .signupform {
    /* border: 2px solid brown; */
    height: 95%;
    border-radius: 10px;
    align-items: center;
    background-color: var(--peach_color);
    display: flex;
    padding: 8px 5px;
    flex-direction: column;
    width: 100%;
  }
  .signupform h2 {
    font-family: var(--majorfont);
    font-size: 1.5rem;
  }

  .signupinputs {
    /* border: 2px solid purple; */
    height: 87%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 92%;
    background-color: var(--peach_color);
    border: none;
    border-bottom: 2px dotted black;
    height: 10%;
    font-size: 1rem;
    outline: none;
    padding: 2px 5px;
    font-family: var(--majorfont);
    font-family: 500;
  }
  .signupinputs input::placeholder {
    color: black;
  }

  .signupinputs button {
    height: 15%;
    width: 50%;
    background-color: black;
    border: none;
    border-radius: 5px;
    color: var(--peach_color);
    font-family: var(--majorfont);
    font-size: 1rem;
  }
  .alreadyacc {
    /* border: 2px solid blue; */
    width: 100%;
    height: 6%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-family: var(--majorfont);
  }
  .searchfilter {
    width: 92%;
    height: 12%;
    /* border: 2px solid blue; */
  }
  .searchfilter input {
    height: 100%;
    width: 100%;
  }
  ul {
    border: 2px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    list-style: none;
    position: absolute;
    background-color: white;
    width: 50%;
  }

  li {
    padding: 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.096);
    cursor: pointer;
  }

  li:hover {
    background-color: #eee;
  }
}

@media only screen and (min-width: 567px) {
  .signupsec {
    /* border: 2px solid purple; */
    height: 93%;
    width: 100%;
    padding: 0px 10px;
    display: flex;
    align-items: end;
    justify-content: center;
  }
  .signupform {
    /* border: 2px solid brown; */
    height: 95%;
    border-radius: 10px;
    align-items: center;
    background-color: var(--peach_color);
    display: flex;
    padding: 8px 5px;
    flex-direction: column;
    width: 70%;
  }
}
</style>