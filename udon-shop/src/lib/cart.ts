import { Product } from './indexeddb'

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export class CartManager {
  private static readonly CART_KEY = 'udon-shop-cart';

  static getCart(): Cart {
    if (typeof window === 'undefined') {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }

    const cartData = localStorage.getItem(this.CART_KEY);
    if (!cartData) {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }

    try {
      const cart = JSON.parse(cartData);
      return this.calculateTotals(cart.items || []);
    } catch {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  }

  static addToCart(product: Product, quantity: number = 1): Cart {
    const cart = this.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product, quantity });
    }

    const updatedCart = this.calculateTotals(cart.items);
    this.saveCart(updatedCart);
    return updatedCart;
  }

  static removeFromCart(productId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.product.id !== productId);
    
    const updatedCart = this.calculateTotals(cart.items);
    this.saveCart(updatedCart);
    return updatedCart;
  }

  static updateQuantity(productId: string, quantity: number): Cart {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.product.id === productId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    const updatedCart = this.calculateTotals(cart.items);
    this.saveCart(updatedCart);
    return updatedCart;
  }

  static clearCart(): Cart {
    const emptyCart = { items: [], totalPrice: 0, totalItems: 0 };
    this.saveCart(emptyCart);
    return emptyCart;
  }

  private static calculateTotals(items: CartItem[]): Cart {
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      totalPrice,
      totalItems
    };
  }

  private static saveCart(cart: Cart): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    }
  }

  // Get cart item count for display
  static getCartItemCount(): number {
    return this.getCart().totalItems;
  }

  // Check if product is in cart
  static isInCart(productId: string): boolean {
    const cart = this.getCart();
    return cart.items.some(item => item.product.id === productId);
  }

  // Get quantity of specific product in cart
  static getProductQuantity(productId: string): number {
    const cart = this.getCart();
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}