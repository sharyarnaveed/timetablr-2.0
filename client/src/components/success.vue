<template>
  <!-- <div  class="message">
 <h1>{{ messagevalue }}</h1>
</div> -->

<div class="alert-container">
<div class="alert alert-success">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
   <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
 </svg>
 <p>Success - {{ messagevalue }}</p>
</div>




</div>

</template>

<script setup>
defineProps({messagevalue:String});
</script>
<style>
.alert-container {
 display: flex;
 flex-direction: column;
 gap: 10px;
 padding: 16px;
}

.alert {
 display: flex;
 align-items: center;
 padding: 15px;
 border-left: 4px solid;
 border-radius: 6px;
 transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.alert:hover {
 transform: scale(1.05);
}

.alert svg {
 width: 20px;
 height: 20px;
 margin-right: 8px;
}

.alert p {
 font-size: 1rem;
 font-weight: 600;
 font-family: var(--majorfont);
}

.alert-success {
 background: #d1fae5;
 border-color: #10b981;
 color: #065f46;
}

.alert-success:hover {
 background: #a7f3d0;
}


.alert-error {
 background: #fee2e2;
 border-color: #ef4444;
 color: #7f1d1d;
 font-family: var(--majorfont);
}

.alert-error:hover {
 background: #fecaca;
}
</style>
