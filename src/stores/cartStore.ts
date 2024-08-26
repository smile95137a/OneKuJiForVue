import { defineStore } from 'pinia';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  isSelected?: boolean;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cartStore', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state): number => {
      return state.items
        .filter((item) => item.isSelected)
        .reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice: (state): number => {
      return state.items
        .filter((item) => item.isSelected)
        .reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },

  actions: {
    addToCart(product: any, isSelected = true) {
      const item = this.items.find((item) => item.id === product.id);
      if (item) {
        item.quantity += 1;
      } else {
        this.items.push({
          ...product,
          quantity: 1,
          isSelected: isSelected,
        });
      }
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((item) => item.id !== productId);
    },
    toggleSelection(productId: number) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.isSelected = !item.isSelected;
      }
    },
    clearCart() {
      this.items = [];
    },
  },
});
