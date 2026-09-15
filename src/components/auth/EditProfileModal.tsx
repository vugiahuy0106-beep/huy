import React, { useState } from 'react';
import { User } from '../../types';
import { PRESET_AVATARS } from '../../utils/appearance';
import { formatCurrency } from '../../utils/formatters';
import {
  X,
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap,
  Lock,
  Wallet,
  Check,
  ShieldCheck,
  Camera,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  onOpenAppearanceModal?: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onOpenAppearanceModal,
}) => {
  if (!isOpen || !currentUser) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'wallet'>('info');

  // Personal Info form
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [studentCode, setStudentCode] = useState(currentUser.studentCode || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Image upload simulation via FileReader
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      studentCode: studentCode.trim() || undefined,
      avatar: avatar.trim(),
    });

    onClose();
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (currentUser.password && currentPassword !== currentUser.password) {
      setPasswordError('Mật khẩu hiện tại không chính xác!');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    onUpdateProfile({ password: newPassword });
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 pb-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-500 text-white'
                      : currentUser.role === 'staff'
                      ? 'bg-blue-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'staff' ? 'Nhân viên' : 'Khách'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">{currentUser.name}</h2>
                <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-stone-400" /> {currentUser.email}
                </p>
                {currentUser.studentCode && (
                  <p className="text-[11px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" /> MSSV: {currentUser.studentCode}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-5 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" /> Thông tin cá nhân
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" /> Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Ví & Số dư
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Chọn Ảnh Đại Diện (Avatar)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer hover:scale-105 ${
                        avatar === av.url
                          ? 'border-orange-600 ring-2 ring-orange-400'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {avatar === av.url && (
                        <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom upload or custom URL */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 cursor-pointer font-medium">
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    <span>Tải ảnh từ máy tính</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className="text-orange-600 hover:underline font-semibold"
                  >
                    {showCustomAvatarInput ? 'Ẩn nhập link' : 'Hoặc dán URL ảnh'}
                  </button>
                </div>

                {showCustomAvatarInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      placeholder="Dán đường dẫn ảnh (https://...)"
                      value={customAvatarInput}
                      onChange={(e) => setCustomAvatarInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarInput.trim()) {
                          setAvatar(customAvatarInput.trim());
                        }
                      }}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Gia Huy"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Số điện thoại nhận thông báo gọi món
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Student Code */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mã số sinh viên (MSSV) / Mã nhân sự
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="Ví dụ: 22CT115 hoặc GV-882"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Giúp nhân viên đối soát nhận diện nhanh khi nhận đồ ăn tại quầy.
                </p>
              </div>

              {/* Email (Readonly or Editable) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email đăng nhập
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Appearance Quick Link */}
              {onOpenAppearanceModal && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAppearanceModal();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 hover:bg-amber-100/80 transition cursor-pointer text-xs"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Tùy chỉnh giao diện hiển thị (Màu sắc, Mật độ thẻ, Cỡ chữ)
                    </span>
                    <span className="text-amber-700 font-black">Cài đặt →</span>
                  </button>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  Lưu thay đổi thông tin
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Bảo mật tài khoản Giáp Căn Tin
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Mật khẩu cần tối thiểu 6 ký tự để bảo vệ số dư trong Thẻ Căn Tin của bạn.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đổi mật khẩu thành công! Đang lưu...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-semibold transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: WALLET STATUS */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs opacity-90">
                  <span className="font-semibold uppercase tracking-wider">Thẻ Căn Tin Điện Tử</span>
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded-md text-[11px]">
                    {currentUser.studentCode || 'HV-VIP'}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-orange-100">Số dư khả dụng hiện tại</p>
                  <p className="text-3xl font-black tracking-tight mt-0.5">
                    {formatCurrency(currentUser.walletBalance)}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-orange-100 border-t border-white/20">
                  <span>Chủ thẻ: <strong>{currentUser.name}</strong></span>
                  <span>Trạng thái: <strong>Hoạt động</strong></span>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2.5">
                <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Hướng dẫn nạp thêm tiền vào ví
                </h4>
                <p className="text-stone-600 leading-relaxed">
                  Để nạp tiền vào ví căn tin, bạn có thể:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-stone-600">
                  <li>Nạp trực tiếp tiền mặt tại <strong>Quầy Thu ngân Căn tin</strong>.</li>
                  <li>Nhờ <strong>Quản trị viên (Admin)</strong> quét mã nạp tiền nhanh trên hệ thống.</li>
                  <li>Thanh toán trực tiếp bằng quét mã <strong>VietQR</strong> khi đặt món nếu số dư chưa kịp nạp.</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-bold transition cursor-pointer"
                >
                  Đã hiểu & Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
