<template>
    <div class="card">
      <div class="bg"></div>
      <div class="blob"></div>
      
      <!-- Close Button -->
      <button class="close-btn" @click="hideCard">❌</button>
  
      <!-- Profile Image -->
      <img class="profile-img" src="../assets//koala.png" alt="Profile Image">
  
      <!-- Text Information -->
      <h2 class="name">{{ user_name }}</h2>
      <p class="program">{{ programname }}</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  const emit = defineEmits(['customEvent']);
 import { useUserStore } from '@/stores/userinfo';
  const isVisible = ref(true);
  const hideCard = () => {
    emit('customEvent', isVisible.value);

  };
const useuser=useUserStore();
const programname=ref("")
const user_name=ref("")
onMounted(async ()=>
{
 user_name.value=await useuser.getusername();
programname.value=await useuser.getuserprogram();
})

  </script>
  
  <style scoped>
 .card {
  position: relative;
  width: 70%;
  height: 50%;
  border-radius: 14px;
  z-index: 1111;
  overflow: hidden;
  font-family: var(--majorfont);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
  ;
}

.bg {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 96%;
  height: 97%;
  z-index: 2;
  background: rgba(255, 255, 255, .95);
  backdrop-filter: blur(24px);
  border-radius: 10px;
  overflow: hidden;
  outline: 2px solid white;
}

.blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 200px;
  border-radius: 50%;
  background-color: #ff0000;
  opacity: 1;
  filter: blur(12px);
  animation: blob-bounce 5s infinite ease;
}

@keyframes blob-bounce {
  0% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }

  25% {
    transform: translate(-100%, -100%) translate3d(100%, 0, 0);
  }

  50% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }

  75% {
    transform: translate(-100%, -100%) translate3d(0, 100%, 0);
  }

  100% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
}

  
  /* Profile Image */
  .profile-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    z-index: 3;
    margin-bottom: 10px;
    /* border: 2px solid #e7120b; */
  }
  
  /* Name & Program */
  .name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    z-index: 3;
    margin: 5px 0;
  }
  
  .program {
    font-size:1.2rem;
    color: #666;
    z-index: 3;
  }
  
  /* Close Button */
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    z-index: 4;
  }
  
  .close-btn:hover {
    color: red;
  }
  </style>
  