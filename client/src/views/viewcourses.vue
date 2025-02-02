<template>
  <main class="thecontainercheck">
    <Success v-if="deletedcheck" :messagevalue="deletemsg" />

    <table class="styled-table">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.repeat_id">
          <td>{{ course.course_name }}</td>
          <td>
            <div class="actions">
              <button
                @click="deletecourse(course.repeat_id)"
                class="btn delete-btn"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup>
import api from "@/api";
import Success from "@/components/success.vue";
import { onMounted, ref } from "vue";

const courses = ref([]);
const deletedcheck = ref(false);
const deletemsg = ref("");

const getreapeatcourses = async () => {
  try {
    const responce = await api.post("/api/user/viewcourses");
    courses.value = responce.data.repeatcourses;
  } catch (error) {
    console.log("error in getting courses", error);
  }
};

const deletecourse = async (id) => {
  try {
    const responce = await api.post("/api/user/deletecourse", { repeatId: id });
    if (responce.data.success === true) {
      deletedcheck.value = true;
      deletemsg.value = responce.data.message;
      localStorage.removeItem("classes");
      await getreapeatcourses();
      setTimeout(() => {
        deletedcheck.value = false;
      }, 3000);
    }
  } catch (error) {
    console.log("error in deleting", error);
    deletedcheck.value = true;
    deletemsg.value = responce.data.message;
  }
};

onMounted(async () => {
  await getreapeatcourses();
});
</script>

<style scoped>
.thecontainercheck {
  height: 65vh;
  overflow-y: auto;
  width: 95%;
  border: 2px solid #1b1b1d;
  padding: 20px;
  background: whitesmoke;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #1b1b1d;
  color: whitesmoke;
  text-transform: uppercase;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  font-family: var(--majorfont);
  font-size: 1rem;
}

tbody tr {
  border-bottom: 1px solid #ddd;
  transition: all 0.3s ease;
}

tbody tr:hover {
  background-color: #f5f5f5;
  transform: scale(1.01);
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.delete-btn {
  background-color: #c62828;
  color: whitesmoke;
  border: 1px solid #b71c1c;
}

.delete-btn:hover {
  background-color: #b71c1c;
  transform: scale(1.05);
}
</style>
