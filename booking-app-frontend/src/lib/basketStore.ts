// src/lib/basketStore.ts
import { create } from 'zustand';

export interface BasketItem {
  service: {
    id: number | string;
    name: string;
    price: number;
    duration: number;
    expertId: number;
    appointmentType?: string;
    // Ajoutez d'autres propriétés si besoin
  };
  date: string; // format ISO (YYYY-MM-DD)
  time: string; // ex. "09:00"
}

interface BasketState {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (index: number) => void;
  clearBasket: () => void;
  total: () => number;
}

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) =>
    set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
  clearBasket: () => set({ items: [] }),
  total: () =>
    get().items.reduce((sum, item) => sum + Number(item.service.price), 0),
}));
