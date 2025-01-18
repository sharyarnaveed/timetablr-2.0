<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import api from '@/api';
import router from '@/router';
const TimetableData=ref([]);
const Daysgroup=['Monday','Tuesday',"Wednesday","Thursday","Friday"]
const otherclasscard=defineAsyncComponent(()=>import('@/components/otherclasscard.vue'));

import GoingBack from "@/components/backhomeComp.vue";
import { useTimetableStore } from '@/stores/timtable';
const usetimetable=useTimetableStore();

const getAllTimetable = async () => {
  try {
    const response = await api.post("/api/user/alltimetable");
    // console.log(response.data);
    usetimetable.storedaywiseinlocal(response.data.timetable)

 console.log(TimetableData.value);
 
  } catch (error) {
    console.error("Error in getting timetable:", error);
    if (error.response?.status === 401) {
      router.push('/signin');
    }
  }
};


const timetablebyday=(day)=>
{
return TimetableData.value.filter((entry)=>entry.day===day)
}

onMounted(async () => {
  await getAllTimetable();
 TimetableData.value=usetimetable.getdaywiseinlocal();
 


});
</script>



<template>
  <main class="homepanelmain">
    
    <div class="heading">
      
      <h1>Whole TimeTable</h1>
    </div>

    
<div class="alltimecon">
  <GoingBack class="goingback"/>

  <details v-for="(days,index) in Daysgroup" :key="index" >
    <summary>{{days}}</summary>
    <otherclasscard class="classcard" v-for="classentry in timetablebyday(days)" :key="classentry.timetable_id" :notclass="classentry"  />
    <!-- <otherclasscard >{{ classentry }}/> -->
  </details>

 

</div>
</main>
  </template>
  
 <style scoped>
 @media only screen and (max-width: 349px) {
  .homepanelmain {
    /* border: 2px solid red; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 5px 10px;
    height: 100vh;
  }
  .alltimecon {
    /* border: 2px solid blue; */
    height: 85%;
  }
  .heading {
    /* border: 2px solid green; */
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* text-align: center; */
    padding: 2px 5px;
  }
  .heading h1 {
    font-size: 1.7rem;
    font-family: var(--majorfont);
    font-weight: 600;
  }
 
  .goingback{
    /* border: 2px solid brown; */
    width: 30%;
   
  }
  .classcard{
    margin: 8px 2px;
    /* border: 2px solid green; */

  }
  summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  font-weight: bold;
 

  font-family: var(--majorfont);
}

summary::after {
  content: '';
  color: white;
  width: 18px;
  height: 10px;
  background: url('https://uploads.sitepoint.com/wp-content/uploads/2023/10/1697699669arrow.svg') no-repeat;
  background-size: cover;
  transition: 0.2s;
  
}

details[open] > summary::after {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  display: none;
}

summary {

  border-radius: 5px;
  color: #30353b;
  
  
}

details[open] summary {border-radius: 5px 5px 0 0;}

details {
  background-color: var( --skyblue);

  border-radius: 5px;
  padding: 1px 5px;
  margin: 10px 5px;

}

 }


 @media only screen and (min-width: 350px) {
  .homepanelmain {
    /* border: 2px solid red; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 5px 10px;
    height: 100vh;
  }
  .alltimecon {
    /* border: 2px solid blue; */
    height: 85%;
  }
  .heading {
    /* border: 2px solid green; */
    height: 10%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* text-align: center; */
    padding: 2px 5px;
  }
  .heading h1 {
    font-size: 1.7rem;
    font-family: var(--majorfont);
    font-weight: 600;
  }
 
  .goingback{
    /* border: 2px solid brown; */
    width: 30%;
   
  }
  .classcard{
    margin: 8px 2px;
    /* border: 2px solid green; */

  }
  summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  font-weight: bold;
 

  font-family: var(--majorfont);
}

summary::after {
  content: '';
  color: white;
  width: 18px;
  height: 10px;
  background: url('https://uploads.sitepoint.com/wp-content/uploads/2023/10/1697699669arrow.svg') no-repeat;
  background-size: cover;
  transition: 0.2s;
  
}

details[open] > summary::after {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  display: none;
}

summary {

  border-radius: 5px;
  color: #30353b;
  
  
}

details[open] summary {border-radius: 5px 5px 0 0;}

details {
  background-color: var( --skyblue);

  border-radius: 5px;
  padding: 5px 5px;
  margin: 10px 5px;

}

 }
</style>