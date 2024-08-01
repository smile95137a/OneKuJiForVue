<template>
  <div class="product3">
    <div class="product3__title">
      <div class="product3__text" data-text="GACHA">GACHA</div>
    </div>
    <div class="product3__btns">
      <div class="product3__btns-selects">
        <div class="product3__input product3__input--select">
          <div class="product3__input-main">全部狀態</div>
          <div class="product3__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <div class="product3__input product3__input--select">
          <div class="product3__input-main">全部廠商</div>
          <div class="product3__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
      </div>
      <div class="product3__btns-search">
        <div class="product3__input">
          <div class="product3__input-main">
            <input type="text" />
          </div>
          <div class="product3__input-icon font-size-28">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
    </div>

    <Card title="GACHA" customClass="mcard--home">
      <div class="product3__list">
        <div class="product3__list-title">
          <div class="product3__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>
        <div class="product3__list-products">
          <ProductCard
            v-for="(product, index) in gachaProducts"
            :key="index"
            :customClass="product.customClass"
            :imagePath="product.imageUrl"
            :imgStatus="getProductStatus(product)"
            :balanceText="`剩餘${product.stockQuantity}抽`"
            :money="product.price.toString()"
            :unitIcon="'金'"
            :unitText="'/抽'"
            :title="product.productName"
            :content="product.description"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import { queryProducts, Product } from '@/services/Front/Frontapi';

const gachaProducts = ref<Product[]>([]);

const fetchProducts = async () => {
  try {
    console.log('Fetching products for GACHA...');
    const products = await queryProducts();
    gachaProducts.value = products.filter(product => product.productType === 'GACHA');
    console.log('GACHA products:', gachaProducts.value);
  } catch (error) {
    console.error('Error fetching GACHA products:', error);
  }
};

const getProductStatus = (product: Product): string => {
    const now = new Date();
    const startDate = new Date(product.startDate);
    const endDate = new Date(product.endDate);

    if (now < startDate) return '即將開始';
    if (now > endDate) return '已結束';
    return '開抽中';
};

onMounted(() => {
  console.log('Product3 component mounted, fetching products...');
  fetchProducts();
});
</script>

<style scoped>
.product3 {
  padding: 20px;
}

.product3__list-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product3__btns, .product3__list {
  margin-top: 20px;
}
</style>
