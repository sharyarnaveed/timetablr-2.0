<script setup>
import {
  defineAsyncComponent,
  Suspense,
  ref,
  onMounted,
  onUnmounted,
} from "vue";
// import Speeddail from "@/components/speeddail.vue";
import { useTimetableStore } from "@/stores/timtable";
import { useUserStore } from "@/stores/userinfo";
import api from "@/api";
import router from "@/router";
// import Morecurrent from "@/components/Morecurrent.vue";

const InfoCard = defineAsyncComponent(() =>
  import("@/components/infocard.vue")
);
// const OtherCard = defineAsyncComponent(() =>
//   import("@/components/otehrcardformhome.vue")
// );

const timetableStore = useTimetableStore();
const userStore = useUserStore();

const noclass = ref({});
const classInfo = ref({
  subject: "",
  venue: "",
  startTime: "",
  teacherName: "",
  endTime: "",
});
const username = ref("");
const timeInfo = ref({
  remaining: "",
  current: "",
  remainingHours: "",
  remainingMinutes: "",
});
const statusFlags = ref({
  remainingCheck: false,
  notCurrent: false,
  clash: false,
});
const themsg = ref("No Next Class");
const theday = ref({ day: "" });
const storeClassData = ref({});

const truncateName = (name, maxLength) => {
  if (name.length > maxLength) {
    return name.slice(0, maxLength - 3) + "...";
  }
  return name;
};

const calculateRemainingTime = (startTime) => {
  if (!startTime) return;

  const [hours, minutes] = startTime.split(":");
  const totalMinutes = hours * 60 + parseInt(minutes);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const remaining = totalMinutes - currentMinutes;

  timeInfo.value = {
    remaining,
    remainingHours: Math.floor(remaining / 60),
    remainingMinutes: remaining % 60,
  };
};

const fetchData = async (day) => {
  try {
    theday.value.day = day;
    const response = await api.post("/api/user/home", theday.value);

    const fetchedUsername =
      response.data.username[0]?.username || "Unknown User";
    username.value = fetchedUsername;
    const truncatedUsername = truncateName(fetchedUsername, 9);
    await userStore.storeusername(truncatedUsername);

    return response.data.timetable;
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.response?.status === 401) {
      localStorage.clear();
      router.push("/signin");
    }
    return [];
  }
};

const handleLogout = async () => {
  try {
    const response = await api.post("/api/user/logout");
    if (response.data.success) {
      localStorage.clear();
      router.push("/signin");
    }
  } catch (error) {
    console.error("Logout error:", error);
    router.push("/signin");
  }
};

onMounted(async () => {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const localClasses = await timetableStore.getlocal();

  if (
    !Array.isArray(localClasses) ||
    localClasses.length === 0 ||
    localClasses[0]?.day !== dayName
  ) {
    const fetchedData = await fetchData(dayName);
    await timetableStore.storelocal(fetchedData);
    await timetableStore.setClasses(fetchedData);
  } else {
    await timetableStore.setClasses(localClasses);
  }

  // Initialize component state
  username.value = await userStore.getusername();
  await timetableStore.findCurrentClass();
  await timetableStore.findnotcurrent();

  // Handle class clashes
  const clashes = await timetableStore.getclashes();
  statusFlags.value.clash = clashes.length > 1;
  if (statusFlags.value.clash) {
    storeClassData.value = clashes[1];
  }

  const notCurrentClasses = await timetableStore.getnotclocal();
  if (notCurrentClasses.length > 0) {
    statusFlags.value.notCurrent = true;
    noclass.value = notCurrentClasses[0];
    classInfo.value = {
      subject: noclass.value.course_name,
      venue: noclass.value.venue,
      startTime: noclass.value.start_time,
      endTime: noclass.value.end_time,
      teacherName: noclass.value.teacher_name,
    };

    // Set up timer for remaining time calculation
    if (noclass.value.start_time && !timetableStore.currentClass) {
      statusFlags.value.remainingCheck = true;
      calculateRemainingTime(noclass.value.start_time);

      const remainingTimer = setInterval(() => {
        calculateRemainingTime(noclass.value.start_time);
      }, 60000);

      onUnmounted(() => clearInterval(remainingTimer));
    }
  }

  const updateInterval = setInterval(async () => {
    await timetableStore.findCurrentClass();
    await timetableStore.findnotcurrent();
  }, 10000);

  onUnmounted(async() => {
    await clearInterval(updateInterval);
  });
});
</script>

<template>
  <main class="homepanelmain">
    <div class="hometop">
      <div class="settings">
       
        <p class="username"><span>Welcome, </span>{{ username }}</p>
      </div>

      <div class="profileimg">
        <img src="../assets/koala.png" alt="">
      </div>
      <!-- <button @click="handleLogout" class="logout">
        <img src="../assets/material-symbols_logout.svg" alt="Logout" />
        <p>Logout</p>
      </button> -->
    </div>

    <div class="headingandcurrent">

     
    </div>

    <div class="bottomtable">


      <div class="currentconoutisde">
        <h4>Current Class -></h4>

        <Suspense>
          <InfoCard v-if="timetableStore.currentClass" />
          <h2 v-else class="noclasstext">
            <span v-if="statusFlags.remainingCheck">
              Next Class In {{ timeInfo.remainingHours }}hr:{{
                timeInfo.remainingMinutes
              }}min
            </span>
            <span v-else>{{ themsg }}</span>
          </h2>
        </Suspense>
      </div>

     
    </div>
  </main>
