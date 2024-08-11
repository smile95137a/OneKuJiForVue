<template>
  <div class="product2">
    <div class="product2__title">
      <div class="product2__text" data-text="盲盒">盲盒</div>
    </div>
    <div class="product2__btns">
      <div class="product2__btns-selects">
        <div class="product2__input product2__input--select">
          <div class="product2__input-main">全部狀態</div>
          <div class="product2__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
        <div class="product2__input product2__input--select">
          <div class="product2__input-main">全部廠商</div>
          <div class="product2__input-icon">
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
      </div>
      <div class="product2__btns-search">
        <div class="product2__input">
          <div class="product2__input-main">
            <input type="text" />
          </div>
          <div class="product2__input-icon font-size-28">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>
    </div>

    <Card title="盲盒" customClass="mcard--home">
      <div class="product2__list">
        <div class="product2__list-title">
          <div class="product2__list-filter">
            <i class="fa-solid fa-filter"></i>
          </div>
        </div>
        <div class="product2__list-products">
          <ProductCard
            v-for="(product, index) in BLIND_BOXProducts"
            :key="index"
            :imagePath="product.imageUrl"
            :imgStatus="getProductStatus(product)"
            :balanceText="`剩餘${product.stockQuantity}抽`"
            :money="product.price.toString()"
            :unitIcon="'金'"
            :unitText="'/抽'"
            :title="product.productName"
            :content="product.description"
            @click="navigateToDetail(product.productId)"
            :product-type="product.productType"
            :product-id="product.productId"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import ProductCard from '@/components/Frontend/ProductCard.vue';
import { Product, queryProducts } from '@/services/Front/Frontapi';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const BLIND_BOXProducts = ref<Product[]>([]);

const fetchProducts = async () => {
  try {
    console.log('Fetching products for BLIND_BOX...');
    const products = await queryProducts();
    BLIND_BOXProducts.value = products.filter(
      (product) => product.productType === 'BLIND_BOX'
    );
    console.log('BLIND_BOX products:', BLIND_BOXProducts.value);
  } catch (error) {
    console.error('Error fetching BLIND_BOX products:', error);
  }
};

const getProductStatus = (product: Product): string => {
  const now = new Date();
  const startDate = new Date(product.startDate);
  const endDate = new Date(product.endDate);
  console.log(`开始时间: ${startDate}, 结束时间: ${endDate}`);

  if (now < startDate) return '即將開始';
  if (now > endDate) return '已結束';
  return '開抽中';
};

const navigateToDetail = (productId: number) => {
  router.push({ name: 'ProductDetail2', params: { id: productId.toString() } });
};

onMounted(() => {
  console.log('Product2 component mounted, fetching products...');
  fetchProducts();
});
</script>

<style scoped>
.product2 {
  padding: 20px;
}

.product2__list-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product2__btns,
.product2__list {
  margin-top: 20px;
}
</style>
