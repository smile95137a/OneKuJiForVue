<script lang="ts" setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import MCardHeader from '@/components/common/MCardHeader.vue';
import dbox from '@/assets/image/dbox.png';
const storeList = [
  {
    id: 'store1',
    value: '1',
    num: '1500(無代幣)',
  },
  { id: 'store2', value: '2', num: '150' },
  { id: 'store3', value: '3', num: '300' },
  { id: 'store4', value: '4', num: '500' },
  { id: 'store5', value: '5', num: '1000' },
  { id: 'store6', value: '6', num: '1500' },
  { id: 'store7', value: '7', num: '3000' },
  { id: 'store8', value: '8', num: '5000' },
  { id: 'store9', value: '9', num: '8000' },
  {
    id: 'store10',
    value: '10',
    num: '10000',
  },
  {
    id: 'store11',
    value: '11',
    num: '15000',
  },
  {
    id: 'store12',
    value: '12',
    num: '20000',
  },
  {
    id: 'store13',
    value: '13',
    num: '50000',
  },
  {
    id: 'store14',
    value: '14',
    num: '80000',
  },
  {
    id: 'store15',
    value: '15',
    num: '100000',
  },
];

const selectedStore = ref('');

const selectStore = (storeValue: string) => {
  selectedStore.value = storeValue;
};

const logSelectedStore = () => {
  if (selectedStore.value) {
    console.log('Selected Store Value:', selectedStore.value);
  } else {
    console.log('No store selected');
  }
};
</script>

<template>
  <div class="deposit">
    <Card customClass="mcard--home">
      <template #header>
        <MCardHeader :title="'儲值'" />
      </template>
      <div class="deposit__list">
        <div class="deposit__list-items">
          <div
            v-for="store in storeList"
            :key="store.id"
            class="deposit__list-item"
          >
            <label
              :for="store.id"
              class="deposit__item"
              :class="{ active: selectedStore === store.value }"
              @click="selectStore(store.value)"
            >
              <input
                class="deposit__item-radio"
                type="radio"
                :id="store.id"
                name="store"
                :value="store.value"
              />
              <i class="fas fa-check-circle deposit__item-icon"></i>
              <div class="deposit__item-img">
                <img :src="dbox" alt="" />
              </div>
              <div class="deposit__item-num">{{ store.num }}</div>
            </label>
          </div>
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="deposit__btns">
        <button class="deposit__btn" @click="logSelectedStore">確認</button>
      </div>
    </Card>
  </div>
</template>
