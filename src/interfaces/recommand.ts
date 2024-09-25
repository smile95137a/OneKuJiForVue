export interface ProductRecommendationMapping {
    id: number;
    storeProductId: number;
    storeProductRecommendationId: number;
    createdDate: string;
    updatedDate: string;
    createdUser: string;
    updateUser: string;
    productName:string;
    recommendationName:string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    success: boolean;
    data: T;
}

export interface StoreProductRecommendation {
    id: number; // 推薦類別唯一識別碼
    recommendationName: string; // 推薦名稱
    createdDate: string; // 創建時間，使用 ISO 字符串格式
    updatedDate: string; // 更新時間，使用 ISO 字符串格式
    createdUser: string; // 創建用戶 ID
    updateUser: string; // 更新用戶 ID
}