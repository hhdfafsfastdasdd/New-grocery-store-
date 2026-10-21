export type AreaName = 'Khordha' | 'Jatani';

export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  weight: string;
  unit: 'kg' | 'g' | 'litre' | 'ml' | 'pack' | 'pieces';
  stock: number;
  inStock: boolean;
  description: string;
  status: ProductStatus;
  featured: boolean;
  imageUrl: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName: string;
  isVisible: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: AreaName;
  landmark?: string;
  instructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  source: 'whatsapp' | 'web';
  customNotes?: string;
}

export interface CustomOrderRequest {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: AreaName;
  requestedItems: string;
  additionalRequirements?: string;
  status: 'Pending' | 'Contacted' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
}

export interface DeliveryAreaConfig {
  name: AreaName;
  displayName: string;
  deliveryCharge: number;
  freeDeliveryAbove: number;
  enabled: boolean;
  estimatedTime: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  ownerWhatsApp: string; // international digits without +, e.g. 919437001234
  contactPhone: string;
  email: string;
  storeAddress: string;
  serviceAreas: DeliveryAreaConfig[];
  minimumOrderAmount: number;
  openingHours: string;
  announcement: string;
  announcementActive: boolean;
  currencySymbol: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface AdminSession {
  isAuthenticated: boolean;
  email: string;
  loginTime: string;
  role: 'owner' | 'manager';
}
