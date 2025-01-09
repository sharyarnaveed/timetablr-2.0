<script setup>
import { onMounted, ref, watch } from "vue";
import { useProgramsStore } from "@/stores/programs";
import axios from "axios";
import router from "@/router";
import confirm from "@/components/success.vue";
const searchQuery = ref("");
const errorresponce = ref("");
const look=ref(false)
const error = ref(false);
const successmsg = ref(false);
const successmessage = ref("");
const options = ref([]);

const myprograms = useProgramsStore();

const getprogramoptions = async () => {
  try {
    const response = await axios.post("/api/user/getprogramfromdb");
    await myprograms.setprograms(response.data);
    const returnval = await myprograms.programs;

    options.value = returnval;
  } catch (err) {
    console.error("Error fetching programs:", err);
  }
};

onMounted(async () => {
  await getprogramoptions();
});

const filteredOptions = ref([]);
const showOptions = ref(false);

const signupdata = ref({
  fullname: "",
  username: "",
  department: "",
  program: "",
  password: "",
  repeatpassword: "",
});

const filterOptions = () => {
  filteredOptions.value = options.value.filter((option) =>
    option.program_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

watch(searchQuery, filterOptions);

const selectOption = (option) => {
  searchQuery.value = option;
  showOptions.value = false;
};

const checkprogram = async (userval) => {
  const thecheck = options.value.some((thepro) => {
    if (thepro.program_name === userval) {
      return true;
    }
    return false;
  });

  return thecheck;
};

const handlesubmit = async () => {
  signupdata.value.program = searchQuery.value;

  if (signupdata.value.password !== signupdata.value.repeatpassword) {
    errorresponce.value = "Passwords do not match";
    error.value = true;
  } else {



     look.value = await checkprogram(signupdata.value.program);
   if(look.value===false)
   {
     errorresponce.value =  "Choose Correct Program from Options";
     setTimeout(() => {
       
       error.value = false;
    }, 3000);
   }
else{

  try {
    const response = await axios.post("/api/user/signup", signupdata.value);
    console.log(response.data);
    if (response.data.success) {
        successmsg.value = true;
        successmessage.value = response.data.message;
        setTimeout(() => {
          signupdata.value = {
            fullname: "",
            username: "",
            department: "",
            
            password: "",
            repeatpassword: "",
          };
        }, 3000);
      } else {
        errorresponce.value = response.data.message || "An error occurred";
        error.value = true;
        setTimeout(() => {
       
       error.value = false;
    }, 3000);
      }
    } catch (err) {
      console.error("Error during signup:", err);
      errorresponce.value = "An error occurred";
      error.value = true;
      setTimeout(() => {
       
       error.value = false;
    }, 3000);
    }
  }
}




};
</script>

<template>
  <main class="signupconn">
    <div class="logo">
      <h1>Timetablr</h1>
    </div>
    <confirm v-if="successmsg" :messagevalue="successmessage" />
    <section class="signupsec">
      <form @submit.prevent="handlesubmit" class="signupform" action="">
        <h2>Create Account</h2>

        <div class="signupinputs">
          <p v-if="error" class="error">{{ errorresponce }}</p>
          <input
            required
            v-model="signupdata.fullname"
            placeholder="Full Name"
            type="text"
            pattern="^[A-Za-z ]+$"
            title="Symbols are not allowed"
          />

          <input
            required
            v-model="signupdata.username"
            placeholder="Username"
            type="text"
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
          />
          <input
            required
            v-model="signupdata.department"
            placeholder="Department"
            pattern="^[A-Za-z ]+$"
            type="text"
          />

          <!-- search filter -->
          <div class="searchfilter">
            <input
              type="text"
              required
              pattern="^[A-Za-z0-9 ]+$"
              v-model="searchQuery"
              @input="filterOptions"
              placeholder="Choose Your Program From Options"
              @focus="showOptions = true"
            />
            <ul v-if="showOptions && filteredOptions.length">
              <li
                v-for="(option, index) in filteredOptions"
                :key="index"
                @click="selectOption(option.program_name)"
              >
                {{ option.program_name }}
              </li>
            </ul>
          </div>

          <input
            required
            v-model="signupdata.password"
            placeholder="Password"
            type="password"
            minlength="8"
            maxlength="20"
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
          />
          <input
            required
            v-model="signupdata.repeatpassword"
            placeholder="Re-Password"
            type="password"
          />
          <button type="submit">Sign Up</button>
        </div>

        <div class="alreadyacc">
          Already Have an Account ?
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
