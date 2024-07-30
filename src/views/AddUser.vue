<template>
  <div>
    <form @submit.prevent="createUser">
      <div>
        <label for="username">使用者名稱:</label>
        <input type="text" id="username" v-model="user.username" required />
      </div>
      <div>
        <label for="password">密碼:</label>
        <input type="password" id="password" v-model="user.password" required />
      </div>
      <div>
        <label for="nickname">暱稱:</label>
        <input type="text" id="nickname" v-model="user.nickname" required />
      </div>
      <div>
        <label for="email">電子郵件:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <div>
        <label for="phoneNumber">電話:</label>
        <input type="text" id="phoneNumber" v-model="user.phoneNumber" required />
      </div>
      <div>
        <label for="address">地址:</label>
        <input type="text" id="address" v-model="user.address" required />
      </div>
      <button type="submit">確認</button>
    </form>
  </div>
</template>

<script lang="ts">
import { addUser } from '@/services/api';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AddUser',
  setup() {
    const user = ref({
      username: '',
      password: '',
      nickname: '',
      email: '',
      address: ''
    });

    const createUser = async () => {
      try {
        console.log(user.value);
        
        const response = await addUser(user.value);
        alert('用户新增成功!');
      } catch (error) {
        console.error('新增用户失败:', error);
      }
    };

    return {
      user,
      createUser
    };
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
