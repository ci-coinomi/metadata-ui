<template>
  <div class="form-container">
    <h2>Login</h2>
    <form class="form">
      <uiInputField :placeholder="'Login'" v-model="loginData" status="" />
      <uiInputField
        :placeholder="'Password'"
        type="password"
        v-model="passwordData"
      />
      <uiButton @click.prevent="formSubmitHandler" class="warning"
        >Submit</uiButton
      >
    </form>
  </div>
</template>

<script setup>
import { login } from "~/api/user";

const loginData = ref("");
const passwordData = ref("");

const formSubmitHandler = async () => {
  await login(loginData.value, passwordData.value);
  loginData.value = "";
  passwordData.value = "";
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.form-container {
  padding: 16px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 768px;
  margin-top: 200px;
  margin: 0 auto;
  border: 1px solid lightgray;
  border-radius: 5px;
}

.text-input {
  color: black;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid lightgray;
}
</style>
