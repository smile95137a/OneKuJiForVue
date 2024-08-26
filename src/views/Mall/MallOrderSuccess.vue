<template>
  <Breadcrumbs :items="breadcrumbItems" />
  <div class="mallOrderSuccess">
    <div class="mallOrderSuccess__title m-t-72">
      <p
        class="mallOrderSuccess__text mallOrderSuccess__text--title"
        data-text="訂購成功"
      >
        訂購成功
      </p>
      <p class="mallOrderSuccess__text mallOrderSuccess__text--subTitle">
        感謝您的消費！以下為您的訂單明細
      </p>
    </div>
    <Card customClass="mcard--mallOrderSuccess">
      <div class="mallOrderSuccess__main">
        <div class="mallOrderSuccess__main-list">
          <div className="grid gap-y-24">
            <div className="col-100 grid ">
              <div className="col-10 ">
                <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                  商品資訊
                </p>
              </div>
              <div className="col-65 mallOrderSuccess__main-cell--product">
                <div class="mallOrderSuccess__main-img">
                  <img :src="pd1" />
                </div>

                <p class="mallOrderSuccess__text">
                  預購10月免訂金 代理版 S.H.Figuarts SHF 七龍珠 孫悟空 (迷你)
                  -DAIMA-
                </p>
              </div>
              <div className="col-25 ">
                <p class="mallOrderSuccess__text text-align-end">$670</p>
              </div>
            </div>
            <div className="col-100 grid">
              <div className="col-10 ">
                <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                  寄送資訊
                </p>
              </div>
              <div className="col-65  mallOrderSuccess__main-cell--delivery">
                <p class="mallOrderSuccess__text">
                  宅配：台北市中正區重慶南路一段1號1樓
                </p>
                <p class="mallOrderSuccess__text">發票：個人二聯式發票</p>
              </div>
              <div className="col-25 ">
                <p class="mallOrderSuccess__text text-align-end">$670</p>
              </div>
            </div>
            <div className="col-100 grid">
              <div className="col-10 ">
                <p class="mallOrderSuccess__text">優惠</p>
              </div>
              <div className="col-65 ">滿$499折$50</div>
              <div className="col-25 ">
                <p class="mallOrderSuccess__text text-align-end">$670</p>
              </div>
            </div>
            <div className="col-100 grid">
              <div className="col-10 ">
                <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
                  付款
                </p>
              </div>
              <div className="col-65 ">信用卡一次付清</div>
              <div className="col-25 "></div>
            </div>
          </div>
        </div>

        <div class="mallOrderSuccess__main-total">
          <p class="mallOrderSuccess__text mallOrderSuccess__text--title">
            總金額：
          </p>
          <p class="mallOrderSuccess__text mallOrderSuccess__text--money">
            $ 770
          </p>
        </div>
      </div>
    </Card>
    <div class="mallOrderSuccess__btns">
      <div class="mallOrderSuccess__btn mallOrderSuccess__btn--backHome">
        回首頁
      </div>
      <div class="mallOrderSuccess__btn mallOrderSuccess__btn--continue">
        繼續購買
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import Breadcrumbs from '@/components/frontend/Breadcrumbs.vue';
import pd1 from '@/assets/image/pd1.png';
const breadcrumbItems = [
  { name: '首頁' },
  { name: '扭蛋抽獎' },
  { name: '扭蛋抽獎' },
  { name: '訂購商品' },
];
</script>
