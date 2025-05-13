export const shippingOptions = [
  { name: '宅配', value: 'homeDelivery', price: 160 },
  { name: '7-11 超商取貨', value: 'sevenEleven', price: 60 },
  { name: '全家超商取貨', value: 'familyMart', price: 60 },
  { name: '中華郵政郵寄', value: 'postOffice', price: 100 },
];

export const paymentOptions = [
  { name: '信用卡一次付清', value: 1, priceType: 3 },
  { name: 'ATM虛擬帳號', value: 2, priceType: 3 },
  { name: '金幣付款', value: 98, priceType: 1 },
  { name: '銀幣付款', value: 99, priceType: 2 },
  { name: 'AFTEE先享後付', value: 4, priceType: 3 },
];

export const invoiceInfoOptionsData = [
  { value: '', label: '請選擇發票資訊' },
  { value: 'donation', label: '捐贈發票' },
  { value: 'mobileCarrier', label: '手機載具' },
  { value: 'personalEInvoice', label: '個人電子發票' },
  { value: 'uniformNumber', label: '統一編號' },
];
