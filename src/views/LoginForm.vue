<template>
  <div class="login-overlay">
    <div class="login-form-container">
      <button class="close-button" @click="closeLoginForm">
        <i class="el-icon-close"></i>
      </button>
      <h2><i class="el-icon-user"></i> 登录</h2>
      <form @submit.prevent="login">
        <!-- 添加登录表单的内容 -->
        <div>
          <label for="username"><i class="el-icon-user"></i> 用户名:</label>
          <input type="text" id="username" v-model="username" />
        </div>
        <div>
          <label for="password"><i class="el-icon-lock"></i> 密 码:</label>
          <input type="password" id="password" v-model="password" />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="button-container">
          <el-button type="primary" @click="login">
            <i class="el-icon-arrow-right"></i> 登录
          </el-button>
          <el-button @click="register">
            <i class="el-icon-edit-outline"></i> 注册
          </el-button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script>

import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      notification: '', 
    };
  },
  methods: {
    async login() {
      this.errorMessage = '';

      if (!this.username || !this.password) {
        this.errorMessage = 'Username and password are required!';
        return;
      }

      // 更多验证，比如密码长度、复杂性等...
      // ...

      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          username: this.username,
          password: this.password,
        });

        // 如果服务器返回的响应表示登录成功：
        if (response.data.success) {
          console.log('Login successful:', this.username);
          this.notification = '登录成功！';
          // 重定向到首页，或直接登录...
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Login failed. Please try again.';
      }
    },
    async register() {
      this.errorMessage = '';

      if (!this.username || !this.password) {
        this.errorMessage = 'Username and password are required for registration!';
        return;
      }

      // 更多验证，比如密码长度、复杂性等...
      // ...

      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          username: this.username,
          password: this.password,
        });

        if (response.data.success) {
          console.log('Registration successful:', this.username);
          this.notification = '注册成功！'; 
          // 重定向到登录页面，或直接登录...
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    },
    closeLoginForm() {
      // 关闭登录表单
      this.$emit('close'); // 触发自定义的关闭事件
    },
  },
};
</script>
  
<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-container {
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
  position: relative;
}

.login-form-container h2 {
  margin-bottom: 20px;
}

.login-form-container form {
  margin-bottom: 20px;
}

.login-form-container label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.login-form-container input {
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.login-form-container button.el-button {
  border-radius: 5px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  font-size: 20px;
  background-color: hwb(0 27% 4%);
  color: #4a4aff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  z-index: 1;
}

.close-button:hover {
  background-color: #ccc;
  color: #fff;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>
