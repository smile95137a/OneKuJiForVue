# 前台圖片遷移至 S3 完成報告

## 📋 變更摘要

將前台所有圖片從 API 伺服器 (`VITE_BASE_API_URL`) 遷移至 S3 CDN (`VITE_BASE_API_URL3`)。

### 變更日期
2025-12-18

### 變更原因
- 現階段前台圖片仍從 API 伺服器載入 (`https://api.onemorelottery.tw:8081`)
- 後台已全面使用 S3，前台需同步遷移
- 減輕 API 伺服器負擔，提升圖片載入效能

---

## ✅ 已修改的檔案

### 1. **核心組件 - MImage.vue**
**檔案路徑**: `src/components/Frontend/MImage.vue`

**變更內容**:
```typescript
// 修改前
const apiURL = import.meta.env.VITE_BASE_API_URL as string;

// 修改後
const apiURL = import.meta.env.VITE_BASE_API_URL3 as string;
```

**影響範圍**: 
- 所有前台頁面的產品圖片
- Banner 輪播圖
- 新聞圖片
- 訂單商品圖片
- 購物車商品圖片

---

### 2. **工具函數 - ImageUtils.ts**
**檔案路徑**: `src/utils/ImageUtils.ts`

**變更內容**:
```typescript
// 修改前
const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL;

// 修改後
const IMAGE_BASE_URL = import.meta.env.VITE_BASE_API_URL3 as string;
```

**新增功能**:
- ✅ `getImageUrl()` - 單一圖片路徑轉換
- ✅ `getImageUrls()` - 圖片陣列批次轉換
- ✅ `getFirstImageUrl()` - 取得第一張圖片
- ✅ `isValidImageUrl()` - 驗證圖片 URL

---

## 🔍 受影響的前台組件

以下組件通過 `MImage` 元件顯示圖片，已自動遷移至 S3：

### 產品相關
- ✅ `ProductCard.vue` - 產品卡片
- ✅ `ProductCard2.vue` - 產品卡片變體
- ✅ `ProductContentMain.vue` - 產品主要內容
- ✅ `ProductContentMall.vue` - 商城產品內容
- ✅ `MallProductSlider.vue` - 商城產品輪播

### 頁面視圖
- ✅ `Home.vue` - 首頁 Banner
- ✅ `ProductDetail1.vue` - 產品詳情頁 (一番賞/扭蛋)
- ✅ `ProductDetail2.vue` - 產品詳情頁 (盲盒)
- ✅ `MallProduct.vue` - 商城產品頁
- ✅ `MallCheckout.vue` - 商城結帳頁
- ✅ `MallOrderSuccess.vue` - 訂單成功頁
- ✅ `PrizeCheckout.vue` - 抽獎結帳頁
- ✅ `PrizeOrderSuccess.vue` - 抽獎訂單成功頁
- ✅ `News.vue` - 新聞列表頁

---

## 🌐 環境變數配置

確保 `.env` 中有正確設定：

```properties
# S3 圖片 CDN (必須設定)
VITE_BASE_API_URL3=https://onemorelottery.tw/images

# 前台 API (用於數據請求，非圖片)
VITE_BASE_API_URL=https://api.onemorelottery.tw:8081

# 後台 API
VITE_BASE_API_URL2=http://localhost:8080/api
```

---

## 🧪 測試檢查清單

### 必須測試的項目

#### 1. **首頁**
- [ ] Banner 輪播圖正常顯示
- [ ] 推薦產品圖片正常顯示
- [ ] 新聞圖片正常顯示

#### 2. **產品列表**
- [ ] 一番賞列表圖片顯示
- [ ] 扭蛋列表圖片顯示
- [ ] 盲盒列表圖片顯示
- [ ] 商城產品列表圖片顯示

#### 3. **產品詳情**
- [ ] 產品主圖顯示
- [ ] 產品輪播圖顯示
- [ ] 獎項圖片顯示（一番賞）