</template>
<style scoped>
@media only screen and (max-width: 349px) {
  .noclasstext {
    font-family: var(--majorfont);
  }


  .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 50%;
    gap: 15px;
    font-family: var(--majorfont);
    font-size: .9rem;
    display: flex;
    color: #1B1B1D;
    justify-content: center;
    align-items: center;
  }
  .settings span{
color: #1B1B1D;
opacity: .7;
  }
  .profileimg{
    /* border: 2px solid red; */

    height: 40px;
    width: 40px;
   
  }
  .profileimg img {
    height: 90%;
    width: 100%;
  }
  .homepanelmain {
    /* border: 2px solid red; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 5px 10px;
    height: 80vh;
  }
  .hometop {
    /* border: 2px solid purple; */
    height: 12%;
    display: flex;
    justify-content: space-between;
    padding: 2px 5px;
    align-items: center;
  }
  .headingandcurrent {
    /* border: 2px solid blue; */
    height: 40%;
    padding: 2px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .currentconoutisde {
    /* border: 2px solid brown; */
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    padding: 2px 5px;
  }

  .currentconoutisde h4 {
    font-size: 1rem;
    font-family: var(--majorfont);
    /* border: 2px solid red; */
    padding: 0px 10px;
  }

  
  .bottomtable {
    /* border: 2px solid purple; */
    height: 50%;
    display: flex;
color: #1B1B1D;

    flex-direction: column;
  }


  .loadallrouterlink {
    font-size: 1.1rem;
    color: black;
    /* border: 2px solid green; */
    width: 32%;
    font-family: var(--majorfont);
  }


}

@media only screen and (min-width: 350px) {
  .noclasstext {
    font-family: var(--majorfont);
  }

  .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 45%;
    gap: 15px;
    font-family: var(--majorfont);
    font-size: 1rem;
    display: flex;
    color: #1B1B1D;
    justify-content: center;
    align-items: center;
  }
  .settings span{
color: #1B1B1D;
opacity: .7;
  }
  .profileimg{
    /* border: 2px solid red; */
    height: 50px;
    width: 50px;
  }
  .profileimg img {
    height: 100%;
    width: 100%;
  }
  .homepanelmain {
    /* border: 2px solid red; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 5px 10px;
    height: 80vh;
  }
  .hometop {
    /* border: 2px solid purple; */
    height: 12%;
    display: flex;
    justify-content: space-between;
    padding: 2px 5px;
    align-items: center;
  }
  .headingandcurrent {
    /* border: 2px solid blue; */
    height: 40%;
    padding: 2px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .currentconoutisde {
    /* border: 2px solid brown; */
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    padding: 2px 5px;
  }

  .currentconoutisde h4 {
    font-size: 1rem;
    font-family: var(--majorfont);
    /* border: 2px solid red; */
color: #1B1B1D;

    padding: 0px 10px;
  }

  
  .bottomtable {
    /* border: 2px solid purple; */
    height: 50%;
    display: flex;
    flex-direction: column;
  }


  .loadallrouterlink {
    font-size: 1.1rem;
    color: black;
    /* border: 2px solid green; */
    width: 32%;
    font-family: var(--majorfont);
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
  .profileimg{
    /* border: 2px solid red; */
  
    height: 50px;
    width: 50px;
  
  }
  .profileimg img {
    height: 100%;
    width: 100%;
  }
  .homepanelmain {
    /* border: 2px solid red; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 5px 10px;
    height: 100vh;
  }
  .hometop {
    /* border: 2px solid purple; */
    height: 8%;
    display: flex;
    justify-content: space-between;

    align-items: center;
  }
  .headingandcurrent {
    /* border: 2px solid blue; */
    height: 40%;
    padding: 2px 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  .headingandcurrent h1 {
    font-size: 1.9rem;
    font-family: var(--majorfont);
    font-weight: 400;
  }
  .currentconoutisde {
    /* border: 2px solid brown; */
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
  }

  .currentconoutisde h4 {
    font-size: 1.1rem;
    font-family: var(--majorfont);
  }

  .laterconn {
    /* border: 2px solid purple; */
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    height: 100%;
  }
  .laterconn h4 {
    font-size: 1.1rem;
    font-family: var(--majorfont);
  }
  .bottomtable {
    /* border: 2px solid purple; */
    height: 50%;
    display: flex;
    flex-direction: column;
  }
  .loadall {
    /* border: 2px solid red; */
    height: 10%;
  }

  .loadallrouterlink {
    font-size: 1.1rem;
    color: black;
    font-family: var(--majorfont);
    display: flex;
    width: 10%;
    /* border: 2px solid blue; */
    justify-content: end;
  }

  .speeddiler {
    /* border: 2px solid red; */
    height: 35%;
  }
}

@media only screen and (min-width: 764px) {

  .profileimg{
    /* border: 2px solid red; */
    height: 50px;
    width: 50px;
  }
  .profileimg img {
    height: 100%;
    width: 100%;
  }
  .currentconoutisde{
    /* border:2px solid green; */
    width: 90%;
    margin: 0 auto;
  }
}
</style>
