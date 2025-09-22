import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  cart = signal<CartItem[]>(JSON.parse(localStorage.getItem('angular-ecommerce-cart') || '[]'));
  
  itemCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));
  total = computed(() => this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0));

  constructor() {
    effect(() => {
      localStorage.setItem('angular-ecommerce-cart', JSON.stringify(this.cart()));
    });
  }

  addToCart(product: Product): void {
    this.cart.update(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  }
  /*
    addToCart_(product: Product): void { //e
    this.cart.update(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item => item == product ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  }
  */

  clearCart(): void {
    this.cart.set([]);
  }
}
