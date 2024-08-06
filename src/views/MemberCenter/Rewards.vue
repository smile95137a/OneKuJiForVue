<template>
  <div class="memberCenter__rewards">
    <MemberCenterCoins />

    <div class="memberCenter__rewardsConsume">
      <div class="memberCenter__rewardsConsume-title">
        <p class="memberCenter__text">消費獎勵</p>
      </div>
      <div class="memberCenter__rewardsConsume-subTitle">儲值獎勵計算方式</div>
      <div class="memberCenter__rewardsConsume-info">
        每月1號~31號期間累計儲值金額達到累計的標準即可領取獎勵！
        每月1號將重新開始計算。
        一抽券面額50元，可以累積使用於商品免費一抽！(不限店家，效期三個月)
      </div>
    </div>
    <div class="memberCenter__rewardsAccount">
      <p class="memberCenter__text">
        本月累計金額：
        <span class="memberCenter__text memberCenter__text--red">$0</span>
      </p>
    </div>
    <div class="memberCenter__rewardsCoins">
      <div class="memberCenter__rewardsCoins-item">
        <div class="memberCenter__rewardsCoins-icon">
          <img :src="c1" alt="" srcset="" />
        </div>

        <div class="memberCenter__rewardsCoins-title">
          <p class="memberCenter__text">
            累計滿
            <span class="memberCenter__text memberCenter__text--red"
              >1000元</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-subTitle">
          <p class="memberCenter__text">
            領取
            <span class="memberCenter__text memberCenter__text--red"
              >5代幣</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-btns">
          <div class="memberCenter__rewardsCoins-btn">未達標</div>
        </div>
      </div>
      <div class="memberCenter__rewardsCoins-item">
        <div class="memberCenter__rewardsCoins-icon">
          <img :src="c1" alt="" srcset="" />
        </div>

        <div class="memberCenter__rewardsCoins-title">
          <p class="memberCenter__text">
            累計滿
            <span class="memberCenter__text memberCenter__text--red"
              >1000元</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-subTitle">
          <p class="memberCenter__text">
            領取
            <span class="memberCenter__text memberCenter__text--red"
              >5代幣</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-btns">
          <div class="memberCenter__rewardsCoins-btn">未達標</div>
        </div>
      </div>
      <div class="memberCenter__rewardsCoins-item">
        <div class="memberCenter__rewardsCoins-icon">
          <img :src="c1" alt="" srcset="" />
        </div>

        <div class="memberCenter__rewardsCoins-title">
          <p class="memberCenter__text">
            累計滿
            <span class="memberCenter__text memberCenter__text--red"
              >1000元</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-subTitle">
          <p class="memberCenter__text">
            領取
            <span class="memberCenter__text memberCenter__text--red"
              >5代幣</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-btns">
          <div class="memberCenter__rewardsCoins-btn">未達標</div>
        </div>
      </div>
      <div class="memberCenter__rewardsCoins-item">
        <div class="memberCenter__rewardsCoins-icon">
          <img :src="c1" alt="" srcset="" />
        </div>

        <div class="memberCenter__rewardsCoins-title">
          <p class="memberCenter__text">
            累計滿
            <span class="memberCenter__text memberCenter__text--red"
              >1000元</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-subTitle">
          <p class="memberCenter__text">
            領取
            <span class="memberCenter__text memberCenter__text--red"
              >5代幣</span
            >
          </p>
        </div>
        <div class="memberCenter__rewardsCoins-btns">
          <div class="memberCenter__rewardsCoins-btn">未達標</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MemberCenterCoins from '@/components/Frontend/memberCenter/MemberCenterCoins.vue';
import c1 from '@/assets/image/coin-1.png';
</script>

<style lang="scss" scoped></style>
