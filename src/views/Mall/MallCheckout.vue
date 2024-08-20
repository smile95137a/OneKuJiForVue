<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mallCheckout">
    <div class="mallCheckout__items">
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">商品資訊</div>
        <div class="mallCheckout__item-main">
          <Card>123</Card>
        </div>
      </div>
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">寄送資訊</div>
        <div class="mallCheckout__item-main">
          <Card>123</Card>
        </div>
      </div>
      <div class="mallCheckout__item">
        <div class="mallCheckout__item-title">優惠及結帳</div>
        <div class="mallCheckout__item-main">
          <Card>123</Card>
        </div>
      </div>
    </div>
    <div class="mallCheckout__total">
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">商品：</p>
        <p class="mallCheckout__text mallCheckout__text--money">$123</p>
      </div>
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">運費：</p>
        <p class="mallCheckout__text mallCheckout__text--money">$123</p>
      </div>
      <div class="mallCheckout__total-item">
        <p class="mallCheckout__text mallCheckout__text--title">折扣：</p>
        <p class="mallCheckout__text mallCheckout__text--money">$123</p>
      </div>
      <div class="mallCheckout__total-item m-t-36">
        <p class="mallCheckout__text mallCheckout__text--title">總金額：</p>
        <p class="mallCheckout__text mallCheckout__text--totalMoney">$123</p>
      </div>
    </div>
    <div class="mallCheckout__btns">
      <div class="mallCheckout__btn mallCheckout__btn--back">回上頁</div>
      <div class="mallCheckout__btn mallCheckout__btn--checkout">結帳</div>
    </div>
    <MallProductSlider
      sliderClass="mall-product__slider--likes"
      title="你可能會喜歡"
      :products="products"
      icon='<i class="fa-regular fa-face-grin-hearts"></i>'
    />
    <MallProductSlider
      sliderClass="mall-product__slider--recommend"
      title="店長推薦"
      :products="recommendedProducts"
      icon='<i class="fa-solid fa-crown"></i>'
    />
  </div>
</template>
<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import Breadcrumbs from '@/components/Frontend/Breadcrumbs.vue';
import MallProductSlider from '@/components/Frontend/MallProductSlider.vue';
import pd1 from '@/assets/image/pd1.png';
const breadcrumbItems = [
  { name: '首頁' },
  { name: '扭蛋抽獎' },
  { name: '扭蛋抽獎' },
  { name: '訂購商品' },
];
const products = [
  {
    productId: 'p1',
    productName: '神奇寶貝公仔',
    money: 299,
    spMoney: 259,
    imageUrl: 'https://example.com/image/pokemon1.jpg',
  },
  {
    productId: 'p2',
    productName: '變形金剛模型',
    money: 499,
    spMoney: 450,
    imageUrl: 'https://example.com/image/transformer1.jpg',
  },
  {
    productId: 'p3',
    productName: '高達模型',
    money: 999,
    spMoney: 899,
    imageUrl: 'https://example.com/image/gundam1.jpg',
  },
  {
    productId: 'p4',
    productName: '航海王公仔',
    money: 399,
    spMoney: 350,
    imageUrl: 'https://example.com/image/onepiece1.jpg',
  },
  {
    productId: 'p5',
    productName: '火影忍者模型',
    money: 599,
    spMoney: 549,
    imageUrl: 'https://example.com/image/naruto1.jpg',
  },
  {
    productId: 'p6',
    productName: '鋼鐵人手辦',
    money: 799,
    spMoney: 749,
    imageUrl: 'https://example.com/image/ironman1.jpg',
  },
  {
    productId: 'p7',
    productName: '星際大戰光劍',
    money: 1299,
    spMoney: 1199,
    imageUrl: 'https://example.com/image/starwars1.jpg',
  },
  {
    productId: 'p8',
    productName: '復仇者聯盟套裝',
    money: 1499,
    spMoney: 1399,
    imageUrl: 'https://example.com/image/avengers1.jpg',
  },
  {
    productId: 'p9',
    productName: '皮卡丘電腦包',
    money: 199,
    spMoney: 179,
    imageUrl: 'https://example.com/image/pikachu1.jpg',
  },
  {
    productId: 'p10',
    productName: '龍珠模型',
    money: 699,
    spMoney: 649,
    imageUrl: 'https://example.com/image/dragonball1.jpg',
  },
];

