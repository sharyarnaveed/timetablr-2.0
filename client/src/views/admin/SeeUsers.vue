<template>
  <div class="alreadycategory">
      <table>
        <tr>
          <th>User Id</th>
          <th>user Name</th>
          <th>Full Name</th>

          <th>Program</th>

        </tr>
        <tr v-for="(user, index) in users" :key="user.user_id">
          <td>{{ user.user_id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.full_name }}</td>
          <td>
            {{ user.program }}
          </td>

        </tr>
      </table>
    </div>
</template>

<script setup>
import api from '@/api';
import axios from 'axios';
import { onMounted, ref } from 'vue';
const users=ref([])

const getusers=async()=>
{
    try {
        

const responce= await axios.post("/api/admin/getuserinfo")
users.value=responce.data.user


    } catch (error) {
        console.log(error,"error in geting users");
    }
}


onMounted(async() => {
  await  getusers();
})





</script>

<style scoped>

.alreadycategory {
  /* border: 2px solid purple; */
  height: 70%;
  overflow-y: auto;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  overflow-y: auto;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>