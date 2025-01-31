<script setup>
import api from "@/api";
import Error from "@/components/error.vue";
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
const signindata = ref({
  username: "",
  password: "",
});

const siginerrorresponce = ref("");
const signinerrorcheck = ref(false);
const instance = axios.create({
  baseURL: 'http://localhost:3000' // Adjusted with trailing slash

});
const buttoncon=ref(false)

const handlesubmit = async () => {
  try {
    buttoncon.value=true
    const response = await instance.post("/api/user/signin", signindata.value,{withCredentials:true});

    if (response.data.success) {
        router.push("/home");
      } else {
        siginerrorresponce.value = response.data.message || "An error occurred";
        signinerrorcheck.value = true;
        setTimeout(() => {
        signinerrorcheck.value = false;
          
        }, 3000);
      }
  } catch (error) {
    console.log("error in making request", error);
    signinerrorcheck.value = true;
    setTimeout(() => {
        signinerrorcheck.value = false;
          
        }, 3000);

  }
  finally{
    buttoncon.value=false
  }
};
</script>

<template>
  <main class="signupconn">
    <div class="logo">
      <h1>Timetablr</h1>
    </div>
    <section class="signupsec">
      <Error v-if="signinerrorcheck" :messagevalue="siginerrorresponce"  />
      <form @submit.prevent="handlesubmit" class="signupform" action="">
        <h2>Sign In</h2>

        <div class="signupinputs">
          <input
            required
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
            v-model="signindata.username"
            placeholder="Username"
            type="text"
          />

          <input
            required
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
            v-model="signindata.password"
            placeholder="Password"
            type="password"
          />

          <button :disabled="buttoncon">
{{ buttoncon?"Signing In":"Sign In" }}

          </button>
        </div>

        <div class="alreadyacc">
          Don't Have Account? <router-link to="/signup">Sign Up</router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
@media only screen and (max-width: 349px) {

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
    height: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3%;
  }

  .signupform {
        --input-focus: #2d8cf0;
        --font-color: #323232;
        --font-color-sub: #666;
        --bg-color: #fff;
        --main-color: #323232;
        padding: 15px;
        background: lightgrey;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        /* gap: 0px; */
        height: 70%;
        width: 90%;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        box-shadow: 4px 4px var(--main-color);
    }
  .signupform h2 {
    color: var(--font-color);
  font-weight: 900;
  font-size: 1.5rem;
  font-family: var(--majorfont);
  /* margin-bottom: 2px; */
  }

  .signupinputs {
    /* border: 2px solid purple; */
    height: 87%;
    width: 100%;
    margin: 15px 0px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 95%;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1rem;
  /* gap: 10px; */
  font-weight: 600;
  color: var(--font-color);
  font-family: var(--majorfont);
  padding: 5px 10px;
  outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }
  .signupinputs input:focus{
    scale: 1.07;
  }
  .signupinputs button {
    margin: 0px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  font-family: var(--majorfont);
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
}

.signupinputs button:disabled {
  background-color: var(--font-color-sub);
  border: 2px solid black;
  color: whitesmoke;
}


@media only screen and (min-width: 350px) {

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
    height: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3%;
  }

  .signupform {
        --input-focus: #2d8cf0;
        --font-color: #323232;
        --font-color-sub: #666;
        --bg-color: #fff;
        --main-color: #323232;
        padding: 15px;
        background: lightgrey;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 13px;
        width: 90%;
        height: 60%;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        box-shadow: 4px 4px var(--main-color);
    }
  .signupform h2 {
    color: var(--font-color);
  font-weight: 900;
  font-size: 1.5rem;
  font-family: var(--majorfont);
  /* margin-bottom: 2px; */
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
    width: 95%;
  height: 20%;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color);
  font-family: var(--majorfont);
  padding: 5px 10px;
  outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }
  .signupinputs input:focus{
    scale: 1.07;
  }
  .signupinputs button {
    margin: 0px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  font-family: var(--majorfont);
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
}

@media only screen and (min-width: 567px) {
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
    height: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3%;
  }

  .signupform {
        --input-focus: #2d8cf0;
        --font-color: #323232;
        --font-color-sub: #666;
        --bg-color: #fff;
        --main-color: #323232;
        padding: 15px;
        background: lightgrey;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 13px;
        height: 75%;
        width: 60%;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        box-shadow: 4px 4px var(--main-color);
    }
  .signupform h2 {
    color: var(--font-color);
  font-weight: 900;
  font-size: 1.5rem;
  font-family: var(--majorfont);
  /* margin-bottom: 2px; */
  }

  .signupinputs {
    /* border: 2px solid purple; */
    height: 80%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
  }
  .signupinputs input {
    width: 95%;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1rem;
  font-weight: 600;
  color: var(--font-color);
  font-family: var(--majorfont);
  padding: 5px 10px;
  outline: none;
  }
  .signupinputs input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }
  .signupinputs input:focus{
    scale: 1.07;
  }
  .signupinputs button {
    margin: 0px auto 0 auto;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  font-family: var(--majorfont);
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
}
</style>
