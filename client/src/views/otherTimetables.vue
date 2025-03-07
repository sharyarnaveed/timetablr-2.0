<template>
  <main class="homepanelmainother">
    <router-link
      class="linkcheck"
      :to="`/other/`+program.program_id"
      v-for="program in programs"
      :key="program.program_id"
      ><othertimetablecard :program_name="program.program_name"
    /></router-link>
  </main>
</template>

<script setup>
import othertimetablecard from "@/components/othertimetablecard.vue";
import { onMounted, ref } from "vue";
import axios from "axios";

const programs = ref([]);

const getprograms = async () => {
  try {
    const responce = await axios.post("/api/user/getprogramfromdb");
    console.log(responce.data);
    programs.value = responce.data;
  } catch (error) {
    console.log("error in getting programs");
  }
};

onMounted(() => {
  getprograms();
});
</script>

<style scoped>
.homepanelmainother {
  display: grid;
  grid-template-columns: repeat(2, auto);
  padding: 30px 10px;
  overflow-y: auto;
  height: 65vh;
  gap: 30px;
}
.linkcheck {
  text-decoration: none;
}
</style>
