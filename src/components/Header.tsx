import React from 'react';
import { RoleView, Order, User, CanteenSettings, AppearanceSettings } from '../types';
import { formatCurrency } from '../utils/formatters';
import { THEME_PALETTES, DEFAULT_APPEARANCE } from '../utils/appearance';
import {
  UtensilsCrossed,
  ChefHat,
  LayoutDashboard,
  ShoppingBag,
  BellRing,
  Sparkles,
  User as UserIcon,
  LogOut,
  Wallet,
  Megaphone,
  Palette,
  UserCog,
} from 'lucide-react';

interface HeaderProps {
  currentRole: RoleView;
  onRoleChange: (role: RoleView) => void;
  cartCount: number;
  onOpenCart: () => void;
  orders: Order[];
  onSelectOrderForTracking: (orderId: string) => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  canteenSettings: CanteenSettings;
  appearance: AppearanceSettings;
  onOpenAppearanceModal: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  cartCount,
  onOpenCart,
  orders,
  onSelectOrderForTracking,
  currentUser,
  onOpenAuthModal,
  onLogout,
  canteenSettings,
  appearance,
  onOpenAppearanceModal,
  onOpenProfileModal,
}) => {
  const safeAppearance = appearance || DEFAULT_APPEARANCE;
  const currentPalette = THEME_PALETTES[safeAppearance?.themeColor] || THEME_PALETTES.orange;

  // Find orders currently ready for pickup
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const pendingOrCookingCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'cooking'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Canteen Announcement Marquee / Banner if available */}
      {canteenSettings.announcement && (
        <div className="bg-amber-500 text-stone-900 px-4 py-1 text-xs font-bold flex items-center justify-between overflow-hidden border-b border-amber-600/20">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="inline-flex items-center gap-1 bg-white/40 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 font-extrabold">
              <Megaphone className="w-3 h-3" /> Thông báo
            </span>
            <p className="truncate text-xs">{canteenSettings.announcement}</p>
          </div>
          {canteenSettings.isHappyHourActive && (
            <span className="hidden sm:inline-block px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-black shrink-0 animate-pulse">
              🔥 GIỜ VÀNG GIẢM {canteenSettings.happyHourDiscountPercent}%
            </span>
          )}
        </div>
      )}

      {/* Top Banner for Ready Orders (Audio/Visual Canteen Callout) */}
      {readyOrders.length > 0 && (
        <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px]">
              <BellRing className="w-3.5 h-3.5 animate-bounce" /> LOA GỌI MÓN
            </span>
            <span className="text-emerald-100">Mời số thứ tự nhận tại quầy lấy thức ăn:</span>
            {readyOrders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  onRoleChange('customer');
                  onSelectOrderForTracking(ord.id);
                }}
                className="inline-flex items-center gap-1 bg-white text-emerald-900 font-extrabold px-2 py-0.5 rounded-md hover:bg-emerald-50 transition cursor-pointer shadow-xs"
              >
                #{ord.orderCode} ({ord.customerName})
              </button>
            ))}
          </div>
          <span className="hidden md:inline-block text-[11px] text-emerald-200">
            Giáp Căn Tin Live Queue
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-sm shrink-0 transition-colors ${currentPalette.logoBg}`}
            >
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-stone-900 whitespace-nowrap">
                  {canteenSettings.canteenName || 'GIÁP CĂN TIN'}
                </span>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${currentPalette.badge}`}
                >
                  <Sparkles className="w-3 h-3" /> {currentPalette.name}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 hidden md:block">
                Hệ thống Quản lý Thực đơn & Điều phối Hàng đợi
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher (Customer / Staff / Admin) */}
          <nav className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80 shrink-0">
            <button
              id="role-btn-customer"
              type="button"
              onClick={() => onRoleChange('customer')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                currentRole === 'customer'
                  ? `bg-white shadow-xs font-bold ${currentPalette.accentText}`
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Khách hàng</span>
              <span className="md:hidden">Khách</span>
            </button>

            <button
              id="role-btn-staff"
              type="button"
              onClick={() => onRoleChange('staff')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition relative cursor-pointer whitespace-nowrap ${
                currentRole === 'staff'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Bếp</span>
              {pendingOrCookingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                  {pendingOrCookingCount}
                </span>
              )}
            </button>

            <button
              id="role-btn-admin"
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                currentRole === 'admin'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Quản trị (Admin)</span>
              <span className="md:hidden">Admin</span>
            </button>
          </nav>

          {/* Right Area: Appearance Button + Cart Button + User Auth Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Appearance / Theme Customizer Button */}
            <button
              id="header-appearance-btn"
              type="button"
              onClick={onOpenAppearanceModal}
              title="Tùy biến hình nền đồ ăn & giao diện ứng dụng"
              className="relative inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition cursor-pointer border border-stone-200 shadow-2xs"
            >
              <span className="text-xs sm:text-sm leading-none">🍲</span>
              <span className="hidden md:inline">Hình nền & Giao diện</span>
              <span
                className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0 ml-0.5"
                style={{ backgroundColor: currentPalette.previewColor }}
              />
            </button>

            {currentRole === 'customer' && (
              <button
                id="header-cart-btn"
                type="button"
                onClick={onOpenCart}
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-white font-medium text-xs sm:text-sm active:scale-95 transition shadow-xs cursor-pointer ${currentPalette.primaryBg} ${currentPalette.primaryHover}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className={`bg-white text-xs font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center ${currentPalette.accentText}`}>
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Login State */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-100/90 hover:bg-stone-100 p-1 sm:p-1.5 rounded-2xl border border-stone-200 transition">
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  title="Chỉnh sửa tài khoản & thông tin cá nhân"
                  className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white shrink-0 group-hover:ring-2 group-hover:ring-orange-500 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-stone-900 text-white rounded-full p-0.5 shadow-xs opacity-0 group-hover:opacity-100 transition">
                      <UserCog className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="hidden md:block pr-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-stone-900 max-w-[90px] lg:max-w-[120px] truncate group-hover:text-orange-600 transition">
                        {currentUser.name}
                      </p>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                          currentUser.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : currentUser.role === 'staff'
                            ? 'bg-blue-100 text-blue-800'
                            : currentPalette.badge
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'staff' ? 'Nhân viên' : 'Khách'}
                      </span>
                    </div>
                    {currentUser.role === 'customer' ? (
                      <p className="text-[10px] text-emerald-700 font-bold hidden lg:flex items-center gap-1">
                        <Wallet className="w-2.5 h-2.5" /> {formatCurrency(currentUser.walletBalance)}
                      </p>
                    ) : currentUser.role === 'staff' ? (
                      <p className="text-[10px] text-blue-700 font-bold hidden lg:block">Nhân viên Bếp/Quầy</p>
                    ) : (
                      <p className="text-[10px] text-purple-700 font-bold hidden lg:block">Toàn quyền Quản lý</p>
                    )}
                  </div>
                </button>

                {/* Edit Profile Quick Action Button */}
                <button
                  id="user-edit-profile-btn"
                  type="button"
                  onClick={onOpenProfileModal}
                  title="Chỉnh sửa thông tin tài khoản"
                  className="p-1 sm:p-1.5 rounded-xl hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition cursor-pointer hidden sm:inline-flex"
                >
                  <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  id="user-logout-btn"
                  type="button"
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1 sm:p-1.5 rounded-xl hover:bg-stone-200/80 text-stone-500 hover:text-rose-600 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="sm:hidden flex items-center justify-around py-2 border-t border-stone-200/60 text-xs">
          <button
            type="button"
            onClick={() => onRoleChange('customer')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-bold ${
              currentRole === 'customer' ? currentPalette.badge : 'text-stone-600'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Khách hàng</span>
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('staff')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-bold ${
              currentRole === 'staff' ? 'bg-blue-100 text-blue-800' : 'text-stone-600'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Bếp ({pendingOrCookingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-bold ${
              currentRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'text-stone-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          {currentUser && (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1 py-1 px-2.5 rounded-lg font-bold text-stone-600 hover:text-stone-900"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Hồ sơ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
