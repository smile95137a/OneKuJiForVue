<template>
  <div class="product-data-management">
    <h2>商品資訊</h2>
    <div class="selection-bar">
      <button @click="fetchData('gacha')">扭蛋</button>
      <button @click="fetchData('prize')">一番賞</button>
      <button @click="fetchData('blindbox')">盲盒</button>
    </div>
    <div v-if="products.length > 0" class="product-list">
      <div v-for="product in products" :key="product.id" class="product-item">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p>Price: {{ product.price }}</p>
        <img :src="product.imageUrl" alt="Product Image" />
      </div>
    </div>
    <div v-else>
      <p>No products found.</p>
    </div>
  </div>
</template>

<script lang="ts">
import apiClient from '@/interceptors/jwtInterceptor'; // JWT
import { defineComponent, ref } from 'vue';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default defineComponent({
  name: 'ProductDataManagement',
  setup() {
    const products = ref<Product[]>([]);

    const fetchData = async (type: string) => {
      let endpoint = '';
      switch (type) {
        case 'gacha':
          endpoint = '/api/gacha/query';
          break;
        case 'prize':
          endpoint = '/api/PrizeDetail/query'; // 一番賞
          break;
        case 'blindbox':
          endpoint = '/api/blindBox/query'; // 盲盒
          break;
        default:
          break;
      }

      try {
        const response = await apiClient.get(endpoint);
        products.value = response.data.map((item: any) => ({
          id: item.gachaId || item.prizeID || item.blindboxId,
          name: item.gachaName || item.prizeName || item.blindboxName,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
        }));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    return {
      products,
      fetchData,
    };
  },
});
</script>

<style scoped>
.product-data-management {
  padding: 20px;
}

.product-data-management h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.selection-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.selection-bar button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

.selection-bar button:hover {
  background-color: #45a049;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: calc(33% - 20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.product-item p {
  margin: 5px 0;
}

.product-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
