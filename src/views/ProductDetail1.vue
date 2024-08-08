<template>
  <div class="product-detail1">
    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product" class="product-detail1__content">
      <h1 class="product-title">{{ product.productName }}</h1>
      <div class="product-info">
        <img :src="product.imageUrl" :alt="product.productName" class="product-image" />
        <div class="product-details">
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">價格: <span>{{ product.price }}</span> 金/抽</p>
          <p class="product-stock">剩餘數量: <span>{{ product.stockQuantity }}</span></p>
          <p class="product-status">狀態: <span :class="statusClass">{{ getProductStatus(product) }}</span></p>

          <button @click="drawPrize" :disabled="!canDraw" class="draw-button">抽獎</button>
          <button @click="viewDrawResult" class="view-button">檢視抽況</button>
        </div>
      </div>
    </div>

    <!-- 抽獎結果彈窗 -->
    <div v-if="showDrawResult" class="modal">
      <div class="modal-content">
        <h2>抽獎結果</h2>
        <p>{{ drawResult }}</p>
        <button @click="closeDrawResult" class="close-button">關閉</button>
      </div>
    </div>

    <!-- 檢視抽況彈窗 -->
    <div v-if="showDrawStatus" class="modal">
      <div class="modal-content draw-status">
        <h2>抽獎狀況</h2>
        <div v-if="drawStatusInfo">
          <p>商品名稱: {{ drawStatusInfo.productName }}</p>
          <p>總抽獎次數: {{ drawStatusInfo.totalDrawCount }}</p>
          <p>剩餘抽獎次數: {{ drawStatusInfo.remainingDrawCount }}</p>
          <p>當前機率: {{ calculateProbability(drawStatusInfo) }}%</p>
        </div>
        <button @click="closeDrawStatus" class="close-button">關閉</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { drawOnePrize, DrawOnePrizeResponse, getProduct, getProductDetail, Product } from '@/services/Front/Frontapi';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const productId = Number(route.params.id);

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref('');
const showDrawResult = ref(false);
const drawResult = ref('');
const showDrawStatus = ref(false);
const drawStatusInfo = ref<any>(null);

const fetchProductDetail = async () => {
  try {
    loading.value = true;
    const fetchedProduct = await getProduct(productId);
    if (fetchedProduct) {
      product.value = fetchedProduct;
    } else {
      throw new Error('Product not found');
    }
  } catch (err) {
    error.value = '獲取產品詳情失敗';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getProductStatus = (prod: Product): string => {
  const now = new Date();
  const startDate = new Date(prod.startDate);
  const endDate = new Date(prod.endDate);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};

const statusClass = computed(() => {
  if (!product.value) return '';
  const status = getProductStatus(product.value);
  return {
    'status-upcoming': status === '即將開始',
    'status-ongoing': status === '開抽中',
    'status-ended': status === '已結束'
  };
});

const canDraw = computed(() => {
  if (!product.value) return false;
  const status = getProductStatus(product.value);
  return status === '開抽中' && product.value.stockQuantity > 0;
});

const drawPrize = async () => {
  if (!product.value) return;

  try {
    const userId = 1; // 假設用戶 ID 為 1，實際應用中應該從用戶狀態獲取
    const responseObj: DrawOnePrizeResponse = await drawOnePrize(userId, product.value.productId, {
      productId: product.value.productId,
      productDetailId: 0, // 假设为 0，实际应用中可能需要从产品详情中获取
      productName: product.value.productName,
      productType: product.value.productType,
      drawFrom: 'PRIZE',
      amount: 1,
      totalDrawCount: 1,
      remainingDrawCount: 0
    });

    if (responseObj) {
      drawResult.value = `恭喜您抽中了 ${responseObj.productName}！`;
    } else {
      drawResult.value = "抱歉，抽獎結果為空。";
    }
    showDrawResult.value = true;
  } catch (err) {
    console.error('抽獎失敗', err);
    drawResult.value = '抽獎失敗，請稍後再試';
    showDrawResult.value = true;
  }
};

const closeDrawResult = () => {
  showDrawResult.value = false;
};

const viewDrawResult = async () => {
  if (!product.value) return;

  try {
    const detailResult = await getProductDetail(product.value.productId);
    drawStatusInfo.value = {
      productName: detailResult.productName,
      totalDrawCount: detailResult.quantity,
      remainingDrawCount: detailResult.quantity // 這裡我們假設 quantity 就是剩餘數量
    };
    showDrawStatus.value = true;
  } catch (err) {
    console.error('獲取抽獎詳情失敗', err);
    alert('獲取抽獎詳情失敗，請稍後再試');
  }
};

const closeDrawStatus = () => {
  showDrawStatus.value = false;
};

const calculateProbability = (info: any) => {
  if (info.totalDrawCount === 0) return 0;
  return ((info.remainingDrawCount / info.totalDrawCount) * 100).toFixed(2);
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.product-detail1 {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}

.product-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  gap: 20px;
}

.product-image {
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.product-price,
.product-stock,
.product-status {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-price span,
.product-stock span {
  font-weight: bold;
  color: #e44d26;
}

.product-status span {
  font-weight: bold;
}

.status-upcoming {
  color: #ffa500;
}

.status-ongoing {
  color: #4caf50;
}

.status-ended {
  color: #f44336;
}

.draw-button,
.view-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.draw-button {
  background-color: #4caf50;
  color: white;
}

.draw-button:hover {
  background-color: #45a049;
}

.draw-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.view-button {
  background-color: #008cba;
  color: white;
}

.view-button:hover {
  background-color: #007a9e;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.modal-content h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.close-button {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.close-button:hover {
  background-color: #d32f2f;
}

.draw-status p {
  margin-bottom: 10px;
  font-size: 16px;
}
</style>