const recommendedProducts = [
  {
    productId: 'p1',
    productName: '神奇寶貝公仔',
    money: 299,
    spMoney: 259,
    imageUrl: 'https://example.com/image/pokemon1.jpg',
  },
  {
    productId: 'p2',
    productName: '變形金剛模型',
    money: 499,
    spMoney: 450,
    imageUrl: 'https://example.com/image/transformer1.jpg',
  },
  {
    productId: 'p3',
    productName: '高達模型',
    money: 999,
    spMoney: 899,
    imageUrl: 'https://example.com/image/gundam1.jpg',
  },
  {
    productId: 'p4',
    productName: '航海王公仔',
    money: 399,
    spMoney: 350,
    imageUrl: 'https://example.com/image/onepiece1.jpg',
  },
  {
    productId: 'p5',
    productName: '火影忍者模型',
    money: 599,
    spMoney: 549,
    imageUrl: 'https://example.com/image/naruto1.jpg',
  },
  {
    productId: 'p6',
    productName: '鋼鐵人手辦',
    money: 799,
    spMoney: 749,
    imageUrl: 'https://example.com/image/ironman1.jpg',
  },
  {
    productId: 'p7',
    productName: '星際大戰光劍',
    money: 1299,
    spMoney: 1199,
    imageUrl: 'https://example.com/image/starwars1.jpg',
  },
  {
    productId: 'p8',
    productName: '復仇者聯盟套裝',
    money: 1499,
    spMoney: 1399,
    imageUrl: 'https://example.com/image/avengers1.jpg',
  },
  {
    productId: 'p9',
    productName: '皮卡丘電腦包',
    money: 199,
    spMoney: 179,
    imageUrl: 'https://example.com/image/pikachu1.jpg',
  },
  {
    productId: 'p10',
    productName: '龍珠模型',
    money: 699,
    spMoney: 649,
    imageUrl: 'https://example.com/image/dragonball1.jpg',
  },
];

const hotProducts = [
  {
    productId: 'p1',
    productName: '神奇寶貝公仔',
    money: 299,
    spMoney: 259,
    imageUrl: 'https://example.com/image/pokemon1.jpg',
  },
  {
    productId: 'p2',
    productName: '變形金剛模型',
    money: 499,
    spMoney: 450,
    imageUrl: 'https://example.com/image/transformer1.jpg',
  },
  {
    productId: 'p3',
    productName: '高達模型',
    money: 999,
    spMoney: 899,
    imageUrl: 'https://example.com/image/gundam1.jpg',
  },
  {
    productId: 'p4',
    productName: '航海王公仔',
    money: 399,
    spMoney: 350,
    imageUrl: 'https://example.com/image/onepiece1.jpg',
  },
  {
    productId: 'p5',
    productName: '火影忍者模型',
    money: 599,
    spMoney: 549,
    imageUrl: 'https://example.com/image/naruto1.jpg',
  },
  {
    productId: 'p6',
    productName: '鋼鐵人手辦',
    money: 799,
    spMoney: 749,
    imageUrl: 'https://example.com/image/ironman1.jpg',
  },
  {
    productId: 'p7',
    productName: '星際大戰光劍',
    money: 1299,
    spMoney: 1199,
    imageUrl: 'https://example.com/image/starwars1.jpg',
  },
  {
    productId: 'p8',
    productName: '復仇者聯盟套裝',
    money: 1499,
    spMoney: 1399,
    imageUrl: 'https://example.com/image/avengers1.jpg',
  },
  {
    productId: 'p9',
    productName: '皮卡丘電腦包',
    money: 199,
    spMoney: 179,
    imageUrl: 'https://example.com/image/pikachu1.jpg',
  },
  {
    productId: 'p10',
    productName: '龍珠模型',
    money: 699,
    spMoney: 649,
    imageUrl: 'https://example.com/image/dragonball1.jpg',
  },
];
</script>
