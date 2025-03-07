<template>
  <div class="card">
    <h1>{{ program_name }}</h1>
  </div>
</template>

<script setup>
defineProps({
  program_name: String,
});
</script>

<style scoped>
/* From Uiverse.io by vaibhavchandranv */
.card {
  font-family: var(--majorfont);
  width: 90%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  translate: -6px -6px;
  border-radius: 10px;
  border: 3px solid #000000;
  box-shadow: 12px 12px 0 #000000;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card h1 {
  display: flex;
  flex-wrap: wrap;
  font-size: 1.5rem;
  color: #000000;
}

.card:hover {
  translate: -6px;
}
</style>
