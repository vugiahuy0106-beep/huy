export type RoleView = 'customer' | 'staff' | 'admin';
export type UserRole = 'customer' | 'staff' | 'admin';

export type ThemeColor = 'orange' | 'emerald' | 'indigo' | 'amber' | 'rose';
export type CardDensity = 'spacious' | 'compact';
export type FontSize = 'normal' | 'large';

export interface AppearanceSettings {
  themeColor: ThemeColor;
  cardDensity: CardDensity;
  fontSize: FontSize;
  soundEnabled: boolean;
  highContrastMode: boolean;
  showCategoryIcons: boolean;
  bannerStyle: 'vibrant' | 'minimal';
  // Hình nền ứng dụng & Banner hình ảnh đồ ăn
  backgroundImage?: string;
  backgroundPreset?: string;
  backgroundOpacity?: number; // 0.1 to 0.9, default ~0.35
  backgroundBlur?: number; // 0 to 12px, default 1
  backgroundOverlay?: 'warm' | 'dark' | 'glass' | 'cream' | 'none';
  heroBannerImage?: string;
  heroBannerPreset?: string;
  showHeroImage?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  studentCode?: string; // Mã sinh viên / Mã nhân sự
  walletBalance: number; // Ví căn tin (VND)
  createdAt: string;
}

export interface CanteenSettings {
  isOpen: boolean;
  canteenName: string;
  announcement: string;
  takeawayFee: number; // Phí hộp mang đi
  breakfastHours: string;
  lunchHours: string;
  snackHours: string;
  autoAcceptOrders: boolean;
  happyHourDiscountPercent: number;
  isHappyHourActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  prepTimeMinutes: number;
  rating: number;
  salesCount: number;
  tags: string[];
}

export interface CartItem {
  menuItemId: string;
  item: MenuItem;
  quantity: number;
  note?: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'qr' | 'wallet';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. #CT-101
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string; // ISO string
  updatedAt: string;
  estimatedMinutes: number;
  note?: string;
  tableOrPickupType: 'dine_in' | 'takeaway';
  rating?: number;
  reviewComment?: string;
}
