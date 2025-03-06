<template>
  <main class="homepanelmain">
    <div class="theviews">
      <button
        v-for="(tab, key) in tabs"
        :key="key"
        :class="['tab-button', { active: currentTab === key }]"
        @click="currentTab = key"
      >
        <img :src="tab.img" :alt="key" class="tab-icon" />
      </button>
    </div>
    <component :is="tabs[currentTab].comp" class="tab"></component>
  </main>
</template>

<script setup>
import ListView from "@/components/listview.vue";
import TabularView from "@/components/tabularview.vue";
import { ref } from "vue";
import list from "@/assets/list.png"
import grid from "@/assets/menu.png"
const currentTab = ref("Tabular View");

const tabs = {
  "List View": {
    comp: ListView,
    img: list, // Replace with the correct image path
  },
  "Tabular View": {
    comp: TabularView,
    img: grid, // Replace with the correct image path
  },
};
</script>

<style scoped>
.theviews {
  margin-top: 10px;
  margin-bottom: 10px;

gap: 1.2rem;
  height: 50px;
  align-items: center;
  display: flex;
  justify-content: end;
}

.tab-button {
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #1B1B1D;
  cursor: pointer;
  background: #fff;
  margin-bottom: -1px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.tab-button:hover,
.tab-button.active {
  background: #1B1B1D;
}

.tab-button:hover img,
.tab-button.active img {
  filter: invert(1); /* Changes the image color for better visibility */
}

.tab-icon {
  width: 20px; /* Adjust size */
  height: 20px;
  object-fit: contain;
}
</style>
