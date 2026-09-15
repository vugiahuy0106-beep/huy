import React, { useState, useEffect } from 'react';
import {
  RoleView,
  MenuItem,
  Category,
  Order,
  CartItem,
  OrderStatus,
  PaymentMethod,
  User,
  UserRole,
  CanteenSettings,
  AppearanceSettings,
} from './types';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from './data/initialData';
import { DEFAULT_USERS, DEFAULT_CANTEEN_SETTINGS } from './data/initialUsers';
import { DEFAULT_APPEARANCE } from './utils/appearance';
import { Header } from './components/Header';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { StaffQueuePortal } from './components/staff/StaffQueuePortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { AppearanceModal } from './components/settings/AppearanceModal';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { ToastNotification, ToastMessage } from './components/ToastNotification';

// Web Audio API chime sound
function playChime(type: 'order' | 'callout' = 'callout', enabled: boolean = true) {
  if (!enabled) return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    if (type === 'callout') {
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch {
    // AudioContext fallback
  }
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleView>('customer');
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('giap_menu_items');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('giap_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User Accounts & Authentication State
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('giap_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('giap_current_user');
      if (saved) return JSON.parse(saved);
      // Pre-seed with the student customer user for instant interactivity
      return DEFAULT_USERS[1];
    } catch {
      return DEFAULT_USERS[1];
    }
  });

  // Canteen Operational Settings
  const [canteenSettings, setCanteenSettings] = useState<CanteenSettings>(() => {
    try {
      const saved = localStorage.getItem('giap_canteen_settings');
      return saved ? JSON.parse(saved) : DEFAULT_CANTEEN_SETTINGS;
    } catch {
      return DEFAULT_CANTEEN_SETTINGS;
    }
  });

  // Appearance & UI Theme Customization
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    try {
      const saved = localStorage.getItem('giap_appearance_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_APPEARANCE,
            ...parsed,
            backgroundImage: parsed.backgroundImage || DEFAULT_APPEARANCE.backgroundImage,
            heroBannerImage: parsed.heroBannerImage || DEFAULT_APPEARANCE.heroBannerImage,
          };
        }
      }
      return DEFAULT_APPEARANCE;
    } catch {
      return DEFAULT_APPEARANCE;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authRolePrompt, setAuthRolePrompt] = useState<UserRole | undefined>(undefined);
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>([
    {
      menuItemId: 'm1',
      item: INITIAL_MENU_ITEMS[0],
      quantity: 1,
      note: 'Ít cơm, nhiều rau',
    },
    {
      menuItemId: 'm10',
      item: INITIAL_MENU_ITEMS[9],
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-104');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [nextOrderNum, setNextOrderNum] = useState<number>(105);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('giap_appearance_settings', JSON.stringify(appearance));
    } catch {
      // ignore
    }
  }, [appearance]);

  useEffect(() => {
    try {
      localStorage.setItem('giap_users', JSON.stringify(users));
    } catch {
      // ignore storage quota error
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('giap_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('giap_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('giap_menu_items', JSON.stringify(menuItems));
    } catch {
      // ignore
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('giap_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('giap_canteen_settings', JSON.stringify(canteenSettings));
    } catch {
      // ignore
    }
  }, [canteenSettings]);

  const addToast = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'callout' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      addToast('Đăng nhập thành công', `Chào mừng Quản trị viên ${user.name}!`, 'success');
      // If user logs into Admin, switch to Admin view to directly see admin features
      setCurrentRole('admin');
    } else {
      addToast('Đăng nhập thành công', `Xin chào bạn ${user.name}!`, 'success');
      if (currentRole === 'admin') {
        setCurrentRole('customer');
      }
    }
  };

  const handleRegister = (newUserData: Omit<User, 'id' | 'createdAt'>): User => {
    const createdUser: User = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [createdUser, ...prev]);
    addToast(
      'Tạo tài khoản thành công',
      `Chào mừng ${createdUser.name} đến với Giáp Căn Tin!`,
      'success'
    );
    return createdUser;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (currentRole === 'admin') {
      setCurrentRole('customer');
    }
    addToast('Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống Giáp Căn Tin.', 'info');
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...updatedData,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addToast('Hồ sơ đã cập nhật', 'Thông tin tài khoản của bạn đã được cập nhật thành công!', 'success');
  };

  const handleUpdateAppearance = (newSettings: AppearanceSettings) => {
    setAppearance(newSettings);
    addToast('Giao diện đã cập nhật', 'Tùy chỉnh màu sắc & bố cục hiển thị đã được lưu!', 'success');
  };

  const handleSwitchToAdminLogin = () => {
    setAuthRolePrompt('admin');
    setIsAuthModalOpen(true);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, note?: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItemId: item.id, item, quantity: 1, note }];
    });
    addToast('Đã thêm món', `+1 ${item.name} vào giỏ hàng`, 'success');
  };

  const handleUpdateCartQty = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItemId === menuItemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null)
    );
  };

  const handleRemoveFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Create Order
  const handleCreateOrder = (
    customerName: string,
    customerPhone: string,
    tableOrPickupType: 'dine_in' | 'takeaway',
    paymentMethod: PaymentMethod,
    note?: string
  ): Order => {
    const orderCode = `CT-${nextOrderNum}`;
    setNextOrderNum((prev) => prev + 1);

    const baseAmount = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
    const takeawayFee = tableOrPickupType === 'takeaway' ? canteenSettings.takeawayFee : 0;
    const totalAmount = baseAmount + takeawayFee;

    // Deduct from wallet if paying with student wallet
    if (paymentMethod === 'wallet' && currentUser) {
      if (currentUser.walletBalance >= totalAmount) {
        const updatedBalance = currentUser.walletBalance - totalAmount;
        setCurrentUser({ ...currentUser, walletBalance: updatedBalance });
        setUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, walletBalance: updatedBalance } : u))
        );
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      customerName,
      customerPhone,
      items: cart.map((c) => ({
        id: `item-${Date.now()}-${c.menuItemId}`,
        menuItemId: c.menuItemId,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        note: c.note,
      })),
      totalAmount,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedMinutes: 7,
      tableOrPickupType,
      note,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    playChime('order');
    addToast(
      'Đặt món thành công!',
      `Số thứ tự của bạn là #${orderCode}. Bếp đã nhận đơn và chuẩn bị!`,
      'success'
    );
    return newOrder;
  };

  // Kitchen Order Status updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (newStatus === 'ready' && targetOrder) {
      playChime('callout');
      addToast(
        `🔔 MỜI SỐ #${targetOrder.orderCode}`,
        `Mời bạn ${targetOrder.customerName} đến quầy nhận món ăn!`,
        'callout'
      );
    } else if (newStatus === 'cooking' && targetOrder) {
      addToast('Bếp đang nấu', `Đơn #${targetOrder.orderCode} đang được chế biến`, 'info');
    } else if (newStatus === 'completed' && targetOrder) {
      addToast('Đã hoàn thành', `Đơn #${targetOrder.orderCode} đã giao thành công`, 'success');
    }
  };

  const handleCallOutOrder = (order: Order) => {
    playChime('callout');
    addToast(
      `🔔 LOA NHẮC: SỐ #${order.orderCode}`,
      `Mời bạn ${order.customerName} đến quầy lấy món!`,
      'callout'
    );
  };

  // Simulate new order
  const handleSimulateNewOrder = () => {
    const randomDish = menuItems[Math.floor(Math.random() * menuItems.length)];
    const randomDrink = menuItems.find((m) => m.categoryId === 'do-uong') || menuItems[0];
    const names = ['Nguyễn Thị Mai', 'Hoàng Minh Quân', 'Lê Bích Ngọc', 'Vũ Tuấn Anh', 'Đỗ Hải Đăng'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const orderCode = `CT-${nextOrderNum}`;
    setNextOrderNum((prev) => prev + 1);

    const newSimOrder: Order = {
      id: `ord-sim-${Date.now()}`,
      orderCode,
      customerName: randomName,
      customerPhone: '0977889900',
      items: [
        {
          id: `item-${Date.now()}-1`,
          menuItemId: randomDish.id,
          name: randomDish.name,
          price: randomDish.price,
          quantity: 1,
          note: 'Cho ít ớt cay',
        },
        {
          id: `item-${Date.now()}-2`,
          menuItemId: randomDrink.id,
          name: randomDrink.name,
          price: randomDrink.price,
          quantity: 1,
        },
      ],
      totalAmount: randomDish.price + randomDrink.price,
      status: 'pending',
      paymentMethod: 'qr',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedMinutes: 6,
      tableOrPickupType: Math.random() > 0.4 ? 'dine_in' : 'takeaway',
    };

    setOrders((prev) => [newSimOrder, ...prev]);
    playChime('order');
    addToast('Đơn mới từ khách hàng!', `Số #${orderCode} (${randomName}) vừa được đặt.`, 'info');
  };

  // Review submission
  const handleSubmitReview = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rating, reviewComment: comment } : o))
    );
    addToast('Cảm ơn bạn!', 'Đánh giá món ăn của bạn đã được ghi nhận.', 'success');
  };

  // ================= ADMIN FUNCTIONS =================
  // 1. Availability toggle
  const handleToggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.isAvailable;
          addToast(
            nextState ? 'Món đã mở bán' : 'Món đã tạm hết hàng',
            `${item.name} hiện ${nextState ? 'còn món' : 'tạm hết hàng'}`,
            'info'
          );
          return { ...item, isAvailable: nextState };
        }
        return item;
      })
    );
  };

  // 2. Single price update
  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          addToast(
            'Cập nhật giá',
            `${item.name} có giá mới ${newPrice.toLocaleString('vi-VN')} ₫`,
            'success'
          );
          return { ...item, price: newPrice };
        }
        return item;
      })
    );
  };

  // 3. Add new menu item
  const handleAddNewMenuItem = (newItem: Omit<MenuItem, 'id' | 'salesCount' | 'rating'>) => {
    const itemWithId: MenuItem = {
      ...newItem,
      id: `dish-${Date.now()}`,
      salesCount: 0,
      rating: 5.0,
    };
    setMenuItems((prev) => [itemWithId, ...prev]);
    addToast('Đã thêm món mới', `Món "${newItem.name}" đã được đưa vào thực đơn!`, 'success');
  };

  // 4. Edit entire menu item (CRUD)
  const handleEditMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    addToast(
      'Cập nhật thành công',
      `Đã cập nhật thông tin món "${updatedItem.name}"`,
      'success'
    );
  };

  // 5. Delete menu item (CRUD)
  const handleDeleteMenuItem = (itemId: string) => {
    const target = menuItems.find((m) => m.id === itemId);
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    setCart((prev) => prev.filter((c) => c.menuItemId !== itemId));
    addToast(
      'Đã xóa món ăn',
      target ? `Món "${target.name}" đã bị xóa khỏi thực đơn` : 'Đã xóa món ăn khỏi thực đơn',
      'info'
    );
  };

  // 6. Bulk price update (% adjust)
  const handleBulkUpdatePrices = (categoryId: string, percentChange: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (categoryId === 'all' || item.categoryId === categoryId) {
          const newPrice = Math.max(1000, Math.round((item.price * (1 + percentChange / 100)) / 1000) * 1000);
          return { ...item, price: newPrice };
        }
        return item;
      })
    );
    addToast(
      'Bảng giá đã điều chỉnh',
      `Đã áp dụng thay đổi ${percentChange > 0 ? `+${percentChange}` : percentChange}% cho các món ăn được chọn.`,
      'success'
    );
  };

  // 7. Wallet Top-up
  const handleTopUpWallet = (userId: string, amount: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedBalance = u.walletBalance + amount;
          if (currentUser && currentUser.id === userId) {
            setCurrentUser({ ...currentUser, walletBalance: updatedBalance });
          }
          return { ...u, walletBalance: updatedBalance };
        }
        return u;
      })
    );
    const target = users.find((u) => u.id === userId);
    addToast(
      'Nạp tiền thành công',
      `Đã nạp +${amount.toLocaleString('vi-VN')} ₫ vào ví của ${target?.name || 'người dùng'}.`,
      'success'
    );
  };

  // 8. User Management CRUD (Add, Edit, Delete Staff & Customers)
  const handleAddNewUser = (newUserData: Omit<User, 'id' | 'createdAt'>) => {
    const createdUser: User = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [createdUser, ...prev]);
    const roleLabel =
      createdUser.role === 'staff'
        ? 'Nhân viên Bếp / Quầy'
        : createdUser.role === 'admin'
        ? 'Quản trị viên'
        : 'Khách hàng';
    addToast(
      'Thêm tài khoản thành công',
      `Đã tạo tài khoản ${roleLabel}: ${createdUser.name}`,
      'success'
    );
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addToast(
      'Cập nhật thành công',
      `Đã cập nhật thông tin thành viên ${updatedUser.name}.`,
      'success'
    );
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    if (targetUser.role === 'admin') {
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (adminCount <= 1) {
        addToast(
          'Không thể xóa',
          'Hệ thống bắt buộc phải duy trì ít nhất 1 Quản trị viên (Admin).',
          'callout'
        );
        return;
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
      setCurrentRole('customer');
      addToast(
        'Đã xóa tài khoản',
        `Tài khoản đang đăng nhập (${targetUser.name}) đã bị xóa khỏi hệ thống. Chuyển về vai trò Khách.`,
        'info'
      );
    } else {
      addToast(
        'Xóa tài khoản thành công',
        `Đã xóa tài khoản ${targetUser.name} khỏi hệ thống.`,
        'success'
      );
    }
  };

  // 9. Update canteen operational settings
  const handleUpdateCanteenSettings = (newSettings: CanteenSettings) => {
    setCanteenSettings(newSettings);
    addToast('Cài đặt Căn tin', 'Đã lưu cấu hình vận hành và thông báo hệ thống!', 'success');
  };

  const currentBgImage = appearance.backgroundImage || DEFAULT_APPEARANCE.backgroundImage;
  const currentBgOpacity = appearance.backgroundOpacity ?? 0.35;
  const currentBgBlur = appearance.backgroundBlur ?? 1;
  const overlayType = appearance.backgroundOverlay ?? 'warm';

  const overlayClasses = {
    warm: 'bg-gradient-to-b from-amber-950/25 via-stone-900/20 to-stone-950/30',
    cream: 'bg-stone-100/60 backdrop-blur-[1px]',
    dark: 'bg-black/40 backdrop-blur-[1px]',
    glass: 'bg-white/40 backdrop-blur-xs',
    none: 'bg-transparent',
  }[overlayType] || 'bg-gradient-to-b from-amber-950/20 to-stone-950/25';

  return (
    <div className="relative min-h-screen text-stone-900 flex flex-col font-sans selection:bg-orange-200 overflow-x-hidden bg-stone-900">
      {/* Dynamic Food Wallpaper Background Layer */}
      {currentBgImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
          aria-hidden="true"
        >
          <img
            src={currentBgImage}
            alt="Food Wallpaper"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            style={{
              opacity: currentBgOpacity,
              filter: `blur(${currentBgBlur}px) saturate(1.15) brightness(0.98)`,
              transform: 'scale(1.05)',
            }}
          />
          {/* Subtle contrast gradient / color overlay */}
          <div className={`absolute inset-0 transition-colors duration-500 ${overlayClasses}`} />
        </div>
      )}

      {/* Floating Quick Background & Appearance Customization Trigger */}
      <button
        id="quick-appearance-btn"
        type="button"
        onClick={() => setIsAppearanceModalOpen(true)}
        title="Tùy chỉnh hình nền ẩm thực & màu sắc giao diện"
        className="fixed bottom-5 left-5 z-40 px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-stone-800 hover:text-orange-600 font-bold text-xs shadow-xl backdrop-blur-md border border-stone-200/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer group"
      >
        <span className="w-6 h-6 rounded-xl bg-orange-100 group-hover:bg-orange-600 group-hover:text-white text-orange-700 flex items-center justify-center transition-colors text-xs">
          🍲
        </span>
        <span className="hidden sm:inline">Đổi hình nền đồ ăn</span>
      </button>

      {/* Main app relative layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* App Header with role switcher, Auth status, and live ticker */}
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          cartCount={cart.reduce((sum, c) => sum + c.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          orders={orders}
          onSelectOrderForTracking={setActiveTrackingOrderId}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setAuthRolePrompt(undefined);
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          canteenSettings={canteenSettings}
          appearance={appearance}
          onOpenAppearanceModal={() => setIsAppearanceModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentRole === 'customer' && (
          <CustomerPortal
            categories={categories}
            menuItems={menuItems}
            orders={orders}
            cart={cart}
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCreateOrder={handleCreateOrder}
            activeTrackingOrderId={activeTrackingOrderId}
            onSelectOrderForTracking={setActiveTrackingOrderId}
            onSubmitReview={handleSubmitReview}
            currentUser={currentUser}
            canteenSettings={canteenSettings}
            appearance={appearance}
            onOpenAppearanceModal={() => setIsAppearanceModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentRole === 'staff' && (
          <StaffQueuePortal
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSimulateNewOrder={handleSimulateNewOrder}
            onCallOutOrder={handleCallOutOrder}
          />
        )}

        {currentRole === 'admin' && (
          <AdminPortal
            categories={categories}
            menuItems={menuItems}
            orders={orders}
            onToggleItemAvailability={handleToggleItemAvailability}
            onUpdateItemPrice={handleUpdateItemPrice}
            onAddNewMenuItem={handleAddNewMenuItem}
            onEditMenuItem={handleEditMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onBulkUpdatePrices={handleBulkUpdatePrices}
            canteenSettings={canteenSettings}
            onUpdateCanteenSettings={handleUpdateCanteenSettings}
            users={users}
            onTopUpWallet={handleTopUpWallet}
            onAddNewUser={handleAddNewUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
            onSwitchToAdminLogin={handleSwitchToAdminLogin}
          />
        )}
      </main>
      </div>

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        users={users}
        defaultRolePrompt={authRolePrompt}
      />

      {/* Appearance & Theme Customization Modal */}
      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        appearance={appearance}
        settings={appearance}
        onChangeAppearance={handleUpdateAppearance}
        onSaveSettings={handleUpdateAppearance}
        onResetAppearance={() => handleUpdateAppearance(DEFAULT_APPEARANCE)}
      />

      {/* Profile & Account Information Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
