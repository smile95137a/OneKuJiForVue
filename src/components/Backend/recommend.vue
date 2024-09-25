<template>
  <div class="recommend-container">
    <h1 class="title">產品推薦管理</h1>
    <div v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation-section">
      <h2>{{ recommendation.recommendationName }}</h2>
      <div class="product-list">
        <div v-for="productId in recommendation.products" :key="productId" class="product-item">
          {{ getProductName(productId) }}
          <button @click="removeProduct(recommendation.id, productId)" class="remove-button">移除</button>
        </div>
      </div>
      <div class="add-product">
        <select v-model="selectedProducts[recommendation.id]" class="select-field">
          <option value="">選擇產品</option>
          <option v-for="product in availableProducts(recommendation)" :key="product.storeProductId" :value="product.storeProductId">
            {{ product.productName }}
          </option>
        </select>
        <button @click="addProduct(recommendation.id)" class="add-button">添加產品</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { recommendService } from '@/services/backend/recommendservice';
import { storeServices } from '@/services/backend/storeservices';
import { StoreProductRecommendation } from '@/interfaces/recommend';
import { StoreProductRes } from '@/interfaces/store';

export default defineComponent({
  name: 'Recommend',
  setup() {
    const recommendations = ref<StoreProductRecommendation[]>([]);
    const allProducts = ref<StoreProductRes[]>([]);
    const selectedProducts = ref<{[key: number]: number}>({});

    const fetchRecommendations = async () => {
      try {
        const response = await recommendService.getAllRecommendations();
        if (response.success) {
          recommendations.value = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await storeServices.getAllStoreProduct();
        if (response.success) {
          allProducts.value = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    const getProductName = (productId: number): string => {
      const product = allProducts.value.find(p => p.storeProductId === productId);
      return product ? product.productName : 'Unknown Product';
    };

    const availableProducts = (recommendation: StoreProductRecommendation) => {
      return allProducts.value.filter(p => !recommendation.products.includes(p.storeProductId));
    };

    const addProduct = async (recommendationId: number) => {
      const productId = selectedProducts.value[recommendationId];
      if (productId) {
        const recommendation = recommendations.value.find(r => r.id === recommendationId);
        if (recommendation) {
          const updatedProducts = [...recommendation.products, productId];
          try {
            await recommendService.updateRecommendation(recommendationId, { products: updatedProducts });
            await fetchRecommendations();
            selectedProducts.value[recommendationId] = 0;
          } catch (error) {
            console.error('Failed to add product to recommendation:', error);
          }
        }
      }
    };

    const removeProduct = async (recommendationId: number, productId: number) => {
      const recommendation = recommendations.value.find(r => r.id === recommendationId);
      if (recommendation) {
        const updatedProducts = recommendation.products.filter(id => id !== productId);
        try {
          await recommendService.updateRecommendation(recommendationId, { products: updatedProducts });
          await fetchRecommendations();
        } catch (error) {
          console.error('Failed to remove product from recommendation:', error);
        }
      }
    };

    onMounted(() => {
      fetchRecommendations();
      fetchProducts();
    });

    return {
      recommendations,
      allProducts,
      selectedProducts,
      getProductName,
      availableProducts,
      addProduct,
      removeProduct
    };
  }
});
</script>

<style scoped>
.recommend-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.recommendation-section {
  margin-bottom: 30px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.product-item {
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-product {
  display: flex;
  gap: 10px;
}

.select-field {
  flex-grow: 1;
  padding: 5px;
}

.add-button, .remove-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #4CAF50;
  color: white;
}

.remove-button {
  background-color: #f44336;
  color: white;
}
</style>