<template>
  <main class="homepanelmain">
    <div class="theviews">
      <button
        v-for="(_, tab) in tabs"
        :key="tab"
        :class="['tab-button', { active: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <component :is="tabs[currentTab]" class="tab"></component>
  </main>
</template>

<script setup>
import listview from "@/components/listview.vue";
import tabularview from "@/components/tabularview.vue";
import { ref } from "vue";

const currentTab = ref("tabularview");

const tabs = {
  listview,
  tabularview,
};
</script>

<style scoped>
.theviews {
  margin-top: 10px;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: space-around;
}
button {
  height: 40px;
  font-size: 1rem;
  width: 100px;
}


.tab-button {
  padding: 10px 10px;
  border-radius: 10px;
font-family: var(--majorfont);
font-size: .9rem;
border: 2px solid #1B1B1D;
  cursor: pointer;
  background: #fff;

  margin-bottom: -1px;
  margin-right: 10px;
}
.tab-button:hover {
  background: #1B1B1D;
  color: whitesmoke;
}
.tab-button.active {
  background: #1B1B1D;
  color: whitesmoke;
}
</style>
