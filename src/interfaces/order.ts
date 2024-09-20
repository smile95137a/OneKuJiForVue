export enum OrderStatus {
  PREPARING_SHIPMENT = "PREPARING_SHIPMENT",
  SHIPPED = "SHIPPED"
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  bonusPointsEarned: number | null;
  bonusPointsUsed: number | null;
  status: string;  // 將 status 改為 string
  paymentMethod: string | null;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string | null;
  paidAt: string | null;
  notes: string | null;
}

export interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  storeProductId: number;
  storeProductName: string;
  productDetailName: string;
  quantity: number;
  unitPrice: number;
  resultStatus: string;
  resultItemId: number;
  bonusPointsEarned: number | null;
}
