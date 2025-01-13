<script setup>
import { defineAsyncComponent } from "vue";
import Speeddail from "@/components/speeddail.vue";
const infocard = defineAsyncComponent(() =>
  import("@/components/infocard.vue")
);

const otherclass = defineAsyncComponent(() =>
  import("@/components/otehrcardformhome.vue")
);
import { useTimetableStore } from "@/stores/timtable";
import api from "@/api";
import { onMounted, ref } from "vue";
import router from "@/router";
const usetimetable = useTimetableStore();
const noclass = ref({});
const subject = ref("");
const venu = ref("");
const starttime = ref("");
const endtime = ref("");
const username = ref();
const theday = ref({
  day: "",
});
const NotCurrentstatus = ref(false);

const trancatenate = (name, maxlength) => {
  if (name.length > maxlength) {
    return name.slice(0, maxlength - 3) + "...";
  }
  return name;
};

const getdata = async (day) => {
  try {
    theday.value.day = day;
    const response = await api.post("/api/user/home", theday.value);

    username.value = response.data.username[0]?.username || "Unknown User";
    username.value = await trancatenate(username.value, 8);

    return response.data.timetable;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response?.status === 401) {
      router.push("/signin");
    }
    return [];
  }
};

const logout = async () => {
  try {
    const response = await api.post("/api/user/logout");
    if (response.data.success) {
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

  const fetcheddata = await getdata(dayName);
  await usetimetable.setClasses(fetcheddata);
  await usetimetable.storelocal();
  await usetimetable.findCurrentClass();
  await usetimetable.findnotcurrent();

  const NotcurrentClass = await usetimetable.getnotclocal();

  if (usetimetable.notcurrentclass.length > 0) {
    noclass.value = usetimetable.notcurrentclass[0];
    subject.value = noclass.value.course_name;
    venu.value = noclass.value.venue;

    starttime.value = noclass.value.start_time;
    endtime.value = noclass.value.end_time;
    NotCurrentstatus.value = true;
  } else {
    NotCurrentstatus.value = true;

    noclass.value = NotcurrentClass[0];
    subject.value = noclass.value.course_name;
    venu.value = noclass.value.venue;

    starttime.value = noclass.value.start_time;
    endtime.value = noclass.value.end_time;
  }
});
</script>
<template>
  <main class="homepanelmain">
    <div class="hometop">
      <div class="settings">
        <img
          style="width: 30px; height: 30px"
          src="../assets/profile.png"
          alt=""
        />
        <p style="color: black; font-family: var(--majorfont)">
          {{ username }}
        </p>
      </div>

      <button @click="logout" class="logout">
        <img src="../assets/material-symbols_logout.svg" alt="" />
      </button>
    </div>

    <div class="headingandcurrent">
      <h1>TimeTablr</h1>

      <div class="currentconoutisde">
        <h4>Current</h4>

        <infocard v-if="usetimetable.currentClass" />
        <h2 class="noclasstext" v-else>No Class Right Now</h2>
      </div>
    </div>

    <div class="bottomtable">
      <div class="loadall">
        <router-link class="loadallrouterlink" to="/loadall"
          >Load All -></router-link
        >
      </div>

      <div class="laterconn">
        <h4>Next Class</h4>

        <otherclass
          v-if="NotCurrentstatus"
          :subject="subject"
          :venu="venu"
          :starttime="starttime"
          :endtime="endtime"
        />
        <h2 class="noclasstext" v-else>No Next Class</h2>
      </div>
      <div class="speeddailcon">
        <Speeddail />
      </div>
    </div>
  </main>
</template>

<style scoped>
@media only screen and (max-width: 349px) {
  .settings {
    border: 2px solid red;
    height: 100%;
    width: 45%;
    gap: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .settings img {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .noclasstext {
    font-family: var(--majorfont);
  }
  .logout {
    /* border: 2px solid red;/ */
    background-color: transparent;
    border: none;
    width: 12%;
    height: 100%;
  }
  .logout img {
    height: 69%;
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
    padding: 2px 2px;
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
    height: 60%;
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
    display: flex;
    justify-content: end;
  }

  .loadallrouterlink {
    font-size: 1.1rem;
    color: black;
    /* border: 2px solid green; */
    width: 32%;
    font-family: var(--majorfont);
  }

  .speeddailcon {
    /* border: 2px solid red; */
    height: 35%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}

@media only screen and (min-width: 350px) {
  .noclasstext {
    font-family: var(--majorfont);
  }
  .logout {
    /* border: 2px solid pink; */
    width: 10%;
    border: none;
    background-color: transparent;
    /* border: none; */
    height: 100%;
  }
  .logout img {
    height: 71%;
  }
  .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 40%;
    gap: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .settings img {
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
    display: flex;
    justify-content: end;
  }

  .loadallrouterlink {
    font-size: 1.1rem;
    color: black;
    /* border: 2px solid green; */
    width: 32%;
    font-family: var(--majorfont);
  }

  .speeddiler {
    /* border: 2px solid red; */
    height: 35%;
  }
  .speeddailcon {
    /* border: 2px solid red; */
    height: 35%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}

@media only screen and (min-width: 576px) {
  .logout {
    /* border: 2px solid pink; */
    background-color: transparent;
    width: 5%;
    cursor: pointer;
    height: 100%;
  }
  .logout img {
    height: 78%;
  }
  .settings {
    /* border: 2px solid red; */
    height: 100%;
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .settings img {
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
</style>
