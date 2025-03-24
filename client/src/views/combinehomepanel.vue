<script setup>
import Today from '@/views/panehome.vue'
import SeeMore from '@/components/LoadAll.vue'
import Timetable from "@/views/Daywise.vue"
import { useUserStore } from "@/stores/userinfo";
import profilecard from '@/components/profilecard.vue';
import { onMounted, ref } from 'vue'
import Other from './otherTimetables.vue';
import speeddail from '@/components/navbar.vue';
const userStore = useUserStore();
const username = ref("");
const currentTab = ref('Today')
const showprofile=ref(false)

onMounted(async()=>
{
    username.value = await userStore.getusername();

})

const tabs = {
    Today,
  SeeMore,
Timetable,
Other
}


const displaycard=()=>
{

  showprofile.value=true;
  
}
function handleCustomevent(data)
{

  if(data===true)
{
  showprofile.value=false;

}
}



</script>

<template>
     <div class="hometop">
      <div class="settings">
       
        <p class="username"><span>Welcome, </span>{{ username }}</p>
      </div>

      <div class="profileimg" @click="displaycard">
        <img src="../assets/koala.png" alt="">
      </div>
      
    </div>
  <div class="demo">
    <div class="tabbuttonsdiv">
      <button
       v-for="(_, tab) in tabs"
       :key="tab"
       :class="['tab-button', { active: currentTab === tab }]"
       @click="currentTab = tab"
     >
      {{ tab }}
    </button>
    </div>
  
    <keep-alive>
    
      <div v-if="showprofile" @click="" class="profilecard">
        <profilecard @custom-event="handleCustomevent"/>
      </div>
    </keep-alive>
	  <component :is="tabs[currentTab]" class="tab"></component>
  </div>

  <div class="speeddailcon">
        <speeddail />
      </div>
</template>

<style scoped>
.demo {
  font-family: sans-serif;
  border-radius: 2px;
  padding: 10px 10px;

}
.tabbuttonsdiv {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto; 
  height: 50px;
  width: 100%;
  gap: 10px;
  justify-content: center; 
  align-items: center;
}

.tab-button {
flex: 1;
  min-width: 80px;
  padding: 10px;
  border-radius: 30px;
  font-family: var(--majorfont);
  font-size: 0.9rem;
  border: 2px solid #1B1B1D;
  cursor: pointer;
  background: #fff;
  width: 25%;
  height: 90%;

}

.tab-button:hover, 
.tab-button.active {
  background: #1B1B1D;
  color: whitesmoke;
}

@media only screen and (max-width: 349px){
    .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 50%;
    gap: 15px;
    font-family: var(--majorfont);
    font-size: 0.9rem;
    display: flex;
    color: #1b1b1d;
    justify-content: center;
    align-items: center;
  }
  .tab-button
  {
  width: 27%;

  }
  .hometop {
    /* border: 2px solid purple; */
    height: 12%;
    display: flex;
    justify-content: space-between;
    padding: 2px 5px;
    align-items: center;
  }
  .settings span {
    color: #1b1b1d;
    opacity: 0.7;
  }

  .profileimg {
    /* border: 2px solid red; */

    height: 40px;
    width: 40px;
  }

  .profileimg img {
    height: 90%;
    width: 100%;
  }
}


@media only screen and (min-width: 350px) {
    .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 45%;
    gap: 15px;
    font-family: var(--majorfont);
    font-size: 1rem;
    display: flex;
    color: #1b1b1d;
    justify-content: center;
    align-items: center;
  }
  .hometop {
    /* border: 2px solid purple; */
    height: 12%;
    display: flex;
    justify-content: space-between;
    padding: 5px 5px;
    align-items: center;
  }
  .settings span {
    color: #1b1b1d;
    opacity: 0.7;
  }

  .profileimg {
    /* border: 2px solid red; */
    height: 45px;
    width: 45px;
  }

  .profileimg img {
    height: 100%;
    width: 100%;
  }

.profilecard{
/* border: 2px solid red; */
position: absolute;
height: 100%;
top: 0;
width: 100%;
left: 0;
z-index: 1;
background-color: #1b1b1db4;
display: flex;
justify-content: center;
align-items: center;
}

}

@media only screen and (min-width: 500px) {
  .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 23%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .settings img {
    height: 100%;
    width: 100%;
  }

  .profileimg {
    /* border: 2px solid red; */

    height: 50px;
    width: 50px;
  }

  .profileimg img {
    height: 100%;
    width: 100%;
  }


  .hometop {
    /* border: 2px solid purple; */
    height: 8%;
    display: flex;
    justify-content: space-between;

    align-items: center;
  }
}

@media only screen and (min-width: 764px) {
  .profileimg {
    /* border: 2px solid red; */
    height: 50px;
    width: 50px;
  }

  .profileimg img {
    height: 100%;
    width: 100%;
  }

}



</style>