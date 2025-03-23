<template>
  <nav class="navcontainer">
    <router-link class="navlinks" to="/home" title="Home">
      <i class="fas fa-home nav-icon"></i>
    </router-link>

    <router-link class="navlinks" to="/courses" title="Add Course">
      <i class="fas fa-plus nav-icon"></i>
    </router-link>

    <router-link class="navlinks" to="/settings" title="Settings">
      <i class="fas fa-cog nav-icon"></i>
    </router-link>

    <a class="navlinks" 
       href="https://forms.gle/bEmLBoy6xxHy2iq6A" 
       target="_blank"
       title="Feedback">
      <i class="fas fa-comment nav-icon"></i>
    </a>

    <button @click="handleLogout" class="navlinks logout-btn" title="Logout">
      <i class="fas fa-sign-out-alt nav-icon"></i>
    </button>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import api from "@/api";
import router from "@/router";

const handleLogout = async () => {
  try {
    const response = await api.post("/api/user/logout");
    if (response.data.success) {
      localStorage.clear();
      router.push("/signin");
    }
  } catch (error) {
    console.error("Logout error:", error);
    router.push("/signin");
  }
};
</script>

<style scoped>
.navcontainer {
  width: min(97%, 500px);
  height: 65px;
  border-radius: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #1b1b1d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 0 1rem;
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.navlinks {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  background: transparent;
  text-decoration: none;
}

.navlinks:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.router-link-active,
.router-link-exact-active {
  background-color: white;
  color: #1b1b1d;
  transform: translateY(-2px);
}

.router-link-active .nav-icon,
.router-link-exact-active .nav-icon {
  transform: scale(1.1);
}

.logout-btn {
  color: #ff4757;
}

.logout-btn:hover {
  background-color: rgba(255, 71, 87, 0.1);
}

/* Tablet and larger screens */
@media (min-width: 768px) {
  .navcontainer {
    width: 70px;
    height: calc(100vh - 2rem);
    flex-direction: column;
    left: 1rem;
    bottom: 50%;
    transform: translateY(50%);
    border-radius: 35px;
  }

  .navlinks {
    width: 45px;
    height: 45px;
  }

  .nav-icon {
    font-size: 1.4rem;
  }
}

/* Large desktop screens */
@media (min-width: 1200px) {
  .navcontainer {
    width: 80px;
  }

  .navlinks {
    width: 50px;
    height: 50px;
  }

  .nav-icon {
    font-size: 1.5rem;
  }
}

/* Small mobile devices */
@media (max-width: 350px) {
  .navcontainer {
    height: 55px;
    padding: 0 0.5rem;
  }

  .navlinks {
    width: 35px;
    height: 35px;
  }

  .nav-icon {
    font-size: 1.1rem;
  }
}
</style>
