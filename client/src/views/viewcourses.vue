<template>
  <main class="thecontainercheck">
    <Success v-if="deletedcheck" :messagevalue="deletemsg" />

    <table>
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
              <!-- <button  class="btn edit-btn">Edit</button> -->
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

    console.log(courses.value);
  } catch (error) {
    console.log("error in getting courses", error);
  }
};

const deletecourse = async (id) => {
  try {
    console.log(id);

    const responce = await api.post("/api/user/deletecourse", { repeatId: id });

    if (responce.data.success === true) {
      deletedcheck.value = true;
      deletemsg.value = responce.data.message;
      localStorage.removeItem("classes");
      await getreapeatcourses();
      setTimeout(() => {
        deletedcheck.value = true;
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
@media only screen and (max-width: 349px) {
}
.thecontainercheck {
  height: 75vh;
  overflow-y: auto;

  /* border: 2px solid red; */
  padding: 10px 5px;
}
table {
  /* border: 2px solid blue; */
  height: 100%;
  width: 100%;
  border-collapse: collapse;
  font-family: var(--majorfont);
  overflow-y: auto;

  background: white;
}

thead {
  background-color: #e3f2fd;
  border-bottom: 2px solid #cfd8dc;
  height: 60px;
}

th,
td {
  padding: 0.2rem 0.5rem;
  text-align: left;
  color: #455a64;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  font-family: var(--majorfont);

  letter-spacing: 0.5px;
  color: #1e88e5;
}

tbody tr {
  border-bottom: 1px solid #eceff1;
  transition: all 0.2s ease;
}

tbody tr:hover {
  background-color: rgba(227, 242, 253, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.1);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-family: var(--majorfont);

  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.edit-btn {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.edit-btn:hover {
  background-color: #c8e6c9;
}

.delete-btn {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.delete-btn:hover {
  background-color: #ffcdd2;
}

.header {
  padding: 1.8rem 2rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f4f8 100%);
  border-bottom: 1px solid #cfd8dc;
}

.header h1 {
  color: #1a237e;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  font-family: var(--majorfont);

  letter-spacing: -0.5px;
}
</style>
