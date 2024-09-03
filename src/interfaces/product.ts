export interface ProductReq {
    productId?: number;
    productName: string;
    description: string;
    price: number;
    stockQuantity: number;
    soldQuantity: number;
    startDate: string;
    endDate: string;
    productType: 'PRIZE' | 'BLIND_BOX' | 'GACHA';
    prizeCategory?: 'FIGURE' | 'C3' | 'BONUS';
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'NOT_AVAILABLE_YET' | 'SOLD_OUT';
    imageUrls?: string[];
  }
  
  export interface ProductRes extends ProductReq {
    productId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiResponse<T> {
    code: number;
    message: string | null;
    data: T | null;
  }