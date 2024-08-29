import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isSelected?: boolean;
}

export const useCartStore = defineStore('cartStore', () => {
  const items = ref<CartItem[]>([]);

  const totalItems = computed(() =>
    items.value.reduce(
      (total, item) => (item.isSelected ? total + item.quantity : total),
      0
    )
  );

  const totalPrice = computed(() =>
    items.value.reduce(
      (total, item) =>
        item.isSelected ? total + item.price * item.quantity : total,
      0
    )
  );

  const addToCart = (product: CartItem, isSelected = true) => {
    const item = items.value.find((item) => item.id === product.id);
    if (item) {
      item.quantity += product.quantity;
    } else {
      items.value.push({ ...product, isSelected });
    }
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const toggleSelection = (productId: number) => {
    const item = items.value.find((item) => item.id === productId);
    if (item) {
      item.isSelected = !item.isSelected;
    }
  };

  const clearCart = () => {
    items.value.length = 0;
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    toggleSelection,
    clearCart,
  };
});
