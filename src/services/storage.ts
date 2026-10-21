import {
  Category,
  CustomOrderRequest,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  StoreSettings,
} from '../types';
import { defaultStoreSettings, initialCategories, initialProducts } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'sg_products_v1',
  CATEGORIES: 'sg_categories_v1',
  ORDERS: 'sg_orders_v1',
  CUSTOM_ORDERS: 'sg_custom_orders_v1',
  SETTINGS: 'sg_settings_v1',
  CART: 'sg_customer_cart_v1',
  AREA: 'sg_selected_area_v1',
};

type Listener = () => void;
const listeners: { [key: string]: Set<Listener> } = {
  products: new Set(),
  categories: new Set(),
  orders: new Set(),
  settings: new Set(),
  cart: new Set(),
};

function notify(channel: 'products' | 'categories' | 'orders' | 'settings' | 'cart') {
  listeners[channel]?.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Error in storage listener callback:', e);
    }
  });
}

// ---------------- PRODUCTS ----------------
export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse products from localStorage:', err);
    return initialProducts;
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id);
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  notify('products');
}

export function addProduct(newProduct: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const id = 'p-' + Date.now();
  const product: Product = {
    ...newProduct,
    id,
    stock: Number(newProduct.stock) || 0,
    price: Number(newProduct.price) || 0,
    originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 0,
    discountPercent:
      newProduct.originalPrice && newProduct.originalPrice > newProduct.price
        ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
        : 0,
    inStock: Number(newProduct.stock) > 0,
  };
  products.unshift(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];
  const updatedPrice = updates.price !== undefined ? Number(updates.price) : current.price;
  const updatedOriginalPrice =
    updates.originalPrice !== undefined ? Number(updates.originalPrice) : current.originalPrice;
  const stock = updates.stock !== undefined ? Number(updates.stock) : current.stock;

  const discountPercent =
    updatedOriginalPrice > updatedPrice
      ? Math.round(((updatedOriginalPrice - updatedPrice) / updatedOriginalPrice) * 100)
      : 0;

  const inStock = updates.inStock !== undefined ? updates.inStock : stock > 0;

  products[index] = {
    ...current,
    ...updates,
    price: updatedPrice,
    originalPrice: updatedOriginalPrice,
    discountPercent,
    stock,
    inStock,
  };

  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length !== products.length) {
    saveProducts(filtered);
    return true;
  }
  return false;
}

// ---------------- CATEGORIES ----------------
export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
      return initialCategories;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse categories from localStorage:', err);
    return initialCategories;
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  notify('categories');
}

export function addCategory(newCat: Omit<Category, 'id'>): Category {
  const categories = getCategories();
  const id = 'cat-' + Date.now();
  const category: Category = {
    ...newCat,
    id,
    order: categories.length + 1,
    isVisible: newCat.isVisible ?? true,
  };
  categories.push(category);
  saveCategories(categories);
  return category;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = { ...categories[index], ...updates };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length !== categories.length) {
    saveCategories(filtered);
    return true;
  }
  return false;
}

// ---------------- STORE SETTINGS ----------------
export function getStoreSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultStoreSettings));
      return defaultStoreSettings;
    }
    return { ...defaultStoreSettings, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to parse store settings from localStorage:', err);
    return defaultStoreSettings;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notify('settings');
}

