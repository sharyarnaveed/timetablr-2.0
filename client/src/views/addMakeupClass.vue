<script setup>
import api from "@/api";
import { onMounted, ref, watch } from "vue";
import confirm from "@/components/success.vue";
import axios from "axios";
import Error from "@/components/error.vue";
const buttoncon = ref(false);
const searchQueryCourses = ref("");
const errorResponse = ref("");
const look = ref(false);
const error = ref(false);
const successMsg = ref(false);
const successMessage = ref("");
const courseOptions = ref([]);
const filteredOptions = ref([]);
const filteredCourseOptions = ref([]);
const showCourseOptions = ref(false);
const makeClassData = ref({
  course: "",
  date: "",
  Starttime: "",
  Endtime: "",
});
const getCourses = async () => {
  try {
    const responce = await api.get("/api/user/getmakeupcourses");
    console.log(responce.data);
    courseOptions.value = responce.data;
    filteredOptions.value = responce.value;
  } catch (error) {
    console.log("error in getting courses", error);
  }
};

const filterOptionsCourses = () => {
  if (!searchQueryCourses.value) {
    filteredCourseOptions.value = courseOptions.value;
    return;
  }

  filteredCourseOptions.value = courseOptions.value.filter((option) =>
    option.course_name
      .toLowerCase()
      .includes(searchQueryCourses.value.toLowerCase())
  );
};

const checkCourse = async (userval) => {
  return courseOptions.value.some((course) => course.course_name === userval);
};

const selectCourseOption = (option) => {
  searchQueryCourses.value = option;
  makeClassData.value.course = option;
  showCourseOptions.value = false;
};

