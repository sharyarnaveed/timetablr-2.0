<template>
     <div  class="message">
    <h1>{{ messagevalue }}</h1>
  </div>
</template>

<script setup>
defineProps({messagevalue:String});
</script>
<style scoped>
@media only screen and (max-width: 349px) {
  .message {
    height: 45px;
    margin: 15px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .6rem;
    font-family: var(--majorfont);
    background-color: green;
    color: aliceblue;

  }


}
@media only screen and (min-width: 350px) {
  .message {
    height: 55px;
    margin: 15px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .7rem;
    font-family: var(--majorfont);
    background-color: green;
    color: aliceblue;

  }


}
@media only screen and (min-width: 748px){
.message {
    /* border: 2px solid purple; */
    height: 80px;
    margin: 15px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    font-family: var(--majorfont);
    background-color: green;
    color: aliceblue;
  }
}
</style>
