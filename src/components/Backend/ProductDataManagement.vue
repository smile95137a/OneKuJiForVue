<template>
  <div class="product-data-management">
    <h2>商品資訊</h2>
    <div class="selection-bar">
      <button @click="fetchData(2)">扭蛋</button>
      <button @click="fetchData(1)">一番賞</button>
      <button @click="fetchData(3)">盲盒</button>
    </div>
    <div v-if="products.length > 0" class="product-table">
      <table>
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>上架日期</th>
            <th>狀態</th>
            <th>圖片</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.productId">
            <td>{{ product.productName }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ formatDate(product.startDate) }}</td>
            <td>
              <select v-model="product.status" @change="updateStatus(product.productId, product.status)">
                <option value="1">可以購買</option>
                <option value="2">不可購買</option>
                <option value="3">尚未上架</option>
                <option value="4">售罄</option>
              </select>
            </td>
            <td><img :src="product.imageUrl" alt="Product Image" class="product-image" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-data">
      <p>查無資料</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Product, queryProducts, updateProductStatus } from '@/services/Front/Frontapi';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ProductDataManagement',
  setup() {
    const products = ref<Product[]>([]);

    const fetchData = async (productType: number) => {
      try {
        console.log(`Fetching products for type: ${productType}`);
        const allProducts = await queryProducts();
        products.value = allProducts.filter((p: Product) => {
          if (productType === 1) return p.productType === 'PRIZE';
          if (productType === 2) return p.productType === 'GACHA';
          if (productType === 3) return p.productType === 'BLIND_BOX';
          return false;
        });
        console.log(`Fetched ${products.value.length} products`);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        products.value = []; // 清空數據，顯示"查無資料"
      }
    };

    const updateStatus = async (productId: number, status: string) => {
      try {
        console.log(`Updating status for product ${productId} to ${status}`);
        await updateProductStatus(productId, parseInt(status));
        console.log('Product status updated successfully');
      } catch (error) {
        console.error('Failed to update product status:', error);
      }
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      console.log('ProductDataManagement component mounted');
      fetchData(1); // 默認加載一番賞商品
    });

    return {
      products,
      fetchData,
      updateStatus,
      formatDate,
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

.product-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.product-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
}
</style>