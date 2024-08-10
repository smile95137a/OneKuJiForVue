<template>
  <div class="memberCenter__profileEditForm">
    <div class="memberCenter__profileEditForm-title">
      <p class="memberCenter__text">會員資料修改</p>
    </div>
    <div class="memberCenter__profileEditForm-main">
      <div class="memberCenter__profileEditForm-form">
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">暱稱</p>
          <input
            v-model="userInfo.nickname"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateField('nickname')"
          />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">收貨姓名</p>
          <input
            v-model="userInfo.fullName"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateField('fullName')"
          />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">收貨地址</p>
          <input
            v-model="userInfo.address"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateField('address')"
          />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">詳細地址</p>
          <input
            v-model="detailedAddress"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateDetailedAddress"
          />
        </div>
      </div>
      <div class="memberCenter__profileEditForm-form memberCenter__profileEditForm-form--other">
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text">LINE ID</p>
          <input
            v-model="lineId"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateLineId"
          />
        </div>
        <div class="memberCenter__profileEditForm-form-inputs m-t-20">
          <p class="memberCenter__text memberCenter__text--required">收貨手機</p>
          <input
            v-model="userInfo.phoneNumber"
            type="text"
            class="memberCenter__profileEditForm-form-input"
            @blur="updateField('phoneNumber')"
          />
        </div>
      </div>
    </div>
    <div class="memberCenter__profileEditForm-btns">
      <div class="memberCenter__profileEditForm-btn" @click="updateAllUserInfo">
        <span class="memberCenter__text">確認修改</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/userstore';
import { getUserInfo, publicApiRequest } from '@/services/Front/Frontapi';

const userStore = useUserStore();
const userInfo = ref({
  id: 0,
  username: '',
  nickname: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
});
const detailedAddress = ref('');
const lineId = ref('');

const fetchUserInfo = async () => {
  try {
    if (userStore.userId) {
      const response = await getUserInfo(userStore.userId);
      userInfo.value = response;
      
      // 分割地址
      const addressParts = userInfo.value.address.split(' ');
      if (addressParts.length > 1) {
        userInfo.value.address = addressParts[0];
        detailedAddress.value = addressParts.slice(1).join(' ');
      }
      
      // 設置 LINE ID
      lineId.value = response.lineId || '';
    }
  } catch (error) {
    console.error('獲取用戶信息時出錯:', error);
  }
};

onMounted(fetchUserInfo);

const updateField = async (field: keyof typeof userInfo.value) => {
  try {
    if (userStore.userId) {
      const updatedData = { [field]: userInfo.value[field] };
      await publicApiRequest(`/user/${userStore.userId}`, 'put', updatedData);
      console.log(`${field} 更新成功`);
    }
  } catch (error) {
    console.error(`更新 ${field} 時出錯:`, error);
  }
};

const updateDetailedAddress = async () => {
  try {
    if (userStore.userId) {
      const fullAddress = `${userInfo.value.address} ${detailedAddress.value}`.trim();
      await publicApiRequest(`/user/${userStore.userId}`, 'put', { address: fullAddress });
      console.log('詳細地址更新成功');
    }
  } catch (error) {
    console.error('更新詳細地址時出錯:', error);
  }
};

const updateLineId = async () => {
  try {
    if (userStore.userId) {
      await publicApiRequest(`/user/${userStore.userId}`, 'put', { lineId: lineId.value });
      console.log('LINE ID 更新成功');
    }
  } catch (error) {
    console.error('更新 LINE ID 時出錯:', error);
  }
};

const updateAllUserInfo = async () => {
  try {
    if (userStore.userId) {
      const updatedInfo = {
        ...userInfo.value,
        address: `${userInfo.value.address} ${detailedAddress.value}`.trim(),
        lineId: lineId.value,
      };
      await userStore.updateUserInfo(updatedInfo);
      console.log('所有用戶信息更新成功');
    }
  } catch (error) {
    console.error('更新所有用戶信息時出錯:', error);
  }
};

// 監聽 userId 的變化，當它變化時重新獲取用戶信息
watch(() => userStore.userId, (newUserId) => {
  if (newUserId) {
    fetchUserInfo();
  }
});
</script>

<style lang="scss" scoped>

  // 您的樣式代碼...

</style>