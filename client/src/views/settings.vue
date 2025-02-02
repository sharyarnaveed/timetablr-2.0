<script setup>
import UserName from '@/components/changeusername.vue';
import Password from "@/components/changepassword.vue";
import { onMounted, ref } from 'vue';

import api from '@/api';
const currentTab=ref('Password');

const tabs={
    Password,
    UserName
}

onMounted(async()=>
{
  try {
    const responce=await api.post("/api/user/loadall");
  
  } catch (error) {
    console.log(error);
  }
})

</script>
<template>
  <main class="loadmoremain">

     <div class="wrapper">
       <div 
         v-for="(component, tab) in tabs" 
         :key="tab"
         class="option"
         @click="currentTab = tab"
       >
         <input 
           :value="tab" 
           name="btn" 
           type="radio" 
           class="input"
           :checked="currentTab === tab"
         />
         <div class="btn">
           <span class="span">{{ tab }}</span>
         </div>
       </div>
     </div>
 
     <component :is="tabs[currentTab]"></component>
   </main>
</template>

<style scoped>

.wrapper {
  --font-color-dark: #323232;
  --font-color-light: #fff;
  --bg-color: #fff;
  --main-color: #323232;
  --secondary-color: #505050;
  position: relative;
  width: 100%;
  height: 50px;
  background-color: var(--bg-color);
  border: 2px solid var(--main-color);
  border-radius: 34px;
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 4px 4px var(--main-color);
}

.option {
  margin-right: 5px;
  width: 80.5px;
  height: 39px;
  position: relative;
  top: 2px;
  left: 2px;
  border-radius: 34px;
  transition: 0.25s cubic-bezier(0, 0, 0, 1);
}

.option:last-child {
  margin-right: 4px;
}

.option:hover {
  background-color: var(--secondary-color);
}

.option:hover .span {
  color: var(--font-color-light);
}

.input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  appearance: none;
  cursor: pointer;
}

.btn {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.span {
  color: var(--font-color-dark);
  font-family: var(--majorfont);
  font-size: 0.9rem;
}

.input:checked + .btn {
  background-color: var(--main-color);
  transition: 0.2s cubic-bezier(0, 0, 0, 1);
}

.input:checked + .btn .span {
  color: var(--font-color-light);
  transition: 0.25s cubic-bezier(0, 0, 0, 1);
}

@media only screen and (max-width: 349px) {
  .notclasscon {
    /* border: 2px solid red; */
    height: 75vh;
    overflow-y: auto;
    padding: 10px 15px;
    /* margin-top: -//px ; */
  }
  .loadmoremain {
    /* border: 2px solid red; */
    height: 83vh;
    overflow-y: auto;
    display: flex;
    /* gap: 2%; */
    flex-direction: column;
    justify-content: space-evenly;
    padding: 5px 5px;
    /* align-items: center; */
  }
  .comp {
    /* border: 2px solid red; */
    margin: 10px 2px;
    height: 120px;
    padding: 10px 10px;
  }
  .router {
    /* border: 2px solid green; */
    height: 50px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px 10px;
  }
  .backrouter {
    font-size: 1.1rem;
    font-family: var(--majorfont);
    color: black;
    /* border: 2px solid blue; */
  }
}

@media only screen and (min-width: 350px) {
  .notclasscon {
    /* border: 2px solid red; */
    height: 78vh;
    overflow-y: auto;
    padding: 10px 15px;
    margin-top: 10px ;
  }
  .loadmoremain {
    /* border: 2px solid red; */
    height: 80vh;
    overflow-y: auto;
    display: flex;
    /* gap: 2%; */
    padding: 10px 15px;
    flex-direction: column;
    justify-content: space-evenly;
    /* align-items: center; */
  }
  .comp {
    /* border: 2px solid red; */
    margin: 10px 2px;
    height: 120px;
    padding: 10px 10px;
  }
  .backrouter {
    font-size: 1.1rem;
    font-family: var(--majorfont);
    color: black;
  }
  .router {
    /* border: 2px solid green; */
    height: 50px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px 10px;
  }
  .backrouter {
    font-size: 1.1rem;
    font-family: var(--majorfont);
    color: black;
    /* border: 2px solid blue; */
  }
}
</style>
