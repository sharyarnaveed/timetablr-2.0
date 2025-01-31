<template>
    <main class="signupconn">
    
    <section class="signupsec">
      <Success v-if="whenSuccess" :messagevalue="message"/>
      <Errorcard v-if="whenerror" :messagevalue="errormsg"/>
      <form @submit.prevent="handlesubmit" class="signupform" action="">
        <h2>Change Password </h2>

        <div class="signupinputs">
          <input
            required
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
         v-model="changepassword.oldpassword"
            placeholder="Old Password"
            type="password"
          />

          <input
            required
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
             v-model="changepassword.newpassword"
            placeholder="New Password"
            type="password"
          />
          <input
            required
            pattern="^[A-Za-z0-9_]+$"
            title="Symbols ' - = are not allowed"
            v-model="repeatpassword"
            placeholder=" Repeat New Password"
            type="password"
          />
          <button>Change</button>
        </div>

       
      </form>
    </section>
  </main>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Success from './success.vue';
import Errorcard from './error.vue';
const whenSuccess=ref(false)
const whenerror=ref(false)
const errormsg=ref("")
const repeatpassword=ref("")
const changepassword=ref({
oldpassword:"",
newpassword:"",
})
const message=ref("")

const handlesubmit=async()=>
{
    console.log(changepassword.value)
    console.log(repeatpassword.value)
    if(changepassword.value.newpassword==repeatpassword.value)
{
    try {
        const responce=await axios.post("/api/user/changepassword",changepassword.value);
        console.log(responce);
        message.value=responce.data.message
        whenSuccess.value=true
        setTimeout(() => {
        whenSuccess.value=false
          
        }, 4000);
    } catch (error) {
        
        console.log("Errror In Changing Password");
        whenerror.value=true
        errormsg.value="Errror In Changing Password"
    }
}
else{
  whenerror.value=true
errormsg.value="Passwords do not match"
 
}

}


</script>

<style scoped>
@media only screen and (max-width: 349px) {

  .signupconn {
  /* border: 2px solid red; */
  height: 82%;
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
  height: 100%;
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
      height: 85%;
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
  height: 82%;
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
        display: flex
;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 13px;
        width: 90%;
        height: 91%;
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
height: 15%;
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
  height: 80vh;
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