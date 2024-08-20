<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mall-product">
    <div class="mall-product__main">
      <div class="mall-product__img">
        <div class="mall-product__img-main">
          <img :src="pd1" />
        </div>
        <div class="mall-product__img-other">
          <div
            class="mall-product__img-otherItem mall-product__img-otherItem--active"
          >
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
          <div class="mall-product__img-otherItem">
            <img :src="pd1" />
          </div>
        </div>
      </div>
      <!--  -->
      <div class="mall-product__detail">
        <div class="mall-product__detail-title">
          預購10月免訂金 代理版 S.H.Figuarts SHF 七龍珠 孫悟空 (迷你) -DAIMA-
        </div>
        <div class="mall-product__detail-prices">
          <div class="mall-product__detail-priceMain">
            <div class="mall-product__detail-priceMoney">670</div>
            <div class="mall-product__detail-priceUnit">元</div>
          </div>
          <div class="mall-product__detail-priceCoupon">
            <div class="mall-product__detail-priceCouponBtns">
              <div class="mall-product__detail-priceCouponBtn">滿額免運</div>
              <div class="mall-product__detail-priceCouponBtn">滿額折300</div>
            </div>
            <div class="mall-product__detail-priceCouponTicket">
              <p class="mall-product__detail-priceCouponTicket-text">
                領取優惠券
              </p>
            </div>
          </div>
        </div>

        <div class="mall-product__detail-other">
          <div class="mall-product__detail-otherNum">
            <div class="mall-product__detail-otherNum-title">數量</div>
            <div class="mall-product__detail-otherNum-other">
              <div class="mall-product__detail-otherNum-btn">
                <i class="fa-solid fa-minus"></i>
              </div>
              <div class="mall-product__detail-otherNum-text">1</div>
              <div
                class="mall-product__detail-otherNum-btn mall-product__detail-otherNum-btn--active"
              >
                <i class="fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
          <div class="mall-product__detail-otherPreOrder">
            <div class="mall-product__detail-otherPreOrder-title">預購</div>
            <div class="mall-product__detail-otherPreOrder-other">
              <div class="mall-product__detail-otherPreOrder-other-text">
                即日起 ~ 2024/11/30，商品預計將於 2024/11/30 陸續發貨
              </div>
            </div>
          </div>
          <div class="mall-product__detail-otherLogistics">
            <div class="mall-product__detail-otherLogistics-title">物流</div>
            <div class="mall-product__detail-otherLogistics-other">
              <i class="fa-solid fa-truck"></i>
              <div class="mall-product__detail-otherLogistics-other-text">
                $60-$150
              </div>
              <div class="mall-product__detail-otherLogistics-other-icon">
                <img :src="se" />
                <img :src="familyMart" />
                <img :src="hilife" />
              </div>
            </div>
          </div>
          <div class="mall-product__detail-otherPay">
            <div class="mall-product__detail-otherPreOrder-title">付款</div>
            <div class="mall-product__detail-otherPreOrder-other">
              <div class="mall-product__detail-otherPreOrder-other-text">
                信用卡、超商取貨付款
              </div>
            </div>
          </div>
        </div>
        <div class="mall-product__detail-action">
          <div class="mall-product__detail-action-btn">
            <div class="mall-product__detail-action-btn-icon">
              <i class="fa-solid fa-cart-plus"></i>
            </div>
            <div class="mall-product__detail-action-btn-text">加到購物車</div>
          </div>
          <div
            class="mall-product__detail-action-btn mall-product__detail-action-btn--red"
          >
            <div class="mall-product__detail-action-btn-icon"></div>
            <div class="mall-product__detail-action-btn-text">立即購買!</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mall-product__link grid m-t-24">
      <div class="col-50 grid">
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">分享</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--share"
          >
            <img :src="lineImg" />
            <img :src="metaImg" />
            <img :src="linkImg" />
          </div>
        </div>
        <div class="col-100 mall-product__link-item m-t-24">
          <div class="mall-product__link-item-title">收藏</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--like"
          >
            <i class="fa-regular fa-heart"></i>
            <p class="mall-product__text">(3)</p>
          </div>
        </div>
      </div>

      <div class="col-50 grid">
        <div class="col-100 mall-product__link-item">
          <div class="mall-product__link-item-title">分類</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--category"
          >
            主分類 > 子分類
          </div>
        </div>
        <div class="col-100 mall-product__link-item m-t-24">
          <div class="mall-product__link-item-title">關鍵字</div>
          <div
            class="mall-product__link-item-main mall-product__link-item-main--hashTag"
          >
            關鍵字 、 關鍵字 、 關鍵字 、 關鍵字
          </div>
        </div>
      </div>
    </div>
    <div class="mall-product__tabs">
      <div class="mall-product__tab-header">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'mall-product__tab-item',
            { 'mall-product__tab-item--active': activeTab === tab },
          ]"
          @click="activeTab = tab"
        >
          {{ tab }}
        </div>
      </div>
      <div
        class="mall-product__tab-content"
        :style="{
          height: expanded ? 'auto' : '180px',
          overflow: expanded ? 'visible' : 'hidden',
        }"
      >
        <div v-if="activeTab === '詳情'">
          下標前請先參閱賣場規定，同意與了解後在考慮下標，一但下標即表示同意賣場所以規定。
          訂金200元或全額付清
          貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
          免訂金每人限購2個，超過須支付訂金。
          網路下標門市取貨的會酌收20元手續費。
          下標前請先參閱賣場規定，同意與了解後在考慮下標，一但下標即表示同意賣場所以規定。
          訂金200元或全額付清
          貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
          免訂金每人限購2個，超過須支付訂金。
          網路下標門市取貨的會酌收20元手續費。
          下標前請先參閱賣場規定，同意與了解後在考慮下標，一但下標即表示同意賣場所以規定。
          訂金200元或全額付清
          貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
          免訂金每人限購2個，超過須支付訂金。
          網路下標門市取貨的會酌收20元手續費。
          下標前請先參閱賣場規定，同意與了解後在考慮下標，一但下標即表示同意賣場所以規定。
          訂金200元或全額付清
          貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
          免訂金每人限購2個，超過須支付訂金。
          網路下標門市取貨的會酌收20元手續費。
        </div>
        <div v-if="activeTab === '規格'">
          <p>規格相關的資訊可以放在這裡。</p>
        </div>
      </div>
      <div
        v-if="!expanded"
        class="mall-product__tab-more"
        @click="toggleExpand"
      >
        <div class="mall-product__tab-more-btn">
          <span>展開更多</span>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
      </div>
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
    <MallProductSlider
      :slidesPerView="4"
      sliderClass="mall-product__slider--hot"
      title="熱銷排行"
      :products="hotProducts"
      icon='<i class="fa-solid fa-fire-flame-curved"></i>'
      slideClass="p-y-12 p-x-12"
      :spaceBetween="0"
      :isRank="true"
    />
  </div>
