import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  GraduationCap,
  ChefHat,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'createdAt'>) => User;
  users: User[];
  defaultRolePrompt?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  users,
  defaultRolePrompt,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>(defaultRolePrompt || 'customer');
  const [regStudentCode, setRegStudentCode] = useState<string>('');

  if (!isOpen) return null;

  const handleQuickLogin = (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setErrorMessage('');
      onLogin(user);
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail ||
        (u.phone && u.phone === trimmedEmail) ||
        (u.studentCode && u.studentCode.toLowerCase() === trimmedEmail)
    );

    if (!user) {
      setErrorMessage('Không tìm thấy tài khoản với email/SĐT hoặc mã SV này.');
      return;
    }

    if (user.password && user.password !== loginPassword) {
      setErrorMessage('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      return;
    }

    onLogin(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }

    const existing = users.find(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (existing) {
      setErrorMessage('Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.');
      return;
    }

    const createdUser = onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim() || '0900000000',
      role: regRole,
      studentCode: regStudentCode.trim() || (regRole === 'customer' ? 'SV-NEW' : 'AD-NEW'),
      walletBalance: regRole === 'customer' ? 100000 : 2000000,
      avatar:
        regRole === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    onLogin(createdUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between relative">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Giáp Căn Tin Auth
            </span>
            <h2 className="text-xl font-black tracking-tight">
              {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-xs text-orange-100 mt-0.5">
              {mode === 'login'
                ? 'Đăng nhập để đặt món, tích lũy điểm và quản trị hệ thống'
                : 'Đăng ký nhanh chỉ trong 30 giây để đặt món online'}
            </p>
          </div>
          <button
            id="close-auth-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Đăng nhập thử nghiệm 1 chạm:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="quick-login-admin"
              type="button"
              onClick={() => handleQuickLogin('admin@giaccantin.vn')}
              className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-purple-950 truncate">Tài khoản Admin</p>
                <p className="text-[10px] text-purple-700 truncate">admin@giaccantin.vn</p>
              </div>
            </button>

            <button
              id="quick-login-customer"
              type="button"
              onClick={() => handleQuickLogin('khachhang@giaccantin.vn')}
              className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-orange-950 truncate">Khách hàng / SV</p>
                <p className="text-[10px] text-orange-700 truncate">Vũ Gia Huy</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email / Số điện thoại / Mã SV
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="VD: admin@giaccantin.vn hoặc SV-202409"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Mật khẩu</label>
                  <span className="text-[11px] text-stone-400">Demo mật khẩu: "admin" hoặc "123"</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Đăng nhập ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Chọn vai trò tài khoản *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center text-center gap-1 cursor-pointer transition ${
                      regRole === 'customer'
                        ? 'border-orange-600 bg-orange-50/80 text-orange-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Khách hàng</p>
                      <p className="text-[9px] text-stone-500 font-normal">Đặt món, ví</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('staff')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center text-center gap-1 cursor-pointer transition ${
                      regRole === 'staff'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Nhân viên</p>
                      <p className="text-[9px] text-stone-500 font-normal">Bếp & Quầy</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`p-2 rounded-xl border text-left flex flex-col items-center text-center gap-1 cursor-pointer transition ${
                      regRole === 'admin'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-950 font-bold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Quản trị viên</p>
                      <p className="text-[9px] text-stone-500 font-normal">Toàn quyền</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Họ và tên *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {regRole === 'customer' ? 'Mã SV / Mã khách' : regRole === 'staff' ? 'Mã nhân viên' : 'Mã quản lý'}
                  </label>
                  <input
                    type="text"
                    value={regStudentCode}
                    onChange={(e) => setRegStudentCode(e.target.value)}
                    placeholder={regRole === 'customer' ? 'SV-2024xx' : regRole === 'staff' ? 'NV-B01' : 'ADMIN-xx'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 3 ký tự"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {regRole === 'customer'
                    ? 'Tặng ngay 100.000 ₫ vào Ví Căn Tin khi tạo tài khoản khách hàng mới!'
                    : 'Tài khoản Admin có toàn quyền Quản lý món, Doanh thu và Cài đặt giá.'}
                </span>
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                Hoàn tất đăng ký & Đăng nhập
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          <div className="mt-4 pt-4 border-t border-stone-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-stone-600">
                Chưa có tài khoản Giáp Căn Tin?{' '}
                <button
                  id="switch-to-register-btn"
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Đăng ký tài khoản ngay
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-600">
                Đã có tài khoản?{' '}
                <button
                  id="switch-to-login-btn"
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Đăng nhập tại đây
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
