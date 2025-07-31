<template>
  <div class="sidebar-container">
    <button @click="toggleMobileMenu" class="mobile-toggle">
      <i :class="['fas', mobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>

    <aside class="sidebar" :class="{ 'mobile-open': mobileMenuOpen }">
      <div class="logo">
        <h1>Timetablr</h1>
      </div>
      
      <nav class="menu">
        <router-link to="/totheadmindashboard" class="menu-item" @click="closeMobileMenu">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/totheadmindashboard/seeusers" class="menu-item" @click="closeMobileMenu">
          <i class="fas fa-users"></i>
          <span>Users</span>
        </router-link>

        <div class="menu-group">
          <button @click="toggle" class="menu-item" :class="{ 'active': dropdown }">
            <i class="fas fa-plus-circle"></i>
            <span>Add Info</span>
            <i class="fas fa-chevron-down arrow" :class="{ 'rotated': dropdown }"></i>
          </button>
          
          <transition name="slide">
            <div v-show="dropdown" class="submenu">
              <router-link to="/totheadmindashboard/addcategory" class="submenu-item" @click="closeMobileMenu">
                <i class="fas fa-graduation-cap"></i>
                <span>Add Program</span>
              </router-link>
              
              <router-link to="/totheadmindashboard/uploadtimetable" class="submenu-item" @click="closeMobileMenu">
                <i class="fas fa-upload"></i>
                <span>Upload Timetable</span>
              </router-link>
              
              <router-link to="/totheadmindashboard/viewtimetable" class="submenu-item" @click="closeMobileMenu">
                <i class="fas fa-table"></i>
                <span>View Timetable</span>
              </router-link>
              
              <router-link to="/totheadmindashboard/viewuserrepeat" class="submenu-item" @click="closeMobileMenu">
                <i class="fas fa-redo"></i>
                <span>Repeat Courses</span>
              </router-link>
              <router-link to="/totheadmindashboard/notification" class="submenu-item" @click="closeMobileMenu">
                <i class="fas fa-bell"></i>
                <span>Notification</span>
              </router-link>
            </div>
          </transition>
        </div>

        <button @click="handleLogout" class="menu-item logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Log Out</span>
        </button>
      </nav>
    </aside>

    <div 
      v-if="mobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import router from "@/router";
import axios from "axios";
import { ref } from "vue";

const dropdown = ref(false);
const mobileMenuOpen = ref(false);

function toggle() {
  dropdown.value = !dropdown.value;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    dropdown.value = false;
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
  dropdown.value = false;
}

const generatetimetable=async()=>
{
try {
  
  const responce=await axios.post("/api/admin/generate");
  console.log(responce.data);
} catch (error) {
  console.log("cant generate timetable");
}
}

const handleLogout = async () => {
  try {
    const response = await axios.post("/api/admin/adminlogut");
    if (response.data.success) {
      closeMobileMenu();
      router.push("/adminthesignin");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.logo {
  padding: 1.5rem 1rem;
  text-align: center;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  letter-spacing: -0.5px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
}

.menu-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #4CAF50;
}

.menu-item.active {
  background: #e8f5e9;
  color: #4CAF50;
}

.arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.submenu {
  margin-top: 0.5rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: #f5f5f5;
  color: #4CAF50;
}

.logout {
  margin-top: auto;
  color: #f44336;
}

.logout:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* Slide animation for dropdown */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .menu-item span {
    font-size: 0.9rem;
  }
}

.sidebar-container {
  position: relative;
  height: 100%;
}

.mobile-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  padding: 0.5rem;
  font-size: 1.5rem;
  background: white;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 90;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }

  .mobile-overlay {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    height: 100vh;
    z-index: 100;
    transition: transform 0.3s ease;
    background: white;
  }

  .sidebar.mobile-open {
    transform: translateX(280px);
  }

  .menu-item {
    padding: 1rem;
  }

  .submenu {
    padding-left: 0.5rem;
  }

  .submenu-item {
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 240px;
    left: -240px;
  }

  .sidebar.mobile-open {
    transform: translateX(240px);
  }

  .logo h1 {
    font-size: 1.5rem;
  }

  .menu-item {
    font-size: 0.875rem;
  }

  .menu-item i {
    font-size: 1rem;
  }
}
</style>