</template>

<script lang="ts" setup>
import Breadcrumbs from '@/components/Frontend/Breadcrumbs.vue';
import MallProductSlider from '@/components/Frontend/MallProductSlider.vue';
import pd1 from '@/assets/image/pd1.png';
import se from '@/assets/image/711.png';
import familyMart from '@/assets/image/familyMart.png';
import hilife from '@/assets/image/hilife.png';
import lineImg from '@/assets/image/line.png';
import metaImg from '@/assets/image/meta.png';
import linkImg from '@/assets/image/link.png';
import { onMounted, ref } from 'vue';
const breadcrumbItems = [
  { name: '首頁' },
  { name: '扭蛋抽獎' },
  { name: '扭蛋抽獎' },
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

const tabs = ['詳情', '規格'];
const activeTab = ref('詳情');
const expanded = ref(false);
const showToggle = ref(false);
const contentDiv = ref<HTMLElement | null>(null);

const maxHeight = 100; // 指定內容的最大高度（超過此高度會顯示展開按鈕）

const fullContent = `
  下標前請先參閱賣場規定，同意與了解後再考慮下標，一旦下標即表示同意賣場所以規定。
  訂金200元或全額付清
  貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
  免訂金每人限購2個，超過須支付訂金。
  網路下標門市取貨的會酌收20元手續費。
  下標前請先參閱賣場規定，同意與了解後再考慮下標，一旦下標即表示同意賣場所以規定。
  訂金200元或全額付清
  貨到付款免訂金，非貨到付款的請記得匯訂金或付清，並留言告知以便確認。
  免訂金每人限購2個，超過須支付訂金。
  網路下標門市取貨的會酌收20元手續費。
`;

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

onMounted(() => {
  if (contentDiv.value) {
    showToggle.value = contentDiv.value.scrollHeight > maxHeight;
  }
});
</script>
<style scoped></style>
