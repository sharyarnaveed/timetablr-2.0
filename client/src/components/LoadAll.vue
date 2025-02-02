<template>
       <div class="notclasscon">
      <Otherclasscard
      v-if="theerrorstate"
        v-for="notclass in notcurrentclass"
        :key="notclass.id"
        :notclass="notclass"
        class="comp"
      />
   <h2 v-else>No Class For Today</h2>
    </div>
</template>

<script setup>
import Otherclasscard from './otherclasscard.vue';
import { onMounted,ref } from 'vue';
const theerrorstate=ref(false);
const timetable = useTimetableStore();
import { useTimetableStore } from "@/stores/timtable";
const notcurrentclass = ref([]);
onMounted(async()=>
{
    notcurrentclass.value = await timetable.getnotclocal();
    if(notcurrentclass.value.length==0)
    {
        theerrorstate.value=false;
    }else{
        theerrorstate.value=true;
    }

    
})
</script>

<style scoped>

@media only screen and (max-width: 349px) {
  .notclasscon {
    /* border: 2px solid red; */
    height: 65vh;
    overflow-y: auto;
    padding: 10px 15px;
    /* margin-top: -//px ; */
  }
  .loadmoremain {
    /* border: 2px solid red; */
    height: 100vh;
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
    height: 65vh;
    overflow-y: auto;
    padding: 10px 15px;
    /* margin-top: 10px ; */
  }
  .loadmoremain {
    /* border: 2px solid red; */
    height: 100vh;
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