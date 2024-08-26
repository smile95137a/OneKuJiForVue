<template>
  <div class="memberCenter__orderHistory">
    <MemberCenterCoins />
    <div class="memberCenter__orderHistoryForm">
      <div class="memberCenter__orderHistoryForm-title">
        <p class="memberCenter__text">消費紀錄</p>
      </div>
      <div class="memberCenter__orderHistoryForm-main">
        <div class="memberCenter__orderHistoryForm-box">
          <div class="memberCenter__orderHistoryForm-form-inputs m-t-20">
            <p class="memberCenter__text">起始時間</p>
            <input
              type="local-date"
              class="memberCenter__orderHistoryForm-form-input"
            />
          </div>
        </div>
        <div class="memberCenter__orderHistoryForm-box">
          <div class="memberCenter__orderHistoryForm-form-inputs m-t-20">
            <p class="memberCenter__text memberCenter__text--required">
              結束時間
            </p>
            <input
              type="local-date"
              class="memberCenter__orderHistoryForm-form-input"
            />
          </div>
        </div>
        <div
          class="memberCenter__orderHistoryForm-box memberCenter__orderHistoryForm-box--btns"
        >
          <div class="memberCenter__orderHistoryForm-btns">
            <div class="memberCenter__orderHistoryForm-btn">
              <span class="memberCenter__text">查詢</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="memberCenter__table">
      <table>
        <thead>
          <tr>
            <th class="w-30">日期</th>
            <th class="w-50">項目</th>
            <th class="w-20">內容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
          <tr>
            <td>2024/07/01 18:22</td>
            <td>項目名稱</td>
            <td>內容文字</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins.vue';
</script>

<style lang="scss" scoped></style>
