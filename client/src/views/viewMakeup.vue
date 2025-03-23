<template>
  <main class="thecontainercheck">
    <Success v-if="deletedcheck" :messagevalue="deletemsg" />

    <table class="styled-table">
      <thead>
        <tr>
          <th>Course Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id" class="course-row">
          <td colspan="2">
            <details class="course-details">
              <summary class="course-summary">
                <span class="course-name">{{ course.coursename }}</span>
                <span class="summary-icon"></span>
              </summary>
              <div class="details-content">
                <div class="course-info-grid">
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-clock"></i> Start Time</span
                    >
                    <span class="info-value">{{ course.starttime }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-hourglass-end"></i> End Time</span
                    >
                    <span class="info-value">{{ course.endtime }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-calendar"></i> Date</span
                    >
                    <span class="info-value">{{ course.date }}</span>
                  </div>
                </div>
                <div class="actions">
                  <button
                    @click="deletecourse(course.id)"
                    class="btn delete-btn"
                  >
                    <i class="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            </details>
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
    const responce = await api.get("/api/user/viewmakeupclass");
    courses.value = responce.data;
  } catch (error) {
    console.log("error in getting courses", error);
  }
};

const deletecourse = async (id) => {
  try {
    const responce = await api.post(`/api/user/deletemakeclass`, {
      makeupid: id,
    });
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
    deletemsg.value = "Error Occured";
  }
};

onMounted(() => {
  getreapeatcourses();
});
</script>

<style scoped>
.thecontainercheck {
  height: 65vh;
  overflow-y: auto;
  width: 100%;
  /* border: 2px solid #1b1b1d; */
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
  padding: 5px 15px;
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  background-color: #dc3545;
  color: white;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.course-details {
  width: 100%;
  padding: 0px 0;
}

.course-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.course-summary:hover {
  background-color: #f5f5f5;
}

.summary-icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

details[open] .summary-icon {
  transform: rotate(180deg);
}

.course-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.details-content {
  padding: 24px;
  margin-top: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.course-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-value {
  font-size: 1.1rem;
  color: #212529;
  font-weight: 500;
}

.details-content {
  padding: 24px;
  margin-top: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.course-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-value {
  font-size: 1.1rem;
  color: #212529;
  font-weight: 500;
}

.delete-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  background-color: #dc3545;
  color: white;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.course-summary {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eaeaea;
}

.course-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}
</style>
