import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Users,
  UserCheck,
  ChefHat,
  ShieldCheck,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  Coins,
  Wallet,
  Phone,
  Mail,
  Lock,
  Sparkles,
  AlertTriangle,
  Check,
  X,
  UserPlus,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

interface UserManagementTabProps {
  users: User[];
  currentUser: User | null;
  onAddNewUser: (newUser: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onTopUpWallet: (userId: string, amount: number) => void;
}

const PRESET_AVATARS = [
  {
    role: 'staff',
    label: 'Bếp trưởng',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'staff',
    label: 'Đầu bếp nam',
    url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'staff',
    label: 'Thu ngân quầy',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'customer',
    label: 'Sinh viên nam',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'customer',
    label: 'Sinh viên nữ',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'customer',
    label: 'Thành viên trẻ',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'admin',
    label: 'Quản lý',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    role: 'admin',
    label: 'Giám sát',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  currentUser,
  onAddNewUser,
  onUpdateUser,
  onDeleteUser,
  onTopUpWallet,
}) => {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'has_balance' | 'zero'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [topUpUser, setTopUpUser] = useState<User | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);

  // Form State for Add User
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '123',
    role: 'staff' as UserRole,
    studentCode: '',
    walletBalance: 0,
    avatar: PRESET_AVATARS[0].url,
  });
  const [addError, setAddError] = useState<string | null>(null);

  // Form State for Edit User
  const [editForm, setEditForm] = useState<User | null>(null);
  const [editPasswordInput, setEditPasswordInput] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Summary counts
  const totalUsers = users.length;
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const staffCount = users.filter((u) => u.role === 'staff').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const totalSystemBalance = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

  // Filtered list
  const filteredUsers = users.filter((u) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone ? u.phone.includes(q) : false;
      const matchCode = u.studentCode ? u.studentCode.toLowerCase().includes(q) : false;
      if (!matchName && !matchEmail && !matchPhone && !matchCode) return false;
    }

    // Role match
    if (roleFilter !== 'all' && u.role !== roleFilter) {
      return false;
    }

    // Balance match
    if (balanceFilter === 'has_balance' && u.walletBalance <= 0) return false;
    if (balanceFilter === 'zero' && u.walletBalance > 0) return false;

    return true;
  });

  // Open Add Modal with preset role
  const handleOpenAdd = (defaultRole: UserRole = 'staff') => {
    const defaultAvatar =
      defaultRole === 'staff'
        ? PRESET_AVATARS[0].url
        : defaultRole === 'customer'
        ? PRESET_AVATARS[3].url
        : PRESET_AVATARS[6].url;

    setAddForm({
      name: '',
      email: '',
      phone: '',
      password: '123',
      role: defaultRole,
      studentCode: defaultRole === 'staff' ? `NV-${Math.floor(100 + Math.random() * 900)}` : `SV-${Math.floor(100000 + Math.random() * 900000)}`,
      walletBalance: defaultRole === 'customer' ? 50000 : 0,
      avatar: defaultAvatar,
    });
    setAddError(null);
    setIsAddModalOpen(true);
  };

  // Submit Add User
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      setAddError('Vui lòng nhập họ và tên.');
      return;
    }
    if (!addForm.email.trim() && !addForm.phone.trim()) {
      setAddError('Vui lòng nhập ít nhất Email hoặc Số điện thoại để đăng nhập.');
      return;
    }

    // Check duplicate email
    if (addForm.email.trim()) {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === addForm.email.trim().toLowerCase()
      );
      if (emailExists) {
        setAddError('Email này đã được sử dụng bởi một tài khoản khác.');
        return;
      }
    }

    onAddNewUser({
      name: addForm.name.trim(),
      email: addForm.email.trim() || `${addForm.studentCode || Date.now()}@giaccantin.vn`,
      phone: addForm.phone.trim(),
      password: addForm.password || '123',
      role: addForm.role,
      studentCode: addForm.studentCode.trim(),
      walletBalance: Math.max(0, Number(addForm.walletBalance) || 0),
      avatar: addForm.avatar || PRESET_AVATARS[0].url,
    });

    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ ...user });
    setEditPasswordInput('');
    setEditError(null);
  };

  // Submit Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (!editForm.name.trim()) {
      setEditError('Họ và tên không được để trống.');
      return;
    }

    // Check email collision
    if (editForm.email.trim()) {
      const emailCollision = users.some(
        (u) => u.id !== editForm.id && u.email.toLowerCase() === editForm.email.trim().toLowerCase()
      );
      if (emailCollision) {
        setEditError('Email này đã thuộc về tài khoản khác.');
        return;
      }
    }

    // Check admin demotion safety
    if (editingUser?.role === 'admin' && editForm.role !== 'admin') {
      const remainingAdmins = users.filter((u) => u.role === 'admin' && u.id !== editForm.id).length;
      if (remainingAdmins < 1) {
        setEditError('Hệ thống phải duy trì ít nhất 1 Quản trị viên (Admin).');
        return;
      }
    }

    const updated: User = {
      ...editForm,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      studentCode: editForm.studentCode?.trim(),
      walletBalance: Math.max(0, Number(editForm.walletBalance) || 0),
      password: editPasswordInput.trim() ? editPasswordInput.trim() : editForm.password,
    };

    onUpdateUser(updated);
    setEditingUser(null);
    setEditForm(null);
  };

  // Confirm Delete User
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    onDeleteUser(deletingUser.id);
    setDeletingUser(null);
  };

  // Confirm Top-up
  const handleConfirmTopUp = () => {
    if (!topUpUser || topUpAmount <= 0) return;
    onTopUpWallet(topUpUser.id, topUpAmount);
    setTopUpUser(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-orange-100 text-orange-700">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900">
                Quản Lý Nhân Viên & Khách Hàng
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Thêm, chỉnh sửa thông tin, phân quyền chức vụ (Bếp, Quầy, Admin) và quản lý ví căn tin
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="admin-add-staff-btn"
              type="button"
              onClick={() => handleOpenAdd('staff')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              <span>+ Thêm Nhân Viên</span>
            </button>

            <button
              id="admin-add-customer-btn"
              type="button"
              onClick={() => handleOpenAdd('customer')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>+ Thêm Khách Hàng</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Tổng tài khoản</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">{totalUsers}</p>
            <span className="text-[10px] text-stone-500">Trong toàn hệ thống</span>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/70">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Nhân viên Bếp/Quầy</p>
              <ChefHat className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-black text-blue-950 mt-0.5">{staffCount}</p>
            <span className="text-[10px] text-blue-700">Vận hành & nấu nướng</span>
          </div>

          <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-200/70">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-orange-800 uppercase tracking-wider">Khách hàng</p>
              <GraduationCap className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-xl font-black text-orange-950 mt-0.5">{customerCount}</p>
            <span className="text-[10px] text-orange-700">Sinh viên & Giảng viên</span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/70">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Tổng số dư ví</p>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-emerald-950 mt-0.5">{formatCurrency(totalSystemBalance)}</p>
            <span className="text-[10px] text-emerald-700">Tiền khả dụng trong ví</span>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT hoặc mã SV / mã nhân viên..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Tất cả ({totalUsers})
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('staff')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'staff'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Nhân viên ({staffCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('customer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'customer'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khách hàng ({customerCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'admin'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin ({adminCount})</span>
          </button>
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <tr>
                <th className="p-3.5">Thành viên</th>
                <th className="p-3.5">Vai trò & Chức vụ</th>
                <th className="p-3.5">Mã NV / Mã SV</th>
                <th className="p-3.5">Liên hệ</th>
                <th className="p-3.5">Số dư Ví</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    <p className="font-semibold text-sm">Không tìm thấy nhân viên hoặc khách hàng nào</p>
                    <p className="text-xs text-stone-400 mt-1">
                      Thử thay đổi từ khóa tìm kiếm hoặc bấm nút thêm thành viên mới
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentLoggedIn = currentUser?.id === u.id;
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-stone-50/80 transition ${
                        isCurrentLoggedIn ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border border-stone-200"
                              referrerPolicy="no-referrer"
                            />
                            {isCurrentLoggedIn && (
                              <span
                                title="Đang đăng nhập"
                                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-stone-900">{u.name}</p>
                              {isCurrentLoggedIn && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3.5">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Quản trị viên</span>
                          </span>
                        ) : u.role === 'staff' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            <ChefHat className="w-3 h-3" />
                            <span>Nhân viên Bếp / Quầy</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200">
                            <GraduationCap className="w-3 h-3" />
                            <span>Khách hàng</span>
                          </span>
                        )}
                      </td>

                      {/* Code */}
                      <td className="p-3.5 font-bold text-stone-800 font-mono">
                        {u.studentCode || (
                          <span className="text-stone-400 font-normal italic">Chưa cấp</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 text-stone-600 font-medium">
                        {u.phone || <span className="text-stone-400 italic">Chưa có</span>}
                      </td>

                      {/* Balance */}
                      <td className="p-3.5 font-extrabold text-stone-900">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formatCurrency(u.walletBalance)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Nạp tiền */}
                          <button
                            type="button"
                            onClick={() => {
                              setTopUpUser(u);
                              setTopUpAmount(50000);
                            }}
                            title="Nạp tiền vào ví"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition cursor-pointer"
                          >
                            <Coins className="w-4 h-4" />
                          </button>

                          {/* Sửa */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            title="Sửa thông tin nhân viên / khách hàng"
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Xóa */}
                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            title="Xóa tài khoản"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: THÊM NGƯỜI DÙNG MỚI ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Thêm Nhân Viên / Khách Hàng Mới</h3>
                  <p className="text-xs text-stone-300">Tạo tài khoản thành viên để đặt món hoặc vận hành bếp</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {addError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              {/* Select Role */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Chọn vai trò tài khoản *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddForm({
                        ...addForm,
                        role: 'staff',
                        studentCode: addForm.studentCode.startsWith('SV-')
                          ? `NV-${Math.floor(100 + Math.random() * 900)}`
                          : addForm.studentCode,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      addForm.role === 'staff'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <ChefHat className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold">Nhân viên</span>
                    <span className="text-[10px] text-stone-500">Bếp & Quầy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddForm({
                        ...addForm,
                        role: 'customer',
                        studentCode: addForm.studentCode.startsWith('NV-')
                          ? `SV-${Math.floor(100000 + Math.random() * 900000)}`
                          : addForm.studentCode,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      addForm.role === 'customer'
                        ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-bold">Khách hàng</span>
                    <span className="text-[10px] text-stone-500">Sinh viên/Khách</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, role: 'admin' })}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      addForm.role === 'admin'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-bold">Admin</span>
                    <span className="text-[10px] text-stone-500">Toàn quyền</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="VD: Trần Văn Bình (Đầu bếp) hoặc Nguyễn Thu Thảo"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email đăng nhập *
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="VD: nhanvien.bep@giaccantin.vn"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Code & Initial Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {addForm.role === 'staff'
                      ? 'Mã nhân viên (NV-xxx)'
                      : addForm.role === 'admin'
                      ? 'Mã quản lý (ADMIN-xx)'
                      : 'Mã SV / Thẻ cán bộ'}
                  </label>
                  <input
                    type="text"
                    value={addForm.studentCode}
                    onChange={(e) => setAddForm({ ...addForm, studentCode: e.target.value })}
                    placeholder={addForm.role === 'staff' ? 'NV-B02' : 'SV-202488'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mật khẩu khởi tạo *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="123"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Initial Wallet Balance */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Số dư nạp ban đầu vào ví (VNĐ)</span>
                  <span className="text-orange-600 font-extrabold">{formatCurrency(addForm.walletBalance || 0)}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={addForm.walletBalance}
                    onChange={(e) => setAddForm({ ...addForm, walletBalance: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    {[50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAddForm({ ...addForm, walletBalance: amt })}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-stone-700 transition cursor-pointer"
                      >
                        +{amt / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preset Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Chọn ảnh đại diện
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((av, idx) => {
                    const isSelected = addForm.avatar === av.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAddForm({ ...addForm, avatar: av.url })}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-500/20 shadow-2xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-stone-600 font-medium truncate w-full text-center">
                          {av.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                >
                  Tạo tài khoản ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA THÔNG TIN NGƯỜI DÙNG ================= */}
      {editingUser && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Chỉnh Sửa Thông Tin Thành Viên</h3>
                  <p className="text-xs text-stone-300">Cập nhật chức vụ, số điện thoại hoặc đổi mật khẩu</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setEditForm(null);
                }}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Role Selection (Thăng chức / Chuyển vai trò) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Phân quyền & Vai trò *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: 'staff' })}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      editForm.role === 'staff'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <ChefHat className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold">Nhân viên</span>
                    <span className="text-[10px] text-stone-500">Bếp & Quầy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: 'customer' })}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      editForm.role === 'customer'
                        ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-bold">Khách hàng</span>
                    <span className="text-[10px] text-stone-500">Sinh viên/Khách</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: 'admin' })}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                      editForm.role === 'admin'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-bold">Admin</span>
                    <span className="text-[10px] text-stone-500">Toàn quyền</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Code & New Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mã SV / Mã Nhân viên
                  </label>
                  <input
                    type="text"
                    value={editForm.studentCode || ''}
                    onChange={(e) => setEditForm({ ...editForm, studentCode: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Đặt lại mật khẩu mới
                  </label>
                  <input
                    type="text"
                    value={editPasswordInput}
                    onChange={(e) => setEditPasswordInput(e.target.value)}
                    placeholder="Để trống nếu không đổi"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Wallet Balance adjustment */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Điều chỉnh số dư ví (VNĐ)</span>
                  <span className="text-emerald-700 font-extrabold">{formatCurrency(editForm.walletBalance || 0)}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={editForm.walletBalance}
                  onChange={(e) => setEditForm({ ...editForm, walletBalance: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Change Avatar */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Đổi ảnh đại diện
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((av, idx) => {
                    const isSelected = editForm.avatar === av.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, avatar: av.url })}
                        className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 shadow-2xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.label}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] text-stone-600 font-medium truncate w-full text-center">
                          {av.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setEditForm(null);
                  }}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: XÁC NHẬN XÓA TÀI KHOẢN ================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Xác nhận xóa tài khoản?
              </h3>
              <p className="text-xs text-stone-500">
                Bạn có chắc chắn muốn xóa thành viên{' '}
                <strong className="text-stone-900">{deletingUser.name}</strong> (
                {deletingUser.role === 'staff'
                  ? 'Nhân viên Bếp'
                  : deletingUser.role === 'admin'
                  ? 'Quản trị viên'
                  : 'Khách hàng'}
                ) khỏi hệ thống căn tin?
              </p>
            </div>

            {/* Warning if wallet has balance */}
            {deletingUser.walletBalance > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Tài khoản này hiện vẫn còn <strong>{formatCurrency(deletingUser.walletBalance)}</strong> trong ví căn tin!
                </span>
              </div>
            )}

            {deletingUser.role === 'admin' && adminCount <= 1 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đây là Quản trị viên duy nhất. Bạn không thể xóa tài khoản admin cuối cùng!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deletingUser.role === 'admin' && adminCount <= 1}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
              >
                Xác nhận xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NẠP TIỀN VÀO VÍ ================= */}
      {topUpUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={topUpUser.avatar}
                alt={topUpUser.name}
                className="w-12 h-12 rounded-full object-cover border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{topUpUser.name}</h4>
                <p className="text-xs text-stone-500">
                  Số dư hiện tại: <strong className="text-emerald-700">{formatCurrency(topUpUser.walletBalance)}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Chọn số tiền nạp thêm
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[20000, 50000, 100000, 200000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      topUpAmount === amt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    +{amt.toLocaleString('vi-VN')} ₫
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="5000"
                step="5000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 flex items-center justify-between font-bold">
              <span>Số dư sau nạp:</span>
              <span className="text-sm font-black">{formatCurrency(topUpUser.walletBalance + (topUpAmount || 0))}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setTopUpUser(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmTopUp}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
              >
                Xác nhận nạp tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
