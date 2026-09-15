import React, { useState, useEffect } from 'react';
import { Category, MenuItem, CartItem, Order, PaymentMethod, User, CanteenSettings, AppearanceSettings } from '../../types';
import { formatCurrency, getStatusDetails, formatTime } from '../../utils/formatters';
import { THEME_PALETTES, DEFAULT_APPEARANCE } from '../../utils/appearance';
import { VirtualQRCodeCard } from './VirtualQRCodeCard';
import {
  Search,
  Clock,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  QrCode,
  Wallet,
  Banknote,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Flame,
  X,
  History,
  Info,
  AlertTriangle,
  Palette,
  Sliders,
  UserCog,
} from 'lucide-react';

interface CustomerPortalProps {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  isCartOpen: boolean;
  onCloseCart: () => void;
  onAddToCart: (item: MenuItem, note?: string) => void;
  onUpdateCartQty: (menuItemId: string, delta: number) => void;
  onRemoveFromCart: (menuItemId: string) => void;
  onClearCart: () => void;
  onCreateOrder: (
    customerName: string,
    customerPhone: string,
    tableOrPickupType: 'dine_in' | 'takeaway',
    paymentMethod: PaymentMethod,
    note?: string
  ) => Order;
  activeTrackingOrderId: string | null;
  onSelectOrderForTracking: (orderId: string | null) => void;
  onSubmitReview: (orderId: string, rating: number, comment: string) => void;
  currentUser: User | null;
  canteenSettings: CanteenSettings;
  appearance: AppearanceSettings;
  onOpenAppearanceModal: () => void;
  onOpenProfileModal: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  categories,
  menuItems,
  orders,
  cart,
  isCartOpen,
  onCloseCart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onCreateOrder,
  activeTrackingOrderId,
  onSelectOrderForTracking,
  onSubmitReview,
  currentUser,
  canteenSettings,
  appearance,
  onOpenAppearanceModal,
  onOpenProfileModal,
}) => {
  const safeAppearance = appearance || DEFAULT_APPEARANCE;
  const currentPalette = THEME_PALETTES[safeAppearance?.themeColor] || THEME_PALETTES.orange;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>(
    currentUser ? currentUser.name : 'Vũ Gia Huy'
  );
  const [customerPhone, setCustomerPhone] = useState<string>(
    currentUser ? currentUser.phone : '0912345678'
  );
  const [pickupType, setPickupType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [orderNote, setOrderNote] = useState<string>('');
  const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);

  // Keep customer details synced with profile updates
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Review modal state
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Active tracking order (if selected or default to the most recent customer order)
  const activeOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  const takeawayFeeAmount = pickupType === 'takeaway' ? (canteenSettings?.takeawayFee || 0) : 0;
  const finalPayTotal = cartTotal + takeawayFeeAmount;
  const isWalletInsufficient =
    paymentMethod === 'wallet' && currentUser && currentUser.walletBalance < finalPayTotal;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canteenSettings.isOpen) return;
    if (!customerName.trim()) return;
    if (isWalletInsufficient) return;
    const newOrder = onCreateOrder(customerName, customerPhone, pickupType, paymentMethod, orderNote);
    setIsCheckoutOpen(false);
    onCloseCart();
    onSelectOrderForTracking(newOrder.id);
    if (paymentMethod === 'qr') {
      setQrModalOrder(newOrder);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewOrderId) {
      onSubmitReview(reviewOrderId, reviewRating, reviewComment);
      setReviewOrderId(null);
      setReviewComment('');
    }
  };

  return (
    <div className={`space-y-6 pb-32 ${safeAppearance.fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
      {/* Banner Căn tin & Trạng thái live with dynamic food hero banner */}
      <div className="relative overflow-hidden rounded-3xl text-white p-6 sm:p-8 shadow-md transition-all duration-300 border border-white/20">
        {/* Background Food Banner Image */}
        {safeAppearance.showHeroImage !== false && safeAppearance.heroBannerImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={safeAppearance.heroBannerImage}
              alt="Căn tin Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Theme Gradient tint & dark overlay for high contrast readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentPalette.heroGradient} opacity-85 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
          </div>
        )}

        {/* Fallback theme gradient if hero image is turned off */}
        {(!safeAppearance.showHeroImage || !safeAppearance.heroBannerImage) && (
          <div className={`absolute inset-0 bg-gradient-to-r ${currentPalette.heroGradient}`} />
        )}

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-300" /> Căn tin mở cửa 06:30 - 18:30 hàng ngày
            </div>
            {canteenSettings.isHappyHourActive && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse shadow-xs">
                🔥 Giờ vàng giảm {canteenSettings.happyHourDiscountPercent}%
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 drop-shadow-sm">
            Đặt món trực tuyến - Gọi số thứ tự tại quầy
          </h1>
          <p className="text-white/95 text-xs sm:text-sm leading-relaxed drop-shadow-xs">
            Chọn món ăn thơm ngon, thanh toán thuận tiện qua Ví sinh viên hoặc VietQR. Hệ thống hiển thị tiến trình nấu và số thứ tự nhận món trực tiếp!
          </p>
        </div>

        {/* Quick customization & info buttons */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/25 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-white/95">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-300" /> Chuẩn bị trung bình: <strong>5 - 8 phút</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <QrCode className="w-3.5 h-3.5 text-amber-300" /> Hỗ trợ VietQR, Ví & Tiền mặt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAppearanceModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 text-white font-bold backdrop-blur-md transition cursor-pointer shadow-xs border border-white/20 hover:scale-105 active:scale-95"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Đổi hình nền & Giao diện</span>
            </button>
            {currentUser && (
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-md transition cursor-pointer shadow-xs border border-white/15"
              >
                <UserCog className="w-3.5 h-3.5" />
                <span>Sửa thông tin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Order Live Tracker Banner (If customer has an order) */}
      {activeOrder && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs transition hover:border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-lg">
                #{activeOrder.orderCode}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-base">
                    Đơn hàng #{activeOrder.orderCode} - {activeOrder.customerName}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      getStatusDetails(activeOrder.status).badgeClass
                    }`}
                  >
                    {getStatusDetails(activeOrder.status).label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Đặt lúc: {formatTime(activeOrder.createdAt)} •{' '}
                  {activeOrder.tableOrPickupType === 'dine_in' ? 'Ăn tại chỗ' : 'Mang đi'} •{' '}
                  {activeOrder.items.length} món ({formatCurrency(activeOrder.totalAmount)})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeOrder.paymentMethod === 'qr' && (
                <button
                  id="view-active-order-qr-btn"
                  type="button"
                  onClick={() => setQrModalOrder(activeOrder)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Mở mã VietQR chuyển khoản"
                >
                  <QrCode className="w-3.5 h-3.5 text-orange-600" />
                  <span>Mã VietQR</span>
                </button>
              )}
              {activeOrder.status === 'completed' && !activeOrder.rating && (
                <button
                  type="button"
                  onClick={() => setReviewOrderId(activeOrder.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" /> Đánh giá món
                </button>
              )}
              {activeOrder.status === 'ready' && (
                <div className="px-3 py-1.5 text-xs font-extrabold rounded-lg bg-emerald-600 text-white animate-bounce flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Mời đến quầy lấy ngay!
                </div>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-4 pt-1">
            <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-bold text-stone-500 mb-2 gap-1">
              <span className={activeOrder.status !== 'cancelled' ? `${currentPalette.accentText} font-bold truncate` : 'truncate'}>
                1. Đã đặt
              </span>
              <span
                className={`truncate ${
                  ['cooking', 'ready', 'completed'].includes(activeOrder.status)
                    ? 'text-blue-600 font-bold'
                    : ''
                }`}
              >
                2. Đang nấu
              </span>
              <span
                className={`truncate ${
                  ['ready', 'completed'].includes(activeOrder.status)
                    ? 'text-emerald-600 font-bold'
                    : ''
                }`}
              >
                3. Sẵn sàng
              </span>
              <span
                className={`truncate ${
                  activeOrder.status === 'completed' ? 'text-stone-800 font-bold' : ''
                }`}
              >
                4. Đã nhận
              </span>
            </div>

            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  activeOrder.status === 'pending'
                    ? 'w-1/4 bg-amber-500'
                    : activeOrder.status === 'cooking'
                    ? 'w-2/4 bg-blue-500'
                    : activeOrder.status === 'ready'
                    ? 'w-3/4 bg-emerald-500 animate-pulse'
                    : activeOrder.status === 'completed'
                    ? 'w-full bg-stone-700'
                    : 'w-0'
                }`}
              />
            </div>

            {/* Item breakdown preview */}
            <div className="mt-3 text-xs text-stone-600 flex flex-wrap items-center gap-2">
              <span className="font-medium text-stone-500">Món trong đơn:</span>
              {activeOrder.items.map((i, idx) => (
                <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                  {i.quantity}x {i.name}
                  {i.note && <span className={`${currentPalette.accentText} italic`}> ({i.note})</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Filters, Layout Density and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? `${currentPalette.primaryBg} text-white shadow-xs`
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Tất cả thực đơn
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? `${currentPalette.primaryBg} text-white shadow-xs`
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right tools: Density toggle button & Search Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAppearanceModal}
            title="Đổi màu sắc & bố cục hiển thị"
            className="p-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-700 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Sliders className="w-4 h-4 text-stone-600" />
            <span className="text-xs font-semibold hidden sm:inline">
              {safeAppearance.cardDensity === 'compact' ? 'Gọn gàng' : 'Thoáng đãng'}
            </span>
          </button>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm món ăn, phở, bún, đồ uống..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dishes Grid - Adapts to appearance.cardDensity and highContrastMode */}
      <div
        className={`grid ${
          safeAppearance.cardDensity === 'compact'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
        }`}
      >
        {filteredItems.map((item) => {
          const inCartItem = cart.find((c) => c.menuItemId === item.id);
          const isCompact = safeAppearance.cardDensity === 'compact';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden flex flex-col transition hover:shadow-md ${
                safeAppearance.highContrastMode
                  ? 'border-2 border-stone-800 shadow-xs'
                  : 'border border-stone-200'
              } ${!item.isAvailable ? 'opacity-65 grayscale-[20%]' : ''}`}
            >
              {/* Image & Tags */}
              <div
                className={`relative w-full bg-stone-100 overflow-hidden ${
                  isCompact ? 'h-32 sm:h-36' : 'h-44'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, isCompact ? 1 : 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {!item.isAvailable && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white">
                      HẾT MÓN
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-stone-800 backdrop-blur-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" /> ~{item.prepTimeMinutes}p
                </div>
              </div>

              {/* Dish Content */}
              <div className={`${isCompact ? 'p-3' : 'p-4'} flex-1 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={`font-bold text-stone-900 leading-snug ${
                        safeAppearance.fontSize === 'large'
                          ? 'text-base sm:text-lg'
                          : isCompact
                          ? 'text-xs sm:text-sm line-clamp-1'
                          : 'text-sm sm:text-base'
                      }`}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <p
                    className={`text-stone-500 mb-2 leading-relaxed ${
                      isCompact ? 'text-[11px] line-clamp-1' : 'text-xs line-clamp-2'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    <span
                      className={`font-black tracking-tight block ${currentPalette.accentText} ${
                        safeAppearance.fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                      }`}
                    >
                      {formatCurrency(item.price)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-stone-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      {!isCompact && <span>({item.salesCount} đã bán)</span>}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {item.isAvailable ? (
                      inCartItem ? (
                        <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl p-0.5 sm:p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateCartQty(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold transition cursor-pointer shadow-2xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={`px-1 text-xs font-black ${currentPalette.accentText}`}>
                            {inCartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateCartQty(item.id, 1)}
                            className={`w-6 h-6 rounded-lg text-white flex items-center justify-center font-bold transition cursor-pointer shadow-2xs ${currentPalette.primaryBg}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold active:scale-95 transition flex items-center gap-1 cursor-pointer shadow-xs ${currentPalette.primaryBg} ${currentPalette.primaryHover}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isCompact ? 'Chọn' : 'Thêm'}</span>
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-stone-400 font-medium">Tạm hết</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar when cart has items (Mobile & quick checkout) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-30">
          <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Giỏ hàng ({totalCartCount} phần)</p>
                <p className="text-base font-extrabold text-white">{formatCurrency(cartTotal)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              Đặt món ngay <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Cart Modal/Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <h2 className="font-bold text-stone-900 text-base">Giỏ hàng của bạn</h2>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalCartCount} món
                </span>
              </div>
              <button
                type="button"
                onClick={onCloseCart}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
                  <p className="font-medium text-stone-600">Giỏ hàng đang trống</p>
                  <p className="text-xs">Hãy chọn món ngon từ thực đơn để tiếp tục!</p>
                </div>
              ) : (
                cart.map((c) => (
                  <div
                    key={c.menuItemId}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex gap-3 items-center"
                  >
                    <img
                      src={c.item.image}
                      alt={c.item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                        {c.item.name}
                      </h4>
                      <p className="text-xs font-semibold text-orange-600">
                        {formatCurrency(c.item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(c.menuItemId, -1)}
                        className="w-6 h-6 rounded bg-white border border-stone-300 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-900">
                        {c.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(c.menuItemId, 1)}
                        className="w-6 h-6 rounded bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(c.menuItemId)}
                        className="p-1 text-stone-400 hover:text-rose-600 ml-1 cursor-pointer"
                        title="Xóa món"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-600">Tổng cộng:</span>
                  <span className="text-lg font-extrabold text-stone-900">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="py-2.5 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onCloseCart();
                      setIsCheckoutOpen(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    Xác nhận đặt <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    Xác nhận đặt hàng Căn tin
                  </h3>
                  <p className="text-[11px] text-stone-500">Giáp Căn Tin Queue System</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm">
              {/* Customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Gia Huy, Văn Minh..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Dine-in vs Takeaway */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Hình thức nhận món</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupType('dine_in')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      pickupType === 'dine_in'
                        ? 'border-orange-600 bg-orange-50 text-orange-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    🍽️ Dùng tại căn tin
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupType('takeaway')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      pickupType === 'takeaway'
                        ? 'border-orange-600 bg-orange-50 text-orange-800'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    🥡 Đóng hộp mang đi
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Phương thức thanh toán</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'qr'
                        ? 'border-orange-600 bg-orange-50 text-orange-800 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-orange-600" />
                    <span className="text-[11px]">VietQR / Momo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'border-orange-600 bg-orange-50 text-orange-800 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span className="text-[11px]">Ví Sinh Viên</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-orange-600 bg-orange-50 text-orange-800 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="text-[11px]">Tiền mặt tại quầy</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Virtual QR Code Card inside Checkout Form */}
              {paymentMethod === 'qr' && (
                <div className="pt-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-xs">Mã QR ảo chuyển khoản tự động:</span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Tự động khớp tiền
                    </span>
                  </div>
                  <VirtualQRCodeCard
                    amount={finalPayTotal}
                    customerName={customerName}
                    orderCode="CT-ORD"
                    compact={true}
                  />
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ghi chú cho nhà bếp</label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="VD: Không lấy ớt cay, xin thêm nước sốt..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Takeaway Fee breakdown */}
              {pickupType === 'takeaway' && takeawayFeeAmount > 0 && (
                <div className="flex justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <span>Phí hộp & dụng cụ mang đi:</span>
                  <span className="font-bold text-stone-800">+{formatCurrency(takeawayFeeAmount)}</span>
                </div>
              )}

              {/* Wallet notice */}
              {paymentMethod === 'wallet' && currentUser && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-blue-950">
                    <span>Số dư Ví Căn Tin hiện tại:</span>
                    <span>{formatCurrency(currentUser.walletBalance)}</span>
                  </div>
                  {isWalletInsufficient ? (
                    <p className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Số dư không đủ để thanh toán ({formatCurrency(finalPayTotal)}). Vui lòng chọn VietQR hoặc nạp thêm tại quầy!
                    </p>
                  ) : (
                    <p className="text-emerald-700 font-medium">
                      ✓ Đủ số dư. Tiền sẽ được trừ tự động vào thẻ căn tin của bạn.
                    </p>
                  )}
                </div>
              )}

              {/* Canteen Closed Alert */}
              {!canteenSettings.isOpen && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Căn tin hiện đang tạm ngưng nhận đơn trực tuyến. Vui lòng quay lại sau!</span>
                </div>
              )}

              {/* Total & Submit Footer */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between sticky bottom-0 bg-white z-10">
                <div>
                  <span className="text-xs text-stone-500">Tổng thanh toán</span>
                  <p className="text-lg font-black text-orange-600">{formatCurrency(finalPayTotal)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!canteenSettings.isOpen || !!isWalletInsufficient}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition cursor-pointer shadow-xs"
                  >
                    Tạo Đơn Hàng & Lấy Số
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Virtual QR Code Modal (Triggered after placing order or from active tracking card) */}
      {qrModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-sm sm:text-base">
                    Mã VietQR Thanh Toán Đơn #{qrModalOrder.orderCode}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Khách: {qrModalOrder.customerName} • Tổng: {formatCurrency(qrModalOrder.totalAmount)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQrModalOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <VirtualQRCodeCard
                amount={qrModalOrder.totalAmount}
                customerName={qrModalOrder.customerName}
                orderCode={`CT-${qrModalOrder.orderCode}`}
                compact={false}
              />

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <p className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600 shrink-0" /> Hướng dẫn quét mã nhận món:
                </p>
                <p>1. Mở bất kỳ ứng dụng Ngân hàng (MB, VCB, Techcombank, VPBank...) hoặc MoMo.</p>
                <p>2. Chọn tính năng <strong>Quét mã QR</strong> và hướng máy ảnh vào mã phía trên.</p>
                <p>3. Khi hoàn tất chuyển khoản, đầu bếp tại Giáp Căn Tin sẽ chuẩn bị món và gọi số thứ tự <strong>#{qrModalOrder.orderCode}</strong>.</p>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
              <span className="text-xs text-stone-500">
                Đã chuyển khoản xong? Bạn có thể đóng cửa sổ này.
              </span>
              <button
                type="button"
                onClick={() => setQrModalOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-stone-900 text-base">Đánh giá món ăn</h3>
              <button
                type="button"
                onClick={() => setReviewOrderId(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Cảm nhận của bạn giúp đầu bếp Giáp Căn Tin cải thiện chất lượng món ăn mỗi ngày!
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setReviewRating(s)}
                  className="p-1 text-2xl transition hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= reviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận về hương vị, độ nóng sốt, tốc độ phục vụ..."
              className="w-full p-3 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewOrderId(null)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
