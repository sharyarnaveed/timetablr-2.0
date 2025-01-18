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

</style>