const handleSubmit = async () => {
  buttoncon.value = true;

  if (!searchQueryCourses.value) {
    errorResponse.value = "Please select course";
    error.value = true;
    return;
  }

  makeClassData.value.course = searchQueryCourses.value;
  console.log(makeClassData.value);

  look.value = await checkCourse(makeClassData.value.course);

  if (!look.value) {
    errorResponse.value = "Please select valid  course from the options";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
    return;
  }

  try {
    const response = await axios.post(
      "/api/user/addmakeupclass",
      makeClassData.value
    );
    console.log(response);

    if (response.data.success) {
      successMsg.value = true;
      successMessage.value = response.data.message;
      // localStorage.removeItem("classes");
      setTimeout(() => {
        makeClassData.value = {
          // Reset with program_id instead of program
          course: "",
          Starttime: "",
          Endtime: "",
        };
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
    console.error("Error during Adding Class:", err);
    errorResponse.value = err.response?.data?.message || "An error occurred";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
  } finally {
    buttoncon.value = false;
  }
};

const showTimePicker = (id) => {
  const timeInput = document.getElementById(id);
  timeInput.showPicker();
};
watch(searchQueryCourses, filterOptionsCourses);

onMounted(() => {
  getCourses();
});
</script>

<template>
  <main class="notclasscon">
    <confirm v-if="successMsg" :messagevalue="successMessage" />
    <Error v-if="error" class="error" :messagevalue="errorResponse" />

    <section class="signupsec">
      <form @submit.prevent="handleSubmit" class="signupform">
        <h2>Add Make Class</h2>
        <div class="signupinputs">
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
            />
            <ul
              v-if="showCourseOptions && filteredCourseOptions.length"
              role="listbox"
            >
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

          <div class="time-input-container">
            <label for="date">Date</label>
            <div class="time-wrapper" @click="showTimePicker('date')">
              <input
                id="date"
                type="date"
                required
                v-model="makeClassData.date"
                placeholder="date"
              />
            </div>
          </div>

          <div class="time-input-container">
            <label for="startTime">Start Time</label>
            <div class="time-wrapper" @click="showTimePicker('startTime')">
              <input
                id="startTime"
                type="time"
                required
                v-model="makeClassData.Starttime"
                placeholder="Start Time"
              />
            </div>
          </div>

          <div class="time-input-container">
            <label for="endTime">End Time</label>
            <div class="time-wrapper" @click="showTimePicker('endTime')">
              <input
                id="endTime"
                type="time"
                required
                v-model="makeClassData.Endtime"
                placeholder="end Time"
              />
            </div>
          </div>



          <button type="submit" :disabled="buttoncon">
            {{ buttoncon ? "Adding Class" : "Add  Class" }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media only screen and (max-width: 349px) {
  .signupconn {
    position: fixed;
    background: white;
    width: 100%;
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 12px;
    z-index: 1;
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
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    padding: 0px 10px;
    display: flex;

    justify-content: center;
    align-items: start;
  }

  .signupform {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 10px 10px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 91%;
    width: 100%;
    justify-content: center;
    /* gap: px; */
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 5px 5px var(--main-color);
  }
  .signupform h2 {
    color: var(--font-color);
    font-weight: 900;
    font-size: 1.5rem;
    font-family: var(--majorfont);

    margin-bottom: 1px;
  }
  .signupform span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 1.3rem;
    font-family: var(--majorfont);
  }
  .signupinputs {
    /* border: 2px solid purple; */
    height: 95%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 90%;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .signupinputs button {
    margin: 5px auto 5px auto;

    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }
  .signupinputs button:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
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
    width: 55%;
    z-index: 1;
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

.signupinputs button:disabled {
  background-color: var(--font-color-sub);
  border: 2px solid black;
  color: whitesmoke;
}

@media only screen and (min-width: 350px) {
  .error {
    font-family: var(--majorfont);
    font-size: 1.6rem;
    color: red;
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
  .signupconn {
    position: fixed;
    background: white;
    width: 100%;
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 10px;
    z-index: 1;
  }

  .signupsec {
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    padding: 10px 5px;
    display: flex;
    justify-content: center;
    align-items: start;
  }

  .signupform {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 10px 10px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 91%;
    width: 90%;
    justify-content: center;
    /* gap: px; */
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 5px 5px var(--main-color);
  }
  .signupform h2 {
    color: var(--font-color);
    font-weight: 900;
    font-size: 1.5rem;
    font-family: var(--majorfont);
    margin-bottom: 1px;
  }
  .signupform span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-family: var(--majorfont);

    font-size: 1.3rem;
  }
  .signupinputs {
    /* border: 2px solid purple; */
    height: 95%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 90%;
    height: 10%;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-family: var(--majorfont);

    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .signupinputs button {
    margin: 5px auto 5px auto;

    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }
  .signupinputs button:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
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
    width: 60%;
    z-index: 1;
  }

  li {
    padding: 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.096);
    cursor: pointer;
    font-family: var(--majorfont);
  }

  li:hover {
    background-color: #eee;
  }
}

@media only screen and (min-width: 576px) {
  .error {
    font-family: var(--majorfont);
    font-size: 1.6rem;
    color: red;
  }
  .signupconn {
    position: fixed;
    background: white;
    width: 100%;
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 12px;
    z-index: 1;
  }

  .signupsec {
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    padding: 10px 2px;
    display: flex;
    align-items: start;
    justify-content: center;
  }

  .signupform {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 10px 10px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 95%;
    width: 80%;
    justify-content: center;
    /* gap: px; */
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 5px 5px var(--main-color);
  }
  .signupform h2 {
    color: var(--font-color);
    font-weight: 900;
    font-size: 1.8rem;
    margin-bottom: 1px;
  }
  .signupform span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 1.4rem;
  }
  .signupinputs {
    /* border: 2px solid purple; */
    height: 95%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 90%;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .signupinputs button {
    margin: 5px auto 5px auto;
    font-family: var(--majorfont);

    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }
  .signupinputs button:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
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
    z-index: 1;
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

.time-wrapper {
  width: 100%;
  position: relative;
  cursor: pointer;
}

.time-wrapper input[type="time"] {
  cursor: pointer;
  font-family: var(--majorfont);
}

.time-wrapper input[type="time"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.time-input-container {
  width: 90%;
}
.time-input-container input[type="time"] {
  width: 100% !important;
  height: 40px !important;
  padding-right: 30px;
}
</style>
