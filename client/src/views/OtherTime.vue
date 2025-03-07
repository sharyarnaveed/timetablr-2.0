<template>
   <main class="homepanelmainother">
other time  {{ programid }}
    </main>
</template>

<script setup>

const prop=defineProps({
    programid:String
})



</script>

<style  scoped>
.homepanelmainother{
    height: 82vh;
    border: 2px solid red;
}
</style>