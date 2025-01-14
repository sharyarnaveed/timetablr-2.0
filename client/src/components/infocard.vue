<template>
  <div class="currentconn">
    <h5 id="subject">
      Subject:
      <p>{{ subject }}</p>
    </h5>
    <h5>
      Venu:
      <p>{{ venu }}</p>
    </h5>
    <h5>
      Time:
      <p>{{ newsttime }} - {{  endtimenew }}</p>
    </h5>
  </div>
</template>

<script setup>
import { useTimetableStore } from "@/stores/timtable";
import { onMounted, ref } from "vue";
const currentclass = ref({});
const subject = ref("");
const venu = ref("");
const starttime = ref('');
const endtime = ref('');
const newsttime=ref('')
const endtimenew = ref('')


function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 or 12 to 12 in 12-hour format
    return `${hours12}:${minutes} ${period}`;
}


onMounted(() => {
  const timetable = useTimetableStore();
  currentclass.value = timetable.currentClass;
 
  subject.value = currentclass.value.course_name;
  venu.value = currentclass.value.venue;
  starttime.value = currentclass.value.start_time;
  endtime.value = currentclass.value.end_time;



  newsttime.value=convertTo12HourFormat(starttime.value);
  endtimenew.value= convertTo12HourFormat( endtime.value);
 
});
</script>

<style scoped>
.currentconn {
  /* border: 2px solid red; */
  height: 79%;
  padding: 0px 3px;
  border-radius: 10px;
  background-color: var(--skyblue);
}
.currentconn h5 {
  font-size: 1.1rem;
  /* border: 2px solid green; */
  width: 100%;
  height: 20%;
  display: flex;
  font-family: var(--majorfont);
  align-items: center;
  justify-content: space-between;
}
.currentconn p {
  width: 80%;
  /* border: 2px solid black; */
  font-size: 1rem;

  font-weight: 400;
  font-family: var(--majorfont);
}

.laterconn {
  /* border: 2px solid blue; */
  height: 100%;
}

#subject {
  min-height: 55%;
  /* max-height: 40%; */
}
#subject p {
  height: 100%;
  align-items: center;
  padding: 1px 2px;
  /* justify-content: space-between; */
  display: flex;
  font-size: 1rem;
  padding: 0px 4px;
}

@media only screen and (min-width: 576px) {
  #subject p {
    height: 100%;
    align-items: center;
    padding: 1px 2px;
    /* justify-content: space-between; */
    display: flex;
    font-size: 1.3rem;
    padding: 0px 4px;
  }
  .currentconn h5 {
    font-size: 1.4rem;
    /* border: 2px solid green; */
    width: 100%;
    height: 20%;
    display: flex;
    font-family: var(--majorfont);
    align-items: center;
    justify-content: space-between;
  }
  .currentconn p {
    width: 80%;
    /* border: 2px solid black; */
    font-size: 1.3rem;

    font-weight: 400;
    font-family: var(--majorfont);
  }
}
</style>
