/**
 * 圖片 URL 工具函數
 * 統一處理所有前台圖片從 S3 (VITE_BASE_API_URL3) 載入
 */

// 改用 S3 圖片 CDN (VITE_BASE_API_URL3)
const IMAGE_BASE_URL = import.meta.env.VITE_BASE_API_URL3 as string;

/**
 * 將後端返回的圖片路徑轉換為完整的 S3 URL
 * @param imagePath - 後端返回的相對路徑，例如: "/xxx.jpg" 或 "xxx.jpg"
 * @returns 完整的 S3 圖片 URL
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // 確保路徑以 / 開頭
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // 移除 baseUrl 結尾的 / (如果有)
  const normalizedBase = IMAGE_BASE_URL.endsWith('/') 
    ? IMAGE_BASE_URL.slice(0, -1) 
    : IMAGE_BASE_URL;
  
  return `${normalizedBase}${normalizedPath}`;
};

/**
 * 處理圖片陣列，將所有路徑轉換為完整 URL
 * @param imagePaths - 圖片路徑陣列
 * @returns 完整 URL 陣列
 */
export const getImageUrls = (imagePaths: string[] | null | undefined): string[] => {
  if (!imagePaths || imagePaths.length === 0) return [];
  return imagePaths.map(path => getImageUrl(path));
};

/**
 * 取得產品的第一張圖片 URL（用於列表顯示）
 * @param imageUrls - 圖片路徑陣列
 * @returns 第一張圖片的完整 URL，若無則返回空字串
 */
export const getFirstImageUrl = (imageUrls: string[] | null | undefined): string => {
  if (!imageUrls || imageUrls.length === 0) return '';
  return getImageUrl(imageUrls[0]);
};

/**
 * 檢查是否為有效的圖片 URL
 * @param url - 要檢查的 URL
 * @returns 是否為有效的圖片 URL
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};
