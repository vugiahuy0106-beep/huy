import { AppearanceSettings, ThemeColor } from '../types';
import foodCanteenBg from '../assets/images/food_canteen_bg_1789459578268.jpg';
import foodBanquetBg from '../assets/images/food_banquet_bg_1789459642498.jpg';
import foodCafeBg from '../assets/images/food_cafe_bg_1789459669305.jpg';
import canteenHeroBanner from '../assets/images/canteen_hero_banner_1789459609743.jpg';

export interface FoodBackgroundPreset {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  tag: string;
}

export const FOOD_BACKGROUND_PRESETS: FoodBackgroundPreset[] = [
  {
    id: 'canteen_default',
    name: 'Mâm Cơm Căn Tin',
    subtitle: 'Phở bò, bánh mì kẹp & rau thơm ấm cúng',
    url: foodCanteenBg,
    tag: 'Đề xuất',
  },
  {
    id: 'banquet_feast',
    name: 'Đại Tiệc Ẩm Thực',
    subtitle: 'Mâm cỗ Á Đông sum vầy, món truyền thống',
    url: foodBanquetBg,
    tag: 'Rực rỡ',
  },
  {
    id: 'cafe_desserts',
    name: 'Trà Sữa & Bánh Ngọt',
    subtitle: 'Sandwich, matcha & điểm tâm nhẹ tươi mới',
    url: foodCafeBg,
    tag: 'Trẻ trung',
  },
  {
    id: 'warm_wood_table',
    name: 'Bàn Gỗ Mộc Mạc',
    subtitle: 'Bàn ăn gỗ tự nhiên với gia vị và rau củ tươi',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80',
    tag: 'Tự nhiên',
  },
  {
    id: 'viet_street_food',
    name: 'Phố Ẩm Thực Nhộn Nhịp',
    subtitle: 'Hương vị món đường phố Sài Gòn & Hà Nội',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
    tag: 'Đậm vị',
  },
];

export interface HeroBannerPreset {
  id: string;
  name: string;
  subtitle: string;
  url: string;
}

export const HERO_BANNER_PRESETS: HeroBannerPreset[] = [
  {
    id: 'canteen_counter',
    name: 'Quầy Bếp Căn Tin Hiện Đại',
    subtitle: 'Đầu bếp phục vụ nóng hổi và khay đồ ăn thơm lừng',
    url: canteenHeroBanner,
  },
  {
    id: 'banquet_spread',
    name: 'Bàn Tiệc Ẩm Thực Hấp Dẫn',
    subtitle: 'Sắc màu món ăn rực rỡ thu hút thị giác',
    url: foodBanquetBg,
  },
  {
    id: 'cafe_spread',
    name: 'Quầy Bánh & Nước Uống Sinh Viên',
    subtitle: 'Tươi sáng, năng động và tràn đầy cảm hứng',
    url: foodCafeBg,
  },
  {
    id: 'street_market',
    name: 'Góc Ẩm Thực Học Đường',
    subtitle: 'Thân quen, ấm áp như bữa cơm gia đình',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  themeColor: 'orange',
  cardDensity: 'spacious',
  fontSize: 'normal',
  soundEnabled: true,
  highContrastMode: false,
  showCategoryIcons: true,
  bannerStyle: 'vibrant',
  backgroundImage: foodCanteenBg,
  backgroundPreset: 'canteen_default',
  backgroundOpacity: 0.35,
  backgroundBlur: 1,
  backgroundOverlay: 'warm',
  heroBannerImage: canteenHeroBanner,
  heroBannerPreset: 'canteen_counter',
  showHeroImage: true,
};

export interface ThemePalette {
  id: ThemeColor;
  name: string;
  badgeLabel: string;
  previewColor: string;
  primaryBg: string;
  primaryHover: string;
  primaryLight: string;
  primaryText: string;
  primaryBorder: string;
  accentText: string;
  badge: string;
  logoBg: string;
  glow: string;
  heroGradient: string;
}

export const THEME_PALETTES: Record<ThemeColor, ThemePalette> = {
  orange: {
    id: 'orange',
    name: 'Cam Căn Tin',
    badgeLabel: 'Cổ Điển',
    previewColor: '#ea580c',
    primaryBg: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryLight: 'bg-orange-50 text-orange-800 border-orange-200',
    primaryText: 'text-orange-600',
    primaryBorder: 'border-orange-500',
    accentText: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    logoBg: 'bg-orange-600 shadow-orange-200',
    glow: 'shadow-orange-500/20',
    heroGradient: 'from-orange-600 via-amber-600 to-rose-600',
  },
  emerald: {
    id: 'emerald',
    name: 'Xanh Mint Tươi',
    badgeLabel: 'Tươi Sạch',
    previewColor: '#059669',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    primaryText: 'text-emerald-600',
    primaryBorder: 'border-emerald-500',
    accentText: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    logoBg: 'bg-emerald-600 shadow-emerald-200',
    glow: 'shadow-emerald-500/20',
    heroGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  indigo: {
    id: 'indigo',
    name: 'Tím Indigo',
    badgeLabel: 'Hiện Đại',
    previewColor: '#4f46e5',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    primaryLight: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    primaryText: 'text-indigo-600',
    primaryBorder: 'border-indigo-500',
    accentText: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    logoBg: 'bg-indigo-600 shadow-indigo-200',
    glow: 'shadow-indigo-500/20',
    heroGradient: 'from-indigo-600 via-purple-600 to-pink-600',
  },
  amber: {
    id: 'amber',
    name: 'Vàng Hổ Phách',
    badgeLabel: 'Ấm Áp',
    previewColor: '#d97706',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    primaryLight: 'bg-amber-50 text-amber-900 border-amber-200',
    primaryText: 'text-amber-700',
    primaryBorder: 'border-amber-500',
    accentText: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    logoBg: 'bg-amber-600 shadow-amber-200',
    glow: 'shadow-amber-500/20',
    heroGradient: 'from-amber-600 via-orange-600 to-yellow-600',
  },
  rose: {
    id: 'rose',
    name: 'Hồng San Hô',
    badgeLabel: 'Trẻ Trung',
    previewColor: '#e11d48',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryLight: 'bg-rose-50 text-rose-800 border-rose-200',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-500',
    accentText: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    logoBg: 'bg-rose-600 shadow-rose-200',
    glow: 'shadow-rose-500/20',
    heroGradient: 'from-rose-600 via-pink-600 to-purple-600',
  },
};

export const PRESET_AVATARS = [
  {
    id: 'av-1',
    label: 'Nam Sinh viên',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-2',
    label: 'Nữ Sinh viên',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-3',
    label: 'Cán bộ / Quản lý',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-4',
    label: 'Nữ Cán bộ',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-5',
    label: 'Năng động',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-6',
    label: 'Đầu bếp Căn tin',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];
