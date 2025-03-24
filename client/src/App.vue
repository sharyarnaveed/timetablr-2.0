<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  

  <RouterView />
  
</template>

<style>

@media only screen and (max-width: 349px)
{
  .speeddailcon {
    box-sizing: border-box;
    /* border: 2px solid red; */
    height: 15vh;
    display: flex;
    padding: 10px 10px;
   justify-content: center;
   align-items: center;
  }
}


@media only screen and (min-width: 350px)
{
  .speeddailcon {
    box-sizing: border-box;
    /* border: 2px solid red; */
    height: 15vh;
   display: flex;
   padding: 10px 10px;
   justify-content: center;
   align-items: center;
  }
}
</style>

