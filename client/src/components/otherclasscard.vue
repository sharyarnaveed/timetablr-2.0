<template>
    <div back class="currentconnlater">
      <h5 id="subject">
        Subject:
        <p>{{ prop.notclass.course_name }}</p>
      </h5>
      <h5>
        Venu:
        <p>{{ prop.notclass.venue }}</p>
      </h5>
      <h5>
        Time:
        <p>{{ newsttime }} - {{ endtimenew }}</p>
      </h5>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { onMounted } from 'vue';
const prop=defineProps({
  notclass:Object
})
const newsttime=ref('')
const endtimenew = ref('')


const starttime = ref("");
const endtime = ref("");
function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 or 12 to 12 in 12-hour format
    return `${hours12}:${minutes} ${period}`;
}



onMounted(async()=>
{
  starttime.value = prop.notclass.start_time;
  endtime.value = prop.notclass.end_time;

 newsttime.value=convertTo12HourFormat(starttime.value);
 endtimenew.value= convertTo12HourFormat(endtime.value);

})


</script>
  
  <style scoped>
  
.currentconnlater {
  /* border: 2px solid red; */
  height: 115px;
  padding: 0px 3px;
  border-radius: 10px;
  background-color:#1B1B1D;
}

.currentconnlater h5 {
  font-size: 1.1rem;
  /* border: 2px solid green; */
  width: 100%;
  height: 20%;
  color: whitesmoke;
  display: flex;
justify-content: space-between;
align-items: center;
  font-family: var(--majorfont);
 
}
.currentconnlater p {
  width: 80%;
  /* border: 2px solid black; */
  font-size: 1rem;

  font-weight: 400;
  font-family: var(--majorfont);
}
.laterconn{
  /* border: 2px solid blue; */
  height: 100%;
}


#subject {
 height: 55%;
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

@media only screen and (min-width: 425px)
{

  .currentconnlater h5 {
  font-size: 1.2rem;
  /* border: 2px solid green; */
  width: 100%;
  height: 20%;
  display: flex;
  margin: 3px 0px;
justify-content: space-between;
align-items: center;
  font-family: var(--majorfont);
 
}

#subject
{
  height: 45%;
}
#subject p {
  height: 100%;
  align-items: center;
  padding: 1px 2px;
  /* justify-content: space-between; */
  display: flex;
  font-size: 1.1rem;
  padding: 0px 4px;
}

.currentconnlater p {
  width: 80%;
  /* border: 2px solid black; */
  font-size: 1.1rem;

  font-weight: 400;
  font-family: var(--majorfont);
}
}

@media only screen and (min-width: 576px)
{

  .currentconnlater h5 {
  font-size: 1.3rem;
  /* border: 2px solid green; */
  width: 100%;
  height: 20%;
  display: flex;
  margin: 3px 0px;
justify-content: space-between;
align-items: center;
  font-family: var(--majorfont);
 
}

#subject
{
  height: 45%;
}
#subject p {
  height: 100%;
  align-items: center;
  padding: 1px 2px;
  /* justify-content: space-between; */
  display: flex;
  font-size: 1.2rem;
  padding: 0px 4px;
}

.currentconnlater p {
  width: 80%;
  /* border: 2px solid black; */
  font-size: 1.2rem;

  font-weight: 400;
  font-family: var(--majorfont);
}
}
</style>
  
