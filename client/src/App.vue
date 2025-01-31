<script setup>
import { RouterLink, RouterView } from 'vue-router'
import speeddail from './components/speeddail.vue';
</script>

<template>
  

  <RouterView />
  <div class="speeddailcon">
        <speeddail />
      </div>
</template>

<style scoped>

@media only screen and (max-width: 349px)
{
  .speeddailcon {
    border: 2px solid red;
    height: 35%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}


@media only screen and (min-width: 350px)
{
  .speeddailcon {
    border: 2px solid red;
    height: 35%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>

