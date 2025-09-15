<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1>🔐 Password Reset Requests</h1>
      <button @click="refreshRequests" class="refresh-btn">Refresh</button>
    </header>

    <!-- Requests Table -->
    <div class="card">
      <table v-if="requests.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Requested At</th>
            <th>New Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(req, index) in requests" :key="req.id">
            <td>{{ index + 1 }}</td>
            <td>{{ req.username }}</td>
            <td>{{ req.email }}</td>
            <td>{{ formatDate(req.created_at) }}</td>
            <td>
              <input
                v-model="req.newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </td>
            <td>
              <button @click="resetPassword(req)" class="reset-btn">
                Reset
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <p>No password reset requests right now 🚀</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const requests = ref([]);

const fetchRequests = async () => {
  try {
    const response = await axios.get("/api/admin/getresetpassword");

    // assuming backend always returns an array
    if (Array.isArray(response.data)) {
      requests.value = response.data.map((req) => ({
        ...req,
        newPassword: "", // add field for admin input
      }));
    } else if (response.data.data) {
      // in case backend wraps inside "data"
      requests.value = response.data.data.map((req) => ({
        ...req,
        newPassword: "",
      }));
    }
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
  }
};

onMounted(fetchRequests);

const resetPassword = async (req) => {
  if (!req.newPassword) {
    alert("⚠️ Enter a new password first!");
    return;
  }

  try {
    await axios.post(`/api/admin/reset-password`, {
      newpassword: req.newPassword,
      username:req.username
    });

    alert(`✅ Password for ${req.username} has been reset!`);
    requests.value = requests.value.filter((r) => r.id !== req.id);
  } catch (error) {
    console.error("❌ Reset failed:", error);
    alert("Something went wrong while resetting the password!");
  }
};

const refreshRequests = () => {
  fetchRequests();
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString(); // "9/13/2025, 11:34:44 PM"
};
</script>

<style scoped>
/* Layout */
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h1 {
  font-size: 26px;
  font-weight: bold;
  color: #333;
}

/* Buttons */
.refresh-btn,
.reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease-in-out;
}

.refresh-btn {
  background: #2563eb;
  color: white;
}

.refresh-btn:hover {
  background: #1e4bb8;
}

.reset-btn {
  background: #16a34a;
  color: white;
}

.reset-btn:hover {
  background: #128038;
}

/* Card */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f1f5f9;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  color: #444;
}

td {
  color: #555;
}

tr:hover {
  background: #f9fafb;
}

/* Input */
input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 180px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  color: #777;
  font-size: 16px;
  padding: 40px 0;
}
</style>
