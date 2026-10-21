import { AreaName, CartItem, Product } from '../types';
import { getProductById } from './storage';

const CART_STORAGE_KEY = 'sg_cart_items_v1';
const AREA_STORAGE_KEY = 'sg_customer_area_v1';

type CartListener = (items: CartItem[]) => void;
const cartListeners = new Set<CartListener>();

function notifyCart(items: CartItem[]) {
  cartListeners.forEach((fn) => {
    try {
      fn(items);
    } catch (e) {
      console.error('Error notifying cart listener:', e);
    }
  });
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const items: { productId: string; quantity: number }[] = JSON.parse(raw);

    // Refresh products with live stock and current price
    const validItems: CartItem[] = [];
    for (const item of items) {
      const product = getProductById(item.productId);
      if (product && product.status === 'active') {
        const qty = Math.min(item.quantity, Math.max(1, product.stock));
        if (product.stock > 0) {
          validItems.push({ product, quantity: qty });
        }
      }
    }
    return validItems;
  } catch (err) {
    console.error('Failed to read cart:', err);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  const simplified = items.map((i) => ({
    productId: i.product.id,
    quantity: i.quantity,
  }));
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(simplified));
  notifyCart(items);
}

export function addToCart(product: Product, quantity = 1): { success: boolean; message: string } {
  if (!product.inStock || product.stock <= 0) {
    return { success: false, message: 'This product is out of stock.' };
  }

  const cart = getCart();
  const existing = cart.find((i) => i.product.id === product.id);

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      return {
        success: false,
        message: `Maximum available stock is ${product.stock} units.`,
      };
    }
    existing.quantity = newQty;
  } else {
    if (quantity > product.stock) {
      return {
        success: false,
        message: `Only ${product.stock} units available in stock.`,
      };
    }
    cart.push({ product, quantity });
  }

  saveCart(cart);
  return { success: true, message: `Added ${product.name} to cart.` };
}

export function updateCartQuantity(productId: string, quantity: number): void {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((i) => i.product.id !== productId);
  } else {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = Math.min(quantity, item.product.stock);
    }
  }
  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter((i) => i.product.id !== productId);
  saveCart(cart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
  notifyCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function subscribeToCart(listener: CartListener): () => void {
  cartListeners.add(listener);
  return () => {
    cartListeners.delete(listener);
  };
}

// ---------------- DELIVERY AREA PREFERENCE ----------------
export function getSelectedArea(): AreaName {
  const saved = localStorage.getItem(AREA_STORAGE_KEY);
  if (saved === 'Khordha' || saved === 'Jatani') {
    return saved;
  }
  return 'Khordha';
}

export function setSelectedArea(area: AreaName): void {
  localStorage.setItem(AREA_STORAGE_KEY, area);
}
