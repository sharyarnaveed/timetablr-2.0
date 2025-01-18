<script setup>
import { defineAsyncComponent,Suspense  } from "vue";
import Speeddail from "@/components/speeddail.vue";
const infocard = defineAsyncComponent(() =>
  import("@/components/infocard.vue")
);

const otherclass = defineAsyncComponent(() =>
  import("@/components/otehrcardformhome.vue")
);
import { useTimetableStore } from "@/stores/timtable";
import { useUserStore } from "@/stores/userinfo";
import api from "@/api";
import { onMounted, ref } from "vue";
import router from "@/router";
import Morecurrent from "@/components/Morecurrent.vue";
const usetimetable = useTimetableStore();
const useUser=useUserStore();
const noclass = ref({});
const subject = ref("");
const venu = ref("");
const starttime = ref("");
const teacehrname=ref("")
const endtime = ref("");
const username = ref("");
const theday = ref({
  day: "",
});
const NotCurrentstatus = ref(false);
const ClashStatus=ref(false);
const storeclasdata=ref({})
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
//user in local
    username.value = response.data.username[0]?.username || "Unknown User";
    const storeuser=await trancatenate(username.value, 8);
    useUser.storeusername(storeuser)
 

    return response.data.timetable;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response?.status === 401) {
    localStorage.clear();

      router.push("/signin");
    }
    return [];
  }
};

const logout = async () => {
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
  const GetLocalclass=await usetimetable.getlocal();

  
if(!Array.isArray(GetLocalclass) || GetLocalclass.length === 0 || GetLocalclass[0]?.day !== dayName)
{
  const fetcheddata = await getdata(dayName);
    await usetimetable.storelocal(fetcheddata);
    await usetimetable.setClasses(fetcheddata);
    
}else{
  await usetimetable.setClasses(GetLocalclass);
}


  
  // get user from local
  username.value=await useUser.getusername()
  await usetimetable.findCurrentClass();
  await usetimetable.findnotcurrent();
 

const getclashes=await usetimetable.getclashes();


if(getclashes.length>1)
{
ClashStatus.value=true;
storeclasdata.value=getclashes[1];


}else{
  ClashStatus.value=false;
}

  const notCurrentClasses = await usetimetable.getnotclocal();
  
  if (notCurrentClasses.length > 0) {
    NotCurrentstatus.value = true;
    noclass.value = notCurrentClasses[0];
    subject.value = noclass.value.course_name;
    venu.value = noclass.value.venue;
    starttime.value = noclass.value.start_time;
    endtime.value = noclass.value.end_time;
    teacehrname.value=noclass.value.teacher_name
  } else {
    NotCurrentstatus.value = false;
  }
});

setTimeout(async() => {
  await usetimetable.findCurrentClass();
  await usetimetable.findnotcurrent();
  console.log("in timeout");
  
}, 10000);



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
        <p>Logout</p>
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
      <div v-if="ClashStatus" class="laterconn">
      <Suspense>
        <template #default>
          <Morecurrent :clashdata="storeclasdata" />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </div>
      <div v-else class="laterconn">
        <h4>Next Class</h4>

        <otherclass
          v-if="NotCurrentstatus"
          :subject="subject"
          :venu="venu"
          :teachername="teacehrname"
          :starttime="starttime"
          :endtime="endtime"
        />
        <h2 class="noclasstext" v-else>No Next Class. See </h2>
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
    /* border: 2px solid red; */
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
    /* border: 2px solid blue; */
    width: 26%;
    border: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 5px;
    background-color: transparent;
    /* border: none; */
    height: 100%;
  }
  .logout p{
    font-family: var(--majorfont);
    font-size: 1rem;
  }
  .logout img {
    height: 77%;
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
    /* border: 2px solid blue; */
    width: 25%;
    border: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 5px;
    background-color: transparent;
    /* border: none; */
    height: 100%;
  }
  .logout p{
    font-family: var(--majorfont);
    font-size: 1rem;
  }
  .logout img {
    height: 73%;
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
    /* border: 2px solid blue; */
    width: 18%;
    border: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 5px;
    background-color: transparent;
    /* border: none; */
    cursor: pointer;

    height: 100%;
  }
  .logout p{
    font-family: var(--majorfont);
    font-size: 1rem;
  }
  .logout img {
    height: 73%;
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

@media only screen and (min-width: 764px) {
  .logout {
    /* border: 2px solid blue; */
    width: 13%;
    border: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 5px;
    background-color: transparent;
    /* border: none; */
    height: 100%;
    cursor: pointer;
  }
  .logout p{
    font-family: var(--majorfont);
    font-size: 1rem;
  }
  .logout img {
    height: 73%;
  }
}
</style>