#### 4. **購物流程**
- [ ] 購物車商品圖片顯示
- [ ] 結帳頁面商品圖片顯示
- [ ] 訂單成功頁面商品圖片顯示

#### 5. **會員中心**
- [ ] 訂單歷史商品圖片顯示
- [ ] 獎品列表圖片顯示

#### 6. **新聞頁面**
- [ ] 新聞列表縮圖顯示
- [ ] 新聞詳情圖片顯示

### 測試方法

#### 方式 1: 開發者工具檢查
1. 開啟瀏覽器 DevTools (F12)
2. 切換到 **Network** 標籤
3. 過濾圖片請求 (Filter: `images`)
4. 重新載入頁面
5. 確認所有圖片請求的 URL 都是：
   ```
   https://onemorelottery.tw/images/xxx.jpg
   ```
   **而非**:
   ```
   https://api.onemorelottery.tw:8081/xxx.jpg
   ```

#### 方式 2: Console 檢查環境變數
在 Console 輸入：
```javascript
console.log('圖片 CDN:', import.meta.env.VITE_BASE_API_URL3);
```
應顯示：`https://onemorelottery.tw/images`

#### 方式 3: 檢查圖片載入錯誤
1. 打開 Console 標籤
2. 過濾錯誤訊息
3. 確認沒有 404 或 CORS 相關錯誤

---

## 🚨 常見問題排查

### 問題 1: 圖片顯示預設文字/載入失敗
**可能原因**:
- 後端返回的路徑格式不正確
- S3 路徑配置錯誤

**解決方式**:
```javascript
// 在 Console 檢查實際圖片 URL
const testPath = '/xxx.jpg';
console.log('組合後的 URL:', import.meta.env.VITE_BASE_API_URL3 + testPath);
```

### 問題 2: 部分圖片有 `/img/` 路徑前綴
**檢查**:
- 後端 API 返回的 `imageUrls` 格式
- 確認路徑是否一致

**後端返回範例**:
```json
{
  "imageUrls": ["/xxx.jpg"]  // ✅ 正確
}
```

**前端組合結果**:
```
https://onemorelottery.tw/images/xxx.jpg
```

### 問題 3: 本地開發環境看不到圖片
**原因**: 
- 本地環境 (`http://localhost:5173`) 載入遠端 HTTPS 圖片，可能有暫時性網路問題
- CORS 設定問題

**檢查方式**:
1. 直接在瀏覽器開啟圖片 URL
2. 檢查 Network Tab 的錯誤訊息

---

## 📝 後續維護注意事項

### 新增元件時
如果需要顯示產品/新聞/Banner 圖片：
1. **優先使用** `<MImage>` 元件
2. 如需手動組合 URL，使用 `ImageUtils.ts` 中的工具函數

範例：
```vue
<template>
  <!-- 方式 1: 使用 MImage 元件 (推薦) -->
  <MImage :src="product.imageUrls[0]" />

  <!-- 方式 2: 手動組合 URL -->
  <img :src="getImageUrl(product.imageUrls[0])" />
</template>

<script setup lang="ts">
import MImage from '@/components/Frontend/MImage.vue';
import { getImageUrl } from '@/utils/ImageUtils';
</script>
```

### 環境變數說明
```properties
# VITE_BASE_API_URL - 前台 API 端點 (數據請求)
# VITE_BASE_API_URL2 - 後台 API 端點 (管理功能)
# VITE_BASE_API_URL3 - S3 圖片 CDN (靜態資源) ⭐ 圖片專用
```

---

## ✨ 遷移優勢

1. **效能提升**: 圖片從 CDN 載入，減輕 API 伺服器負擔
2. **擴展性**: S3 可輕鬆處理大量並發圖片請求
3. **一致性**: 前後台統一使用 S3 存儲圖片
4. **維護性**: 統一的 `ImageUtils` 工具函數，方便未來調整

---

## 📞 聯絡資訊

如有問題，請聯繫開發團隊。

**完成日期**: 2025-12-18
