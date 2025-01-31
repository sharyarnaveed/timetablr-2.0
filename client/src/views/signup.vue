<script setup>
import { onMounted, ref, watch } from "vue";
import { useProgramsStore } from "@/stores/programs";
import axios from "axios";
import router from "@/router";
import confirm from "@/components/success.vue";
import errorcard from "@/components/error.vue";
const buttoncon = ref(false);
// Form state
const searchQuery = ref("");
const errorResponse = ref("");
const look = ref(false);
const error = ref(false);
const successMsg = ref(false);
const successMessage = ref("");
const options = ref([]);
const filteredOptions = ref([]);
const showOptions = ref(false);

const myprograms = useProgramsStore();

const signupData = ref({
  // Consistent camelCase naming
  fullname: "",
  username: "",
  department: "",
  program: "",
  password: "",
  repeatpassword: "",
});

// Fetch program options
const getProgramOptions = async () => {
  // Consistent camelCase naming
  try {
    const response = await axios.post("/api/user/getprogramfromdb");
    await myprograms.setprograms(response.data);
    options.value = await myprograms.programs;
  } catch (err) {
    console.error("Error fetching programs:", err);
    errorResponse.value = "Failed to load programs"; // Added error handling for users
    error.value = true;
  }
};

onMounted(async () => {
  await getProgramOptions();
});

const filterOptions = () => {
  if (!searchQuery.value) {
    filteredOptions.value = options.value;
    return;
  }

  filteredOptions.value = options.value.filter((option) =>
    option.program_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

watch(searchQuery, filterOptions);

const selectOption = (option) => {
  searchQuery.value = option;
  signupData.value.program = option;
  showOptions.value = false;
};

const checkProgram = async (userval) => {
  return options.value.some((thepro) => thepro.program_name === userval);
};

const handleSubmit = async () => {
  buttoncon.value = true;

  if (
    !signupData.value.fullname ||
    !signupData.value.username ||
    !signupData.value.department ||
    !searchQuery.value ||
    !signupData.value.password ||
    !signupData.value.repeatpassword
  ) {
    errorResponse.value = "Please fill in all fields";
    error.value = true;
    return;
  }

  if (signupData.value.password !== signupData.value.repeatpassword) {
    errorResponse.value = "Passwords do not match";

    error.value = true;
    buttoncon.value = false;
    setTimeout(() => {
      error.value = false;
    }, 3000);
    return;
  }

  signupData.value.program = searchQuery.value;
  look.value = await checkProgram(signupData.value.program);

  if (!look.value) {
    errorResponse.value = "Choose Correct Program from Options";
    error.value = true;
    buttoncon.value = false;
    setTimeout(() => {
      error.value = false;
    }, 3000);
    return;
  }

  try {
    const response = await axios.post("/api/user/signup", signupData.value);

    if (response.data.success) {
      successMsg.value = true;
      successMessage.value = response.data.message;

      setTimeout(() => {
        signupData.value = {
          fullname: "",
          username: "",
          department: "",
          program: "",
          password: "",
          repeatpassword: "",
        };
        searchQuery.value = "";
        successMsg.value = false;
      }, 3000);
    } else {
      errorResponse.value = response.data.message || "An error occurred";
      error.value = true;
      setTimeout(() => {
        error.value = false;
      }, 3000);
      buttoncon.value = false;
    }
  } catch (err) {
    console.error("Error during signup:", err);
    errorResponse.value = err.response?.data?.message || "An error occurred";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
    buttoncon.value = false;
  } finally {
    buttoncon.value = false;
  }
};
</script>

<template>
  <main class="signupconn">
    <div class="logo">
      <h1>Timetablr</h1>
    </div>
    <confirm v-if="successMsg" :messagevalue="successMessage" />
    <errorcard v-if="error" :messagevalue="errorResponse" />

    <section class="signupsec">
      <form @submit.prevent="handleSubmit" class="signupform">
        <h2>Welcome,<br /><span>sign up to continue</span></h2>

        <div class="signupinputs">
          <input
            required
            v-model="signupData.fullname"
            placeholder="Full Name"
            type="text"
            pattern="^[A-Za-z ]+$"
            title="Only letters and spaces are allowed"
            aria-label="Full Name"
          />

          <input
            required
            v-model="signupData.username"
            placeholder="Username"
            type="text"
            pattern="^[A-Za-z0-9_]+$"
            title="Only letters, numbers and underscore are allowed"
            aria-label="Username"
          />

          <input
            required
            v-model="signupData.department"
            placeholder="Department"
            pattern="^[A-Za-z ]+$"
            type="text"
            aria-label="Department"
          />

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
                @click="selectOption(option.program_name)"
                role="option"
                :aria-selected="searchQuery === option.program_name"
              >
                {{ option.program_name }}
              </li>
            </ul>
          </div>

          <input
            required
            v-model="signupData.password"
            placeholder="Password"
            type="password"
            minlength="8"
            maxlength="20"
            pattern="^[A-Za-z0-9_]+$"
            title="Only letters, numbers and underscore are allowed"
            aria-label="Password"
          />

          <input
            required
            v-model="signupData.repeatpassword"
            placeholder="Re-Password"
            type="password"
            aria-label="Confirm Password"
          />

          <button type="submit" :disabled="buttoncon">
            {{ buttoncon ? "Signing up" : "Sign Up" }}
          </button>
        </div>

        <div class="alreadyacc">
          Already Have an Account?
          <router-link to="/signin">Sign In</router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media only screen and (max-width: 349px) {
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
  .signupsec[data-v-e85d65cb] {
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    padding: 0px 10px;
    display: flex;
    align-items: end;
    justify-content: center;
    align-items: center;
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
    margin-bottom: 1px;
  }
  .signupform span {
    color: var(--font-color-sub);
    font-weight: 600;
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
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 10px;
  }

  .signupsec[data-v-e85d65cb] {
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    /* padding: 0px 10px; */
    display: flex;
    justify-content: center;
    align-items: center;
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
    /* border: 2px solid red; */
    height: 100vh;
    padding: 10px 12px;
  }

  .signupsec[data-v-e85d65cb] {
    /* border: 2px solid purple; */
    height: 100%;
    width: 100%;
    padding: 0px 10px;
    display: flex;
    align-items: end;
    justify-content: center;
    align-items: center;
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
</style>
