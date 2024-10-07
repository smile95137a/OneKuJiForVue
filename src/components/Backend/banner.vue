<template>
  <div class="banner-container">
    <h2 class="page-title">Banner 管理</h2>
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <span>加載中...</span>
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="banner-list">
        <div v-for="banner in banners" :key="banner.bannerId" class="banner-item">
          <img :src="getBannerImageUrl(banner)" :alt="banner.bannerUid" class="banner-image" />
          <div class="banner-details">
            <h3>Banner ID: {{ banner.bannerId }}</h3>
            <p><strong>狀態:</strong> <span :class="['status-badge', banner.status]">{{ getStatusLabel(banner.status) }}</span></p>
            <p><strong>產品類型:</strong> {{ getProductTypeLabel(banner.productType) }}</p>
            <p><strong>產品 ID:</strong> {{ banner.productId }}</p>
          </div>
          <div class="banner-actions">
            <button @click="deleteBanner(banner.bannerId)" class="btn btn-delete">刪除</button>
          </div>
        </div>
      </div>
      <button @click="showAddBannerForm = true" class="btn btn-add">新增 Banner</button>
    </div>

    <!-- 新增 Banner 表單 -->
    <div v-if="showAddBannerForm" class="modal-overlay" @click.self="cancelForm">
      <div class="banner-form">
        <h3>新增 Banner</h3>
        <form @submit.prevent="submitBannerForm">
          <div class="form-group">
            <label for="productType">產品類型:</label>
            <select v-model="bannerForm.productType" id="productType" @change="onProductTypeChange" required>
              <option v-for="type in productTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
          <div v-if="bannerForm.productType === ProductType.PRIZE" class="form-group">
            <label for="prizeCategory">獎品類別:</label>
            <select v-model="selectedPrizeCategory" id="prizeCategory" @change="onPrizeCategoryChange" required>
              <option v-for="category in prizeCategoryOptions" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="productId">產品:</label>
            <select v-model="bannerForm.productId" id="productId" @change="onProductChange" required>
              <option v-for="product in availableProducts" :key="product.productId" :value="product.productId">
                {{ product.productName }}
              </option>
            </select>
          </div>
          <div v-if="selectedProduct" class="form-group">
            <img :src="getBannerImageUrl(selectedProduct)" alt="產品圖片" class="product-image-preview" />
          </div>
          <div class="form-group">
            <label for="status">狀態:</label>
            <select v-model="bannerForm.status" id="status" required>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? '保存中...' : '創建' }}
            </button>
            <button type="button" @click="cancelForm" class="btn btn-secondary" :disabled="submitting">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { bannerservice } from '@/services/backend/bannerservice';
import { productservice } from '@/services/backend/productservice';
import { Banner, BannerReq, BannerStatus, BannerFormData } from '@/interfaces/banner';
import { ProductType, PrizeCategory, ProductRes } from '@/interfaces/product';

