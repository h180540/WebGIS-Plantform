<template>
  <div class="header-container">
    <div class="header-buttons">
      <div class="header-button" @click="showLoginForm = true">
        <i class="fas fa-user"></i>
      </div>
    </div>
    <LoginForm v-if="showLoginForm" @close="closeLoginForm"></LoginForm>
  </div>
</template>

<script>
import LoginForm from '../views/LoginForm.vue';


export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      showLoginForm: false,
    };
  },
  methods: {
    openLoginForm() {
      this.showLoginForm = true;
    },
    closeLoginForm() {
      this.showLoginForm = false;
    },
  },
};
</script>

<style scoped>
.header-container {
  position: fixed;
  top: 30px;
  right: 50px;
  z-index: 999;
}

.header-buttons {
  display: flex;
}

.header-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 6px 10px;
  font-size: 20px;
  color: #333;
  transition: color 0.3s;
}

.header-button:hover {
  color: #555;
}
</style>
