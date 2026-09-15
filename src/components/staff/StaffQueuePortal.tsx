import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatTime, formatCurrency } from '../../utils/formatters';
import {
  ChefHat,
  Flame,
  BellRing,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Soup,
} from 'lucide-react';

interface StaffQueuePortalProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onSimulateNewOrder: () => void;
  onCallOutOrder: (order: Order) => void;
}

export const StaffQueuePortal: React.FC<StaffQueuePortalProps> = ({
  orders,
  onUpdateOrderStatus,
  onSimulateNewOrder,
  onCallOutOrder,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'dine_in' | 'takeaway'>('all');
  const [searchCode, setSearchCode] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchType = filterType === 'all' || ord.tableOrPickupType === filterType;
    const matchSearch =
      ord.orderCode.toLowerCase().includes(searchCode.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchCode.toLowerCase());
    return matchType && matchSearch;
  });

  const pendingOrders = filteredOrders.filter((o) => o.status === 'pending');
  const cookingOrders = filteredOrders.filter((o) => o.status === 'cooking');
  const readyOrders = filteredOrders.filter((o) => o.status === 'ready');
  const completedOrders = filteredOrders.filter((o) => o.status === 'completed');

  // Elapsed minutes helper
  const getElapsedMins = (createdAt: string) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top KDS Control Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-wide text-white">
              MÀN HÌNH BẾP & ĐIỀU PHỐI (KDS QUEUE)
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time
            </span>
          </div>
          <p className="text-xs text-stone-400">
            Điều phối chế biến thức ăn, tối ưu thứ tự đơn hàng giờ cao điểm tại Giáp Căn Tin
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              soundEnabled
                ? 'bg-stone-800 text-emerald-400 border-stone-700'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Chuông báo: {soundEnabled ? 'BẬT' : 'TẮT'}</span>
          </button>

          {/* Quick simulator: Tạo đơn hàng mẫu từ khách để test live stream */}
          <button
            type="button"
            onClick={onSimulateNewOrder}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Giả lập đơn mới
          </button>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filterType === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('dine_in')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filterType === 'dine_in'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🍽️ Dùng tại chỗ
          </button>
          <button
            type="button"
            onClick={() => setFilterType('takeaway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filterType === 'takeaway'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🥡 Mang đi
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo #Mã đơn hoặc tên khách..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 4-Column Kanban KDS Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Column 1: Chờ chế biến */}
        <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="font-extrabold text-amber-900 text-sm">CHỜ CHẾ BIẾN</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-stone-400">Không có đơn chờ mới</p>
            ) : (
              pendingOrders.map((ord) => {
                const elapsed = getElapsedMins(ord.createdAt);
                const isOverdue = elapsed > 10;
                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-amber-800">
                        #{ord.orderCode}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-700 font-extrabold animate-pulse'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Clock className="w-3 h-3" /> {elapsed} phút trước
                      </span>
                    </div>

                    <div className="text-xs">
                      <p className="font-bold text-stone-800">{ord.customerName}</p>
                      <p className="text-[11px] text-stone-500">
                        {ord.tableOrPickupType === 'dine_in' ? '🍽️ Ăn tại chỗ' : '🥡 Mang về'} •{' '}
                        {formatTime(ord.createdAt)}
                      </p>
                    </div>

                    {/* Order items */}
                    <div className="bg-amber-50/70 p-2.5 rounded-lg text-xs space-y-1.5 border border-amber-100">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium text-stone-800">
                          <span>
                            <strong>{item.quantity}x</strong> {item.name}
                          </span>
                        </div>
                      ))}
                      {ord.note && (
                        <p className="text-[11px] text-amber-800 bg-amber-100/60 p-1 rounded font-medium mt-1">
                          ⚠️ Ghi chú: {ord.note}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(ord.id, 'cooking')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Flame className="w-3.5 h-3.5" /> Bắt đầu nấu
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Đang nấu */}
        <div className="bg-blue-50/50 rounded-2xl border border-blue-200 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-blue-700" />
              <h3 className="font-extrabold text-blue-900 text-sm">ĐANG CHẾ BIẾN</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-200 text-blue-900">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {cookingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-stone-400">Bếp đang trống</p>
            ) : (
              cookingOrders.map((ord) => {
                const elapsed = getElapsedMins(ord.createdAt);
                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-xl border border-blue-200 p-3.5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-blue-800">
                        #{ord.orderCode}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Chờ {elapsed}p
                      </span>
                    </div>

                    <div className="text-xs">
                      <p className="font-bold text-stone-800">{ord.customerName}</p>
                      <p className="text-[11px] text-stone-500">
                        {ord.tableOrPickupType === 'dine_in' ? '🍽️ Ăn tại chỗ' : '🥡 Mang về'}
                      </p>
                    </div>

                    {/* Order items */}
                    <div className="bg-stone-50 p-2.5 rounded-lg text-xs space-y-1.5 border border-stone-200">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium text-stone-800">
                          <span>
                            <strong>{item.quantity}x</strong> {item.name}
                          </span>
                        </div>
                      ))}
                      {ord.note && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-1 rounded font-medium mt-1">
                          ⚠️ Ghi chú: {ord.note}
                        </p>
                      )}
                    </div>

                    {/* Action */}
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatus(ord.id, 'ready');
                        onCallOutOrder(ord);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <BellRing className="w-3.5 h-3.5" /> Báo xong & Gọi món
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Sẵn sàng lấy món */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-emerald-900 text-sm">CHỜ KHÁCH LẤY</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-200 text-emerald-900">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-stone-400">Không có đơn chờ nhận</p>
            ) : (
              readyOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-xl border-2 border-emerald-400 p-3.5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xl text-emerald-700 tracking-tight">
                      #{ord.orderCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCallOutOrder(ord)}
                      className="text-[11px] px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 transition flex items-center gap-1 cursor-pointer"
                      title="Phát loa gọi lại số này"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Nhắc loa
                    </button>
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-stone-800">{ord.customerName}</p>
                    <p className="text-[11px] text-stone-500">{ord.items.length} phần món ăn</p>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    onClick={() => onUpdateOrderStatus(ord.id, 'completed')}
                    className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Đã giao cho khách
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Hoàn thành */}
        <div className="bg-stone-100/60 rounded-2xl border border-stone-200 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-stone-600" />
              <h3 className="font-extrabold text-stone-800 text-sm">ĐÃ GIAO XONG</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-stone-200 text-stone-700">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {completedOrders.slice(0, 5).map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-xl border border-stone-200 p-3 opacity-80 text-xs space-y-1"
              >
                <div className="flex justify-between items-center font-bold text-stone-800">
                  <span>#{ord.orderCode}</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    {formatTime(ord.updatedAt)}
                  </span>
                </div>
                <p className="text-stone-600 truncate">{ord.customerName}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  {formatCurrency(ord.totalAmount)} ({ord.paymentMethod.toUpperCase()})
                </p>
              </div>
            ))}
            {completedOrders.length > 5 && (
              <p className="text-center text-[11px] text-stone-400">
                và {completedOrders.length - 5} đơn khác...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