export default defineComponent({
  name: 'BannerComponent',
  setup() {
    const banners = ref<Banner[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const showAddBannerForm = ref(false);
    const bannerForm = ref<BannerFormData>({
      productId: 0,
      status: BannerStatus.AVAILABLE,
      productType: ProductType.PRIZE,
    });
    const selectedPrizeCategory = ref<PrizeCategory>(PrizeCategory.NONE);
    const availableProducts = ref<ProductRes[]>([]);
    const submitting = ref(false);

    const productTypeOptions = [
      { value: ProductType.PRIZE, label: '一番賞' },
      { value: ProductType.GACHA, label: '扭蛋' },
      { value: ProductType.BLIND_BOX, label: '盲盒' },
    ];

    const prizeCategoryOptions = [
      { value: PrizeCategory.FIGURE, label: '官方一番賞' },
      { value: PrizeCategory.C3, label: '家電一番賞' },
      { value: PrizeCategory.BONUS, label: '紅利賞' },
      { value: PrizeCategory.PRIZESELF, label: '自製賞' },
      { value: PrizeCategory.NONE, label: '無' },
    ];

    const statusOptions = [
      { value: BannerStatus.AVAILABLE, label: '啟用' },
      { value: BannerStatus.UNAVAILABLE, label: '停用' },
    ];

    const selectedProduct = computed(() => {
      return availableProducts.value.find(product => product.productId === bannerForm.value.productId);
    });

    const fetchBanners = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await bannerservice.getAllBanners();
        banners.value = response.data;
      } catch (err) {
        console.error('加載 Banner 失敗:', err);
        error.value = '加載 Banner 失敗';
      } finally {
        loading.value = false;
      }
    };

    const fetchAvailableProducts = async () => {
      try {
        const response = await productservice.getAllProductsByType(bannerForm.value.productType);
        availableProducts.value = response.data;
      } catch (err) {
        console.error('加載產品失敗:', err);
        error.value = '加載產品失敗';
      }
    };

    const onProductTypeChange = () => {
      selectedPrizeCategory.value = PrizeCategory.NONE;
      bannerForm.value.productId = 0;
      fetchAvailableProducts();
    };

    const onPrizeCategoryChange = async () => {
      if (bannerForm.value.productType === ProductType.PRIZE) {
        try {
          const response = await productservice.getOneKuJiType(selectedPrizeCategory.value);
          availableProducts.value = response.data;
          bannerForm.value.productId = 0;
        } catch (err) {
          console.error('加載獎品失敗:', err);
          error.value = '加載獎品失敗';
        }
      }
    };

    const onProductChange = () => {
      // 產品改變時的額外邏輯（如果需要）
    };

    const submitBannerForm = async () => {
      try {
        submitting.value = true;
        error.value = null;
        const bannerData: BannerReq = {
          productId: bannerForm.value.productId,
          status: bannerForm.value.status,
          productType: bannerForm.value.productType,
        };

        await bannerservice.createBanner(bannerData);
        await fetchBanners();
        cancelForm();
      } catch (err) {
        console.error('保存 Banner 失敗:', err);
        error.value = '保存 Banner 失敗';
      } finally {
        submitting.value = false;
      }
    };

    const deleteBanner = async (id: number) => {
      if (confirm('確定要刪除這個 Banner 嗎？')) {
        try {
          await bannerservice.deleteBanner(id);
          await fetchBanners();
        } catch (err) {
          console.error('刪除 Banner 失敗:', err);
          error.value = '刪除 Banner 失敗';
        }
      }
    };

    const cancelForm = () => {
      showAddBannerForm.value = false;
      bannerForm.value = {
        productId: 0,
        status: BannerStatus.AVAILABLE,
        productType: ProductType.PRIZE,
      };
      selectedPrizeCategory.value = PrizeCategory.NONE;
    };

    const getProductTypeLabel = (type: ProductType) => {
      return productTypeOptions.find(option => option.value === type)?.label || type;
    };

    const getStatusLabel = (status: BannerStatus) => {
      return statusOptions.find(option => option.value === status)?.label || status;
    };

    const getBannerImageUrl = (banner: Banner | ProductRes) => {
      return banner.imageUrls && banner.imageUrls.length > 0
        ? bannerservice.getImageUrl(banner.imageUrls[0])
        : '';
    };

    onMounted(() => {
      fetchBanners();
      fetchAvailableProducts();
    });

    return {
      banners,
      loading,
      error,
      showAddBannerForm,
      bannerForm,
      selectedPrizeCategory,
      availableProducts,
      selectedProduct,
      submitting,
      ProductType,
      PrizeCategory,
      productTypeOptions,
      prizeCategoryOptions,
      statusOptions,
      submitBannerForm,
      deleteBanner,
      cancelForm,
      onProductTypeChange,
      onPrizeCategoryChange,
      onProductChange,
      getProductTypeLabel,
      getStatusLabel,
      getBannerImageUrl,
    };
  },
});
</script>
<style scoped>
.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.banner-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.banner-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  background-color: #fff;
}

.banner-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.banner-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.banner-details {
  padding: 15px;
}

.banner-details h3 {
  margin-top: 0;
  color: #2c3e50;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.AVAILABLE {
  background-color: #2ecc71;
  color: white;
}

.status-badge.UNAVAILABLE {
  background-color: #e74c3c;
  color: white;
}

.banner-actions {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f8f9fa;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-add {
  background-color: #2ecc71;
  color: white;
  margin-top: 20px;
  font-size: 16px;
}

.btn:hover {
  opacity: 0.9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select, .form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-image-preview {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

@media (max-width: 768px) {
  .banner-list {
    grid-template-columns: 1fr;
  }
  
  .banner-form {
    width: 95%;
  }
}
</style>