<template>
  <div class="form-container">
    <h2>Login</h2>
    <form class="form">
      <input v-model="loginData" type="text" placeholder="Login" class="text-input" />
      <input v-model="passwordData" type="text" placeholder="Password" class="text-input" />
      <button @click.prevent="formSubmitHandler">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { login } from '~/api/user'

const loginData = ref('')
const passwordData = ref('')

const formSubmitHandler = async () => {
  // console.log(login.value, pass.value)
  await (login(loginData.value, passwordData.value))
  loginData.value = ''
  passwordData.value = ''
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.form-container{
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

.text-input{
  color: black;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid lightgray
}
</style>