import React, { useState } from 'react';
import { MenuItem, Category, Order, User, CanteenSettings } from '../../types';
import { formatCurrency, formatDateTime, getStatusDetails } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  SlidersHorizontal,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Store,
  Tag,
  Percent,
  Wallet,
  Coins,
  ArrowRight,
  AlertCircle,
  Megaphone,
  Bell,
  RefreshCw,
  Users,
  CreditCard,
  QrCode,
  Banknote,
  Utensils,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';

import { UserManagementTab } from './UserManagementTab';
import { ReportsAnalyticsTab } from './ReportsAnalyticsTab';

interface AdminPortalProps {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  onToggleItemAvailability: (itemId: string) => void;
  onUpdateItemPrice: (itemId: string, newPrice: number) => void;
  onAddNewMenuItem: (item: Omit<MenuItem, 'id' | 'salesCount' | 'rating'>) => void;
  onEditMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onBulkUpdatePrices: (categoryId: string, percentChange: number) => void;
  canteenSettings: CanteenSettings;
  onUpdateCanteenSettings: (newSettings: CanteenSettings) => void;
  users: User[];
  onTopUpWallet: (userId: string, amount: number) => void;
  onAddNewUser: (newUser: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User | null;
  onSwitchToAdminLogin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  categories,
  menuItems,
  orders,
  onToggleItemAvailability,
  onUpdateItemPrice,
  onAddNewMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
  onBulkUpdatePrices,
  canteenSettings,
  onUpdateCanteenSettings,
  users,
  onTopUpWallet,
  onAddNewUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
  onSwitchToAdminLogin,
}) => {
  // Tabs: 'reports' | 'revenue' | 'menu' | 'prices' | 'settings' | 'orders' | 'users'
  const [activeTab, setActiveTab] = useState<'reports' | 'revenue' | 'menu' | 'prices' | 'settings' | 'orders' | 'users'>('reports');

  // Revenue time filter
  const [revenueFilter, setRevenueFilter] = useState<'today' | '7days' | 'all'>('today');

  // Inline Quick Price Edit
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Add / Edit Dish Modals
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null);

  // Add Dish form state
  const [newName, setNewName] = useState<string>('');
  const [newCategoryId, setNewCategoryId] = useState<string>('com');
  const [newPrice, setNewPrice] = useState<number>(35000);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newPrepTime, setNewPrepTime] = useState<number>(7);
  const [newImage, setNewImage] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  );
  const [newTags, setNewTags] = useState<string>('Món mới');

  // Menu list filters
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [menuAvailabilityFilter, setMenuAvailabilityFilter] = useState<string>('all');

  // Bulk price edit form
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkPercent, setBulkPercent] = useState<number>(5);

  // Wallet top-up modal state
  const [topUpUserId, setTopUpUserId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);

  // Search in order list
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<CanteenSettings>(canteenSettings);
  const [isSettingsSaved, setIsSettingsSaved] = useState<boolean>(false);

  // RBAC GUARD: Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-900 inline-block">
            Khu vực Quản trị Căn tin (Admin Only)
          </span>
          <h2 className="text-2xl font-black text-stone-900">
            {currentUser ? 'Bạn chưa có quyền Quản trị viên' : 'Yêu cầu đăng nhập tài khoản Admin'}
          </h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            {currentUser
              ? `Tài khoản hiện tại "${currentUser.name}" thuộc nhóm Khách hàng. Bạn cần tài khoản Admin để truy cập thêm sửa xóa món ăn, chỉnh bảng giá và xem doanh thu.`
              : 'Vui lòng đăng nhập với tư cách Quản trị viên (Admin) để thiết lập thực đơn, kiểm soát giá bán và theo dõi tài chính.'}
          </p>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
          <p className="font-bold text-stone-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> Tài khoản Admin thử nghiệm:
          </p>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200">
            <div>
              <p className="font-bold text-stone-900">Nguyễn Văn Giáp (Quản lý)</p>
              <p className="text-stone-500">Email: admin@giaccantin.vn</p>
            </div>
            <button
              id="switch-to-admin-btn"
              type="button"
              onClick={onSwitchToAdminLogin}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer transition shadow-xs"
            >
              Đăng nhập Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Calculations for Revenue and Analytics ---
  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Payment Breakdown
  const qrRevenue = validOrders
    .filter((o) => o.paymentMethod === 'qr')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const cashRevenue = validOrders
    .filter((o) => o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const walletRevenue = validOrders
    .filter((o) => o.paymentMethod === 'wallet')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Category sales distribution
  const categorySales = categories.map((cat) => {
    const itemsInCat = menuItems.filter((m) => m.categoryId === cat.id);
    const totalSold = itemsInCat.reduce((acc, m) => acc + m.salesCount, 0);
    const catRevenue = itemsInCat.reduce((acc, m) => acc + m.salesCount * m.price, 0);
    return {
      id: cat.id,
      name: cat.name,
      sold: totalSold,
      revenue: catRevenue,
    };
  });

  // Top selling dishes
  const topDishes = [...menuItems]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchCategory = menuCategoryFilter === 'all' || item.categoryId === menuCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchAvailable =
      menuAvailabilityFilter === 'all' ||
      (menuAvailabilityFilter === 'available' && item.isAvailable) ||
      (menuAvailabilityFilter === 'out_of_stock' && !item.isAvailable);
    return matchCategory && matchSearch && matchAvailable;
  });

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    const matchSearch =
      ord.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Handlers
  const handleSaveInlinePrice = (itemId: string) => {
    if (tempPrice > 0) {
      onUpdateItemPrice(itemId, tempPrice);
    }
    setEditingPriceId(null);
  };

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddNewMenuItem({
      name: newName.trim(),
      categoryId: newCategoryId,
      price: newPrice,
      description: newDescription.trim() || 'Món ngon mỗi ngày chuẩn bị kỹ lưỡng.',
      image: newImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      prepTimeMinutes: Number(newPrepTime) || 5,
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['Món mới'],
    });

    // Reset
    setNewName('');
    setNewPrice(35000);
    setNewDescription('');
    setIsAddDishModalOpen(false);
  };

  const handleEditDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    onEditMenuItem(editingDish);
    setEditingDish(null);
  };

  const handleConfirmDelete = () => {
    if (deletingDishId) {
      onDeleteMenuItem(deletingDishId);
      setDeletingDishId(null);
    }
  };

  const handleApplyBulkPrices = (e: React.FormEvent) => {
    e.preventDefault();
    onBulkUpdatePrices(bulkCategory, bulkPercent);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCanteenSettings(settingsForm);
    setIsSettingsSaved(true);
    setTimeout(() => setIsSettingsSaved(false), 3000);
  };

  const handleExecuteTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpUserId && topUpAmount > 0) {
      onTopUpWallet(topUpUserId, topUpAmount);
      setTopUpUserId(null);
      setTopUpAmount(50000);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Admin Navigation Header */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                TRUNG TÂM QUẢN TRỊ CĂN TIN
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                Admin: {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Quản lý toàn diện: Thêm sửa xóa món ăn, báo cáo doanh thu, cài đặt bảng giá & ví sinh viên
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              canteenSettings.isOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                canteenSettings.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{canteenSettings.isOpen ? 'Căn tin ĐANG MỞ CỬA' : 'Căn tin ĐANG ĐÓNG CỬA'}</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          <button
            id="admin-tab-reports"
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Báo cáo thống kê</span>
          </button>

          <button
            id="admin-tab-revenue"
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Dòng tiền & Thu chi</span>
          </button>

          <button
            id="admin-tab-menu"
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Quản lý Món ăn ({menuItems.length})</span>
          </button>

          <button
            id="admin-tab-prices"
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'prices'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Bảng giá & Giờ vàng</span>
          </button>

          <button
            id="admin-tab-orders"
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn hàng ({orders.length})</span>
          </button>

          <button
            id="admin-tab-users"
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Nhân viên & Khách hàng ({users.length})</span>
          </button>

          <button
            id="admin-tab-settings"
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Cài đặt Căn tin</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 0: BÁO CÁO THỐNG KÊ (REPORTS & CHARTS) ================= */}
      {activeTab === 'reports' && (
        <ReportsAnalyticsTab
          orders={orders}
          menuItems={menuItems}
          categories={categories}
        />
      )}

      {/* ================= TAB 1: DOANH THU & DÒNG TIỀN (REVENUE) ================= */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">Báo cáo Tài chính & Dòng tiền</h2>
              <p className="text-xs text-stone-500">Cập nhật theo thời gian thực từ các đơn đặt món</p>
            </div>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRevenueFilter('today')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  revenueFilter === 'today' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => setRevenueFilter('7days')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  revenueFilter === '7days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                7 ngày qua
              </button>
              <button
                type="button"
                onClick={() => setRevenueFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  revenueFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Toàn thời gian
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5" /> +24.6% so với tuần trước
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Số Đơn Hàng</span>
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900">{totalOrdersCount} đơn</p>
              <p className="text-xs text-stone-500 mt-2">
                {completedOrders.length} đơn hoàn thành ({Math.round((completedOrders.length / (totalOrdersCount || 1)) * 100)}%)
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Giá Trị Đơn TB (AOV)</span>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900">{formatCurrency(aov)}</p>
              <p className="text-xs text-stone-500 mt-2">Trung bình ~1.8 món / hóa đơn</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Khách Hài Lòng</span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-stone-900">4.9 / 5.0</p>
              <p className="text-xs text-stone-500 mt-2">Hơn 340 lượt đánh giá tích cực</p>
            </div>
          </div>

          {/* Revenue Breakdown by Payment Method & Category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Method Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                Doanh thu theo Phương thức thanh toán
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-950 mb-1">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-purple-600" /> Chuyển khoản VietQR
                    </span>
                    <span>{formatCurrency(qrRevenue)}</span>
                  </div>
                  <div className="w-full bg-purple-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${totalRevenue > 0 ? (qrRevenue / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-purple-700 mt-1 block">
                    {totalRevenue > 0 ? Math.round((qrRevenue / totalRevenue) * 100) : 0}% tổng doanh thu
                  </span>
                </div>

                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-950 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-orange-600" /> Ví Căn tin sinh viên
                    </span>
                    <span>{formatCurrency(walletRevenue)}</span>
                  </div>
                  <div className="w-full bg-orange-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-600 h-full rounded-full"
                      style={{ width: `${totalRevenue > 0 ? (walletRevenue / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-orange-700 mt-1 block">
                    {totalRevenue > 0 ? Math.round((walletRevenue / totalRevenue) * 100) : 0}% tổng doanh thu
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" /> Tiền mặt tại quầy
                    </span>
                    <span>{formatCurrency(cashRevenue)}</span>
                  </div>
                  <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-700 mt-1 block">
                    {totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0}% tổng doanh thu
                  </span>
                </div>
              </div>
            </div>

            {/* Category Revenue Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-600" />
                Sản lượng & Doanh thu theo Nhóm Món
              </h3>

              <div className="space-y-3.5">
                {categorySales.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-stone-800">{cat.name}</span>
                      <span className="text-stone-900">{formatCurrency(cat.revenue)} ({cat.sold} phần)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (cat.sold / 300) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Best Selling Dishes */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Top Món Bán Chạy Nhất (Best Sellers)
              </h3>

              <div className="space-y-2.5">
                {topDishes.map((dish, idx) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between p-2 rounded-2xl bg-stone-50 hover:bg-stone-100 transition"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 font-black text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-stone-900 truncate">{dish.name}</p>
                        <p className="text-[11px] text-stone-400">{formatCurrency(dish.price)}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-black text-stone-900 shrink-0">
                      {dish.salesCount} suất
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUẢN LÝ THỰC ĐƠN (MENU CRUD) ================= */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
            <div>
              <h2 className="font-bold text-stone-900 text-base">
                Quản lý Món ăn Thực đơn ({filteredMenuItems.length}/{menuItems.length} món)
              </h2>
              <p className="text-xs text-stone-500">
                Thêm món mới, sửa thông tin chi tiết hoặc xóa món khỏi danh mục
              </p>
            </div>
            <button
              id="admin-add-dish-btn"
              type="button"
              onClick={() => setIsAddDishModalOpen(true)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm món ăn mới</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm tên món ăn..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={menuCategoryFilter}
                onChange={(e) => setMenuCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={menuAvailabilityFilter}
                onChange={(e) => setMenuAvailabilityFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Chỉ món đang bán</option>
                <option value="out_of_stock">Chỉ món tạm hết</option>
              </select>
            </div>
          </div>

          {/* Dishes Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3.5">Món ăn & Hình ảnh</th>
                    <th className="p-3.5">Danh mục</th>
                    <th className="p-3.5">Đơn giá</th>
                    <th className="p-3.5">Đã bán</th>
                    <th className="p-3.5">Trạng thái bán</th>
                    <th className="p-3.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMenuItems.map((item) => {
                    const categoryName =
                      categories.find((c) => c.id === item.categoryId)?.name || item.categoryId;
                    const isInlineEditing = editingPriceId === item.id;

                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-100 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                            <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                                ⏱️ {item.prepTimeMinutes}p
                              </span>
                              {item.tags?.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-semibold bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-stone-600 font-medium">{categoryName}</td>

                        <td className="p-3.5">
                          {isInlineEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="1000"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-orange-500 rounded-lg text-xs font-bold bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveInlinePrice(item.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPriceId(null)}
                                className="p-1 text-stone-400 hover:bg-stone-100 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 font-bold text-stone-900">
                              <span>{formatCurrency(item.price)}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setTempPrice(item.price);
                                }}
                                className="text-stone-400 hover:text-stone-700 p-1"
                                title="Chỉnh giá nhanh"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 font-bold text-stone-800">{item.salesCount} phần</td>

                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => onToggleItemAvailability(item.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {item.isAvailable ? '✓ Đang mở bán' : '✕ Tạm hết'}
                          </button>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingDish(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Sửa toàn bộ món"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Sửa</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingDishId(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Xóa món"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BẢNG GIÁ & GIỜ VÀNG (PRICING SETTINGS) ================= */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          {/* Happy Hour Discount Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Giờ Vàng Căn Tin (Happy Hour)
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Chế độ Giảm giá Giờ vàng ({canteenSettings.happyHourDiscountPercent}%)
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 max-w-xl mt-1">
                Kích hoạt chế độ giảm giá trực tiếp cho sinh viên trong các khung giờ vắng khách (ví dụ 14:00 - 16:30) để kích cầu tiêu dùng.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onUpdateCanteenSettings({
                    ...canteenSettings,
                    isHappyHourActive: !canteenSettings.isHappyHourActive,
                  })
                }
                className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition cursor-pointer shadow-md ${
                  canteenSettings.isHappyHourActive
                    ? 'bg-white text-orange-700 hover:bg-orange-50'
                    : 'bg-black/40 text-white hover:bg-black/50'
                }`}
              >
                {canteenSettings.isHappyHourActive ? '🔥 ĐANG BẬT GIẢM GIÁ' : 'TẮT GIẢM GIÁ'}
              </button>
            </div>
          </div>

          {/* Bulk Price Adjustment Form */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Percent className="w-5 h-5 text-orange-600" />
              Điều chỉnh Bảng giá Hàng loạt (Bulk Price Update)
            </h3>
            <p className="text-xs text-stone-500">
              Tăng hoặc giảm giá theo tỷ lệ phần trăm (%) cho toàn bộ món hoặc từng nhóm danh mục khi nguyên liệu biến động.
            </p>

            <form onSubmit={handleApplyBulkPrices} className="flex flex-col sm:flex-row items-end gap-3 pt-2">
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Chọn nhóm danh mục áp dụng
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold bg-white"
                >
                  <option value="all">Toàn bộ thực đơn ({menuItems.length} món)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tỷ lệ điều chỉnh (%): (+ để tăng, - để giảm)
                </label>
                <input
                  type="number"
                  step="1"
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(Number(e.target.value))}
                  placeholder="VD: 5 hoặc -10"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition shadow-xs"
              >
                Áp dụng Bảng giá mới
              </button>
            </form>
          </div>

          {/* Complete Price Table Overview */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-bold text-stone-900 text-sm">Bảng giá chi tiết từng món ăn</h3>
              <span className="text-xs text-stone-500">Bấm vào bút chì hoặc nhập số để đổi giá</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Món ăn</th>
                    <th className="p-3.5">Danh mục</th>
                    <th className="p-3.5">Giá niêm yết hiện tại</th>
                    <th className="p-3.5">Giá Giờ vàng (-{canteenSettings.happyHourDiscountPercent}%)</th>
                    <th className="p-3.5 text-right">Chỉnh sửa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => {
                    const discounted = Math.round(
                      item.price * (1 - canteenSettings.happyHourDiscountPercent / 100)
                    );
                    return (
                      <tr key={item.id} className="hover:bg-stone-50 transition">
                        <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                          <img
                            src={item.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span>{item.name}</span>
                        </td>
                        <td className="p-3.5 text-stone-600">
                          {categories.find((c) => c.id === item.categoryId)?.name}
                        </td>
                        <td className="p-3.5 font-extrabold text-stone-900">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="p-3.5 font-bold text-orange-600">
                          {formatCurrency(discounted)}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const newP = prompt(
                                `Nhập giá mới cho món "${item.name}" (VND):`,
                                item.price.toString()
                              );
                              if (newP && !isNaN(Number(newP))) {
                                onUpdateItemPrice(item.id, Number(newP));
                              }
                            }}
                            className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                          >
                            Đổi giá
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: DANH SÁCH ĐƠN HÀNG (ORDERS) ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn hoặc tên khách..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-bold">Lọc trạng thái:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="all">Tất cả ({orders.length})</option>
                <option value="pending">Chờ chế biến</option>
                <option value="cooking">Đang nấu</option>
                <option value="ready">Mời nhận món</option>
                <option value="completed">Đã nhận món</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3.5">Mã đơn</th>
                    <th className="p-3.5">Khách hàng</th>
                    <th className="p-3.5">Chi tiết món</th>
                    <th className="p-3.5">Tổng tiền</th>
                    <th className="p-3.5">Thanh toán</th>
                    <th className="p-3.5">Thời gian đặt</th>
                    <th className="p-3.5">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => {
                    const statusInfo = getStatusDetails(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-3.5 font-black text-stone-900">#{ord.orderCode}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-stone-900">{ord.customerName}</p>
                          <p className="text-[11px] text-stone-400">
                            {ord.tableOrPickupType === 'dine_in' ? 'Ăn tại chỗ' : 'Mang đi'} • {ord.customerPhone}
                          </p>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <p key={idx} className="text-xs text-stone-700 truncate">
                                <span className="font-bold text-orange-600">{it.quantity}x</span> {it.name}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 font-extrabold text-stone-900">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-bold uppercase">
                            {ord.paymentMethod === 'qr'
                              ? 'VietQR'
                              : ord.paymentMethod === 'wallet'
                              ? 'Ví Căn tin'
                              : 'Tiền mặt'}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-500 text-xs">
                          {formatDateTime(ord.createdAt)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: QUẢN LÝ NHÂN VIÊN & KHÁCH HÀNG (USERS) ================= */}
      {activeTab === 'users' && (
        <UserManagementTab
          users={users}
          currentUser={currentUser}
          onAddNewUser={onAddNewUser}
          onUpdateUser={onUpdateUser}
          onDeleteUser={onDeleteUser}
          onTopUpWallet={onTopUpWallet}
        />
      )}

      {/* ================= TAB 6: CÀI ĐẶT CĂN TIN (CANTEEN SETTINGS) ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-900">Cài đặt Vận hành & Hệ thống Căn tin</h2>
            <p className="text-xs text-stone-500">
              Kiểm soát giờ mở cửa, thông báo toàn trường, phụ thu mang đi và nhận đơn tự động
            </p>
          </div>

          {isSettingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu thành công cài đặt hệ thống căn tin!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Open / Close Toggle */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-stone-900">Trạng thái Nhận Đơn Trực Tuyến</p>
                <p className="text-xs text-stone-500">
                  Nếu tắt, khách hàng sẽ không thể đặt món mới trên ứng dụng
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsForm({ ...settingsForm, isOpen: !settingsForm.isOpen })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  settingsForm.isOpen
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                }`}
              >
                {settingsForm.isOpen ? '✓ Đang Nhận Đơn' : '✕ Đóng Cửa Tạm Thời'}
              </button>
            </div>

            {/* Announcement Banner */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-orange-600" />
                Thông báo khẩn / Chạy chữ đầu trang Căn tin
              </label>
              <textarea
                rows={2}
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                placeholder="Nhập thông báo gửi đến toàn bộ khách hàng..."
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium"
              />
            </div>

            {/* Fees & Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tên Căn Tin hiển thị
                </label>
                <input
                  type="text"
                  value={settingsForm.canteenName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, canteenName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phí phụ thu hộp mang đi (VND)
                </label>
                <input
                  type="number"
                  step="500"
                  value={settingsForm.takeawayFee}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, takeawayFee: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold"
                />
              </div>
            </div>

            {/* Operational Meal Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Giờ Bữa Sáng
                </label>
                <input
                  type="text"
                  value={settingsForm.breakfastHours}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, breakfastHours: e.target.value })
                  }
                  placeholder="06:30 - 09:30"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Giờ Bữa Trưa
                </label>
                <input
                  type="text"
                  value={settingsForm.lunchHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, lunchHours: e.target.value })}
                  placeholder="10:30 - 14:00"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Giờ Ăn Nhẹ Buổi Chiều
                </label>
                <input
                  type="text"
                  value={settingsForm.snackHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, snackHours: e.target.value })}
                  placeholder="14:00 - 18:00"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition shadow-xs"
              >
                Lưu toàn bộ cài đặt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: THÊM MÓN MỚI ================= */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-stone-900 text-lg">Thêm món ăn mới vào thực đơn</h3>
                <p className="text-xs text-stone-500">Món mới sẽ hiển thị ngay trên thực đơn của khách</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDishModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên món ăn *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Cơm sườn bì chả đặc biệt"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nhóm danh mục *</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Đơn giá bán (VND) *</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mô tả món ăn</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Thành phần nguyên liệu, hương vị..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">TG Chuẩn bị (phút)</label>
                  <input
                    type="number"
                    value={newPrepTime}
                    onChange={(e) => setNewPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Thẻ / Nhãn (cách nhau dấu phẩy)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Bán chạy, Món mới, Đậm vị"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Hình ảnh món</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  Lưu & Thêm vào Thực đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA MÓN (FULL EDIT) ================= */}
      {editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-stone-900 text-lg">Chỉnh sửa thông tin món ăn</h3>
                <p className="text-xs text-stone-500">Mã món: #{editingDish.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDishSubmit} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên món ăn *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nhóm danh mục</label>
                  <select
                    value={editingDish.categoryId}
                    onChange={(e) => setEditingDish({ ...editingDish, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Đơn giá bán (VND) *</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={editingDish.price}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mô tả món ăn</label>
                <textarea
                  rows={2}
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">TG Chuẩn bị (phút)</label>
                  <input
                    type="number"
                    value={editingDish.prepTimeMinutes}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        prepTimeMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Trạng thái bán</label>
                  <select
                    value={editingDish.isAvailable ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        isAvailable: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white font-semibold"
                  >
                    <option value="true">Đang mở bán</option>
                    <option value="false">Tạm hết hàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Hình ảnh</label>
                <input
                  type="url"
                  value={editingDish.image}
                  onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  Cập nhật thông tin món
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: XÁC NHẬN XÓA MÓN ================= */}
      {deletingDishId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Xác nhận xóa món ăn này?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Món ăn sẽ bị xóa vĩnh viễn khỏi thực đơn Căn tin. Bạn có chắc chắn không?
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setDeletingDishId(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NẠP TIỀN VÍ SINH VIÊN ================= */}
      {topUpUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" />
                Nạp tiền Ví Căn Tin
              </h3>
              <button
                type="button"
                onClick={() => setTopUpUserId(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTopUp} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Khách hàng nhận tiền:
                </label>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 font-bold text-stone-900">
                  {users.find((u) => u.id === topUpUserId)?.name} (
                  {users.find((u) => u.id === topUpUserId)?.studentCode})
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Số tiền nạp thêm (VND) *
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl font-black text-emerald-700"
                />
              </div>

              <div className="flex gap-1.5">
                {[20000, 50000, 100000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className="flex-1 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    +{amt / 1000}k
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTopUpUserId(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Xác nhận Nạp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