// ---------------- ORDERS ----------------
export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      // Seed with 2 demo orders for owner review
      const demoOrders: Order[] = [
        {
          id: 'ord-1001',
          orderNumber: 'SG-1001',
          customer: {
            name: 'Priyanka Mohapatra',
            phone: '9861012345',
            whatsapp: '9861012345',
            address: 'Plot 42, Jagannath Vihar, Near Old Bus Stand',
            area: 'Khordha',
            landmark: 'Near Jagannath Temple',
            instructions: 'Please call before arriving.',
          },
          items: [
            {
              productId: 'p-rc-01',
              name: 'India Gate Basmati Rice Feast Rozzana',
              brand: 'India Gate',
              weight: '5 kg',
              price: 440,
              quantity: 1,
              itemTotal: 440,
            },
            {
              productId: 'p-oil-01',
              name: 'Fortune Kachi Ghani Pure Mustard Oil',
              brand: 'Fortune',
              weight: '1 Litre',
              price: 155,
              quantity: 2,
              itemTotal: 310,
            },
            {
              productId: 'p-spc-01',
              name: 'Tata Salt Vacuum Evaporated Iodized Salt',
              brand: 'Tata Salt',
              weight: '1 kg',
              price: 28,
              quantity: 1,
              itemTotal: 28,
            },
          ],
          subtotal: 778,
          deliveryCharge: 0, // free above 499
          finalTotal: 778,
          status: 'Confirmed',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          source: 'whatsapp',
        },
        {
          id: 'ord-1002',
          orderNumber: 'SG-1002',
          customer: {
            name: 'Rajesh Kumar Das',
            phone: '9437198765',
            whatsapp: '9437198765',
            address: 'Quarter 112/B, Railway Colony, Near Main Market',
            area: 'Jatani',
            landmark: 'Near Railway Health Centre',
          },
          items: [
            {
              productId: 'p-veg-01',
              name: 'Fresh Potato (Aloo)',
              brand: 'Farm Fresh',
              weight: '1 kg',
              price: 32,
              quantity: 2,
              itemTotal: 64,
            },
            {
              productId: 'p-veg-02',
              name: 'Fresh Onion (Pyaz)',
              brand: 'Farm Fresh',
              weight: '1 kg',
              price: 45,
              quantity: 2,
              itemTotal: 90,
            },
            {
              productId: 'p-dry-01',
              name: 'Amul Taaza Homogenised Toned Milk',
              brand: 'Amul',
              weight: '500 ml',
              price: 27,
              quantity: 2,
              itemTotal: 54,
            },
          ],
          subtotal: 208,
          deliveryCharge: 35,
          finalTotal: 243,
          status: 'Pending',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
          source: 'whatsapp',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
      return demoOrders;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse orders:', err);
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  notify('orders');
}

/**
 * Validates prices against the database, checks stock, and commits order safely.
 */
export function createValidatedOrder(
  customer: Order['customer'],
  cartItems: { productId: string; quantity: number }[],
  source: 'whatsapp' | 'web' = 'whatsapp',
  customNotes?: string
): { success: boolean; order?: Order; error?: string } {
  const currentProducts = getProducts();
  const settings = getStoreSettings();

  const validatedItems: OrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const item of cartItems) {
    const product = currentProducts.find((p) => p.id === item.productId);
    if (!product) {
      return { success: false, error: `Product ${item.productId} was not found in the catalog.` };
    }
    if (product.status !== 'active') {
      return { success: false, error: `"${product.name}" is currently unavailable.` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Only ${product.stock} units of "${product.name}" available in stock.`,
      };
    }

    const itemTotal = product.price * item.quantity;
    calculatedSubtotal += itemTotal;

    validatedItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      weight: product.weight,
      price: product.price,
      quantity: item.quantity,
      itemTotal,
    });
  }

  if (calculatedSubtotal < settings.minimumOrderAmount) {
    return {
      success: false,
      error: `Minimum order amount is ₹${settings.minimumOrderAmount}. Current subtotal is ₹${calculatedSubtotal}.`,
    };
  }

  // Calculate delivery charge based on area rules
  const areaConfig = settings.serviceAreas.find((a) => a.name === customer.area && a.enabled);
  if (!areaConfig) {
    return {
      success: false,
      error: `Delivery to ${customer.area} is currently not available.`,
    };
  }

  const deliveryCharge =
    calculatedSubtotal >= areaConfig.freeDeliveryAbove ? 0 : areaConfig.deliveryCharge;
  const finalTotal = calculatedSubtotal + deliveryCharge;

  // Deduct stock
  const updatedProducts = currentProducts.map((p) => {
    const purchased = cartItems.find((ci) => ci.productId === p.id);
    if (purchased) {
      const newStock = Math.max(0, p.stock - purchased.quantity);
      return {
        ...p,
        stock: newStock,
        inStock: newStock > 0,
      };
    }
    return p;
  });
  saveProducts(updatedProducts);

  // Generate order number
  const orderCount = getOrders().length + 1003;
  const orderNumber = `SG-${orderCount}`;

  const order: Order = {
    id: 'ord-' + Date.now(),
    orderNumber,
    customer,
    items: validatedItems,
    subtotal: calculatedSubtotal,
    deliveryCharge,
    finalTotal,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source,
    customNotes,
  };

  const existingOrders = getOrders();
  existingOrders.unshift(order);
  saveOrders(existingOrders);

  return { success: true, order };
}

export function updateOrderStatus(id: string, status: OrderStatus): boolean {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return false;

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  saveOrders(orders);
  return true;
}

// ---------------- CUSTOM ORDERS ----------------
export function getCustomOrders(): CustomOrderRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load custom orders:', err);
    return [];
  }
}

export function saveCustomOrder(order: Omit<CustomOrderRequest, 'id' | 'createdAt' | 'status'>): CustomOrderRequest {
  const list = getCustomOrders();
  const newOrder: CustomOrderRequest = {
    ...order,
    id: 'custom-' + Date.now(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  list.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(list));
  return newOrder;
}

export function updateCustomOrderStatus(id: string, status: CustomOrderRequest['status']): boolean {
  const list = getCustomOrders();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return false;
  list[index].status = status;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(list));
  return true;
}

// ---------------- SUBSCRIPTIONS ----------------
export function subscribeToProducts(callback: Listener): () => void {
  listeners.products.add(callback);
  return () => {
    listeners.products.delete(callback);
  };
}

export function subscribeToCategories(callback: Listener): () => void {
  listeners.categories.add(callback);
  return () => {
    listeners.categories.delete(callback);
  };
}

export function subscribeToOrders(callback: Listener): () => void {
  listeners.orders.add(callback);
  return () => {
    listeners.orders.delete(callback);
  };
}

export function subscribeToSettings(callback: Listener): () => void {
  listeners.settings.add(callback);
  return () => {
    listeners.settings.delete(callback);
  };
}

// ---------------- RESET TO FACTORY SEED ----------------
export function resetToSeedData(): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultStoreSettings));
  notify('products');
  notify('categories');
  notify('settings');
}
