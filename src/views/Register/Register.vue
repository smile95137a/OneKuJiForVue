<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import { registerUser } from '@/services/frontend/userService';
import { useLoadingStore } from '@/stores';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
const loadingStore = useLoadingStore();
const schema = yup.object({
  userName: yup.string().required('使用者是必填項'),
  email: yup.string().required('Email 是必填項').email('Email 格式不正確'),
  phoneNumber: yup.string().required('手機是必填項'),
  password: yup.string().required('密碼是必填項').min(6, '密碼最少6個字符'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '密碼不匹配')
    .required('確認密碼是必填項'),
  nickName: yup.string().required('暱稱是必填項'),
  addressName: yup.string(),
  city: yup.string(),
  area: yup.string(),
  address: yup.string(),
  lineId: yup.string(),
});

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    nickName: '',
    addressName: '',
    city: '',
    area: '',
    address: '',
    lineId: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    loadingStore.startLoading();
    const { success, message, data } = await registerUser(values);
    loadingStore.stopLoading();
    if (success) {
      alert('註冊成功');
    } else {
      console.log(message);
    }
  } catch (error) {
    loadingStore.stopLoading();
    console.log(error);
  }
});
const [username, usernameProps] = defineField('username');
const [email, emailProps] = defineField('email');
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber');
const [password, passwordProps] = defineField('password');
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');
const [nickName, nickNameProps] = defineField('nickName');
const [addressName, addressNameProps] = defineField('addressName');
const [city, cityProps] = defineField('city');
const [area, areaProps] = defineField('area');
const [address, addressProps] = defineField('address');
const [lineId, lineIdProps] = defineField('lineId');
</script>

<template>
  <Card customClass="mcard--register">
    <template #header>
      <MCardHeader title="註冊會員" />
    </template>
    <form @submit="onSubmit">
      <div class="register__container">
        <div class="register__main">
          <div class="register__form">
            <div class="register__form-inputs">
              <p class="register__text register__text--required">使用者名稱</p>
              <input
                class="register__form-input"
                v-model="username"
                v-bind="usernameProps"
                :class="{ 'register__form-input--error': errors.username }"
              />
              <p class="register__text register__text--error">
                {{ errors.username }}
              </p>
            </div>
            <div class="register__form-inputs m-t-20">
              <p class="register__text register__text--required">密碼</p>
              <input
                class="register__form-input"
                type="password"
                v-model="password"
                v-bind="passwordProps"
                :class="{ 'register__form-input--error': errors.password }"
              />
              <p class="register__text register__text--error">
                {{ errors.password }}
              </p>
            </div>
            <div class="register__form-inputs m-t-20">
              <p class="register__text register__text--required">確認密碼</p>
              <input
                class="register__form-input"
                type="password"
                v-model="confirmPassword"
                v-bind="confirmPasswordProps"
                :class="{
                  'register__form-input--error': errors.confirmPassword,
                }"
              />
              <p class="register__text register__text--error">
                {{ errors.confirmPassword }}
              </p>
            </div>
            <div class="register__form-inputs">
              <p class="register__text register__text--required">email</p>
              <input
                class="register__form-input"
                v-model="email"
                v-bind="emailProps"
                :class="{ 'register__form-input--error': errors.email }"
              />
              <p class="register__text register__text--error">
                {{ errors.email }}
              </p>
            </div>
            <div class="register__form-inputs m-t-20">
              <p class="register__text register__text--required">手機</p>
              <input
                class="register__form-input"
                v-model="phoneNumber"
                v-bind="phoneNumberProps"
                :class="{ 'register__form-input--error': errors.phoneNumber }"
              />
              <p class="register__text register__text--error">
                {{ errors.phoneNumber }}
              </p>
            </div>
          </div>
          <div class="register__divider">
            <div class="register__divider-line"></div>
          </div>
          <div class="register__form">
            <div class="register__form-inputs">
              <p class="register__text register__text--required">暱稱</p>
              <input
                class="register__form-input"
                v-model="nickName"
                v-bind="nickNameProps"
                :class="{ 'register__form-input--error': errors.nickName }"
              />
              <p class="register__text register__text--error">
                {{ errors.nickName }}
              </p>
            </div>
            <div class="register__form-inputs m-t-20">
              <p class="register__text">LINE ID</p>
              <input
                class="register__form-input"
                v-model="lineId"
                v-bind="lineIdProps"
                :class="{ 'register__form-input--error': errors.lineId }"
              />
              <p class="register__text register__text--error">
                {{ errors.lineId }}
              </p>
            </div>
            <div class="register__form-inputs m-t-20">
              <p class="register__text">收貨姓名</p>
              <input
                class="register__form-input"
                v-model="addressName"
                v-bind="addressNameProps"
                :class="{ 'register__form-input--error': errors.addressName }"
              />
              <p class="register__text register__text--error">
                {{ errors.addressName }}
              </p>
            </div>
            <div class="register__form-inputs--addr">
              <div class="register__form-inputs w-50 m-t-20">
                <p class="register__text">收貨地址</p>
                <input
                  class="register__form-input"
                  v-model="city"
                  v-bind="cityProps"
                  :class="{ 'register__form-input--error': errors.city }"
                />
                <p class="register__text register__text--error">
                  {{ errors.city }}
                </p>
              </div>
              <div class="register__form-inputs w-50 m-t-20">
                <input
                  class="register__form-input"
                  v-model="area"
                  v-bind="areaProps"
                  :class="{ 'register__form-input--error': errors.area }"
                />
                <p class="register__text register__text--error">
                  {{ errors.area }}
                </p>
              </div>
            </div>

            <div class="register__form-inputs m-t-20">
              <p class="register__text">詳細地址</p>
              <input
                class="register__form-input"
                v-model="address"
                v-bind="addressProps"
                :class="{ 'register__form-input--error': errors.address }"
              />
              <p class="register__text register__text--error">
                {{ errors.address }}
              </p>
            </div>
          </div>
        </div>
        <div class="register__other">
          <p class="register__text">
            我同意 一番賞 提供的 <u>網站服務條款</u> 與 <u>隱私權政策</u> 。
          </p>
          <div class="register__other-btn">
            <button type="submit" class="register__btn">註冊成為會員</button>
          </div>
        </div>
      </div>
    </form>
  </Card>
</template>
