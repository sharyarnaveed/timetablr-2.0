<template>
  <main class="notification-container">
    <h2 class="notification-title">Notifications</h2>
    <div class="notification-content">
      <p v-if="notification.length === 0" class="no-notification">No notifications yet.</p>

      <ul v-else class="notification-list">
        <li v-for="(item, idx) in notification" :key="item.id || idx" class="notification-card">
          <div class="notification-info">
            <p class="name">{{ item.full_name }} <span class="username">(@{{ item.username }})</span></p>
            <p>Department: {{ item.department }}</p>
            <p>Program: {{ item.program }}</p>
            <p class="time">Time: {{ new Date(item.time).toLocaleString() }}</p>
          </div>

          <div class="reply-box">
            <input
              v-model="replies[idx]"
              :placeholder="`Reply to ${item.username}`"
              class="reply-input"
              type="text"
            />
            <button @click="sendReply(item.token, idx)" class="reply-button">Send</button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>


<script setup>
import api from '@/api';
import { onMounted, ref } from 'vue';

const notification = ref([]);
const replies = ref({}); // Object to hold reply text per user

onMounted(async () => {
  const response = await api.get("/api/admin/getsubscribenitification");
  notification.value = response.data.data;
  console.log(response.data);
});

const sendReply = async (token, idx) => {
  const message = replies.value[idx];
  if (!message || message.trim() === "") {
    alert("Reply cannot be empty.");
    return;
  }

  try {
    const response = await api.post("/api/admin/sendmsg", {
      token,
      msg: message,
    });
    console.log(response.data);

    if (response.data.success) {
      alert("Message sent!");
      replies.value[idx] = ""; // Clear the input after send
    }
  } catch (error) {
    console.log("Error in sending message", error);
  }
};
</script>


<style scoped>
.notification-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 700px;
  font-family: var(--majorfont);
}

.notification-title {
  font-size: 1.5rem;
  font-family: var(--majorfont);
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.notification-content {
  font-size: 1.1rem;
  color: #444;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.notification-list li {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  width: 100%;
  text-align: left;
}
</style>