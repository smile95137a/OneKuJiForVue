<template>
  <SectionHeader title="關於我們"/>
  <Card custom-class="m-t-24">
    <div class="about">
      <div class="about__title">
        <p class="about__text">
          <span class="about__text about__text--highlight">再來一抽</span>
          是全臺灣最有公信力的線上一番賞抽獎平台，
          <p>我們最大的特色就是：公平、公正、公開、透明，本平台經由第三方非營利組織
            <span class="about__text about__text--highlight">國際商業職業教育協會</span>
            嚴格監督，絕無任何詐欺消費者之可能，保證不玄不漲價。
            <p>
                <span class="about__text about__text--highlight">國際商業職業教育協會</span>
                嚴格監督，絕無任何詐欺消費者之可能，保證不玄不漲價。</p>
            </p>
            
        </p>
      </div>
      <div class="about__content">
        <p class="about__text about__text--title">來
            <span class="about__text about__text--highlight">再來一抽</span>您將享受到~
        </p>
        <p class="about__text">1.公平、公正、公開、透明的消費。</p>
        <p class="about__text">2.我們賞品獎項最豐富。</p>
        <p class="about__text">3.一次消費，多重中獎機會。</p>
        <p class="about__text">4.會員多重好福利-免費代幣領不完。</p>
        <p class="about__text">5.超常態加碼抽獎活動，獎品超豐富。</p>
        <p class="about__text">6.獨家<span class="about__text about__text--highlight">客製化專區</span>，為您打造專屬抽獎。</p>
      </div>

      <div class="about__company">
        <div class="about__company-logo">
          <img :src="logoImg" class="about__company-img" alt="Logo" />
        </div>
        <div class="about__company-info">
            <p class="about__text"><span class="about__text about__text--highlight">公司名稱：</span>再來一抽娛樂有限公司</p>
            <p class="about__text"><span class="about__text about__text--highlight">公司統編：</span>47075614</p>
            <p class="about__text"><span class="about__text about__text--highlight">公司信箱：</span>easonandjenny@gmail.com</p>
            <p class="about__text"><span class="about__text about__text--highlight">官方LINE：</span>@again888</p>
            <p class="about__text"><span class="about__text about__text--highlight">客服服務時間：</span>09:00~17:00</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '@/components/common/Card.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import logoImg from '@/assets/image/logo1.png';
</script>
