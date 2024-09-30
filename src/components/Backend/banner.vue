<template>
    <div class="banner-container">
      <h2>Banner 管理</h2>
      <div v-if="loading">加載中...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <div class="banner-list">
          <div v-for="banner in banners" :key="banner.bannerId" class="banner-item">
            <img :src="bannerservice.getImageUrl(banner.imageUrls[0])" :alt="banner.bannerUid" />
            <div class="banner-details">
              <p>ID: {{ banner.bannerId }}</p>
              <p>狀態: {{ banner.status }}</p>
              <p>產品類型: {{ banner.productType }}</p>
              <p>產品 ID: {{ banner.productId }}</p>
            </div>
            <div class="banner-actions">
              <button @click="editBanner(banner)">編輯</button>
              <button @click="deleteBanner(banner.bannerId)">刪除</button>
            </div>
          </div>
        </div>
        <button @click="showAddBannerForm = true">新增 Banner</button>
      </div>
  
      <!-- 新增/編輯 Banner 表單 -->
      <div v-if="showAddBannerForm || editingBanner" class="banner-form">
        <h3>{{ editingBanner ? '編輯' : '新增' }} Banner</h3>
        <form @submit.prevent="submitBannerForm">
          <div>
            <label for="productType">產品類型:</label>
            <select v-model="selectedProductType" id="productType" @change="onProductTypeChange" required>
              <option v-for="type in Object.values(ProductType)" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div v-if="selectedProductType === ProductType.PRIZE">
            <label for="prizeCategory">獎品類別:</label>
            <select v-model="selectedPrizeCategory" id="prizeCategory" @change="onPrizeCategoryChange" required>
              <option v-for="category in Object.values(PrizeCategory)" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label for="productId">產品:</label>
            <select v-model="bannerForm.productId" id="productId" @change="onProductChange" required>
              <option v-for="product in availableProducts" :key="product.productId" :value="product.productId">
                {{ product.productName }}
              </option>
            </select>
          </div>
          <div v-if="selectedProduct">
            <img :src="bannerservice.getImageUrl(selectedProduct.imageUrls[0])" alt="產品圖片" class="product-image-preview" />
          </div>
          <div>
            <label for="status">狀態:</label>
            <select v-model="bannerForm.status" id="status" required>
              <option v-for="status in Object.values(BannerStatus)" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
          <button type="submit">{{ editingBanner ? '更新' : '創建' }}</button>
          <button type="button" @click="cancelForm">取消</button>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch, computed } from 'vue';
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
      const editingBanner = ref<Banner | null>(null);
      const bannerForm = ref<BannerFormData>({
        productId: 0,
        status: BannerStatus.AVAILABLE,
      });
      const selectedProductType = ref<ProductType>(ProductType.PRIZE);
      const selectedPrizeCategory = ref<PrizeCategory>(PrizeCategory.NONE);
      const availableProducts = ref<ProductRes[]>([]);
  
      const selectedProduct = computed(() => {
        return availableProducts.value.find(product => product.productId === bannerForm.value.productId);
      });
  
      const fetchBanners = async () => {
        try {
          loading.value = true;
          const response = await bannerservice.getAllBanners();
          banners.value = response.data;
          loading.value = false;
        } catch (err) {
          error.value = '加載 Banner 失敗';
          loading.value = false;
        }
      };
  
      const fetchAvailableProducts = async () => {
        try {
          const response = await productservice.getAllProductsByType(selectedProductType.value);
          availableProducts.value = response.data;
        } catch (err) {
          error.value = '加載產品失敗';
        }
      };
  
      const onProductTypeChange = () => {
        selectedPrizeCategory.value = PrizeCategory.NONE;
        bannerForm.value.productId = 0;
        fetchAvailableProducts();
      };
  
      const onPrizeCategoryChange = async () => {
        if (selectedProductType.value === ProductType.PRIZE) {
          try {
            const response = await productservice.getOneKuJiType(selectedPrizeCategory.value);
            availableProducts.value = response.data;
            bannerForm.value.productId = 0;
          } catch (err) {
            error.value = '加載獎品失敗';
          }
        }
      };
  
      const onProductChange = () => {
        // 產品改變時，可以在這裡添加額外的邏輯
      };
  
      const submitBannerForm = async () => {
        try {
          if (editingBanner.value) {
            await bannerservice.updateBanner(editingBanner.value.bannerUid, bannerForm.value);
          } else {
            await bannerservice.createBanner(bannerForm.value);
          }
          await fetchBanners();
          cancelForm();
        } catch (err) {
          error.value = '保存 Banner 失敗';
        }
      };
  
      const editBanner = (banner: Banner) => {
        editingBanner.value = banner;
        bannerForm.value = {
          productId: banner.productId,
          status: banner.status,
        };
        selectedProductType.value = banner.productType;
        fetchAvailableProducts();
      };
  
      const deleteBanner = async (id: number) => {
        if (confirm('確定要刪除這個 Banner 嗎？')) {
          try {
            await bannerservice.deleteBanner(id);
            await fetchBanners();
          } catch (err) {
            error.value = '刪除 Banner 失敗';
          }
        }
      };
  
      const cancelForm = () => {
        showAddBannerForm.value = false;
        editingBanner.value = null;
        bannerForm.value = {
          productId: 0,
          status: BannerStatus.AVAILABLE,
        };
        selectedProductType.value = ProductType.PRIZE;
        selectedPrizeCategory.value = PrizeCategory.NONE;
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
        editingBanner,
        bannerForm,
        selectedProductType,
        selectedPrizeCategory,
        availableProducts,
        selectedProduct,
        bannerservice,
        ProductType,
        PrizeCategory,
        BannerStatus,
        submitBannerForm,
        editBanner,
        deleteBanner,
        cancelForm,
        onProductTypeChange,
        onPrizeCategoryChange,
        onProductChange,
      };
    },
  });
  </script>
  
  <style scoped>
  .banner-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .banner-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .banner-item {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
  }
  
  .banner-item img, .product-image-preview {
    width: 100%;
    height: auto;
    object-fit: cover;
    max-height: 200px;
  }
  
  .banner-details {
    margin-top: 10px;
  }
  
  .banner-actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  .banner-form {
    margin-top: 20px;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 5px;
  }
  
  .banner-form div {
    margin-bottom: 10px;
  }
  
  .banner-form label {
    display: block;
    margin-bottom: 5px;
  }
  
  .banner-form input,
  .banner-form select {
    width: 100%;
    padding: 5px;
  }
  
  .banner-form button {
    margin-right: 10px;
  }
  </style>