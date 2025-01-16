<script setup>
import { onMounted, ref, watch } from "vue";
import { useProgramsStore } from "@/stores/programs";
import axios from "axios";
import router from "@/router";
import confirm from "@/components/success.vue";
const buttoncon=ref(false)
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

const signupData = ref({ // Consistent camelCase naming
  fullname: "",
  username: "",
  department: "",
  program: "",
  password: "",
  repeatpassword: "",
});

// Fetch program options
const getProgramOptions = async () => { // Consistent camelCase naming
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
  buttoncon.value=true;
  

  if (!signupData.value.fullname || !signupData.value.username || 
      !signupData.value.department || !searchQuery.value || 
      !signupData.value.password || !signupData.value.repeatpassword) {
    errorResponse.value = "Please fill in all fields";
    error.value = true;
    return;
  }


  if (signupData.value.password !== signupData.value.repeatpassword) {
    errorResponse.value = "Passwords do not match";
    error.value = true;
    return;
  }

  signupData.value.program = searchQuery.value;
  look.value = await checkProgram(signupData.value.program);

  if (!look.value) {
    errorResponse.value = "Choose Correct Program from Options";
    error.value = true;
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
    }
  } catch (err) {
    console.error("Error during signup:", err);
    errorResponse.value = err.response?.data?.message || "An error occurred";
    error.value = true;
    setTimeout(() => {
      error.value = false;
    }, 3000);
  }
  finally{
  buttoncon.value=false;

  }
};
</script>

<template>
  <main class="signupconn">
    <div class="logo">
      <h1>Timetablr</h1>
    </div>
    
    <confirm v-if="successMsg" :messagevalue="successMessage" />
    
    <section class="signupsec">
      <form @submit.prevent="handleSubmit" class="signupform">
        <h2>Create Account</h2>

        <div class="signupinputs">
          <p v-if="error" class="error" role="alert">{{ errorResponse }}</p>
          
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
          
          <button type="submit" :disabled="buttoncon">{{buttoncon?"Signing up":"Sign Up"}}</button>
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
    height: 10%;
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
    height: 10%;
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
