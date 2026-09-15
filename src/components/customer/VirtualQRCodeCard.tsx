import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import {
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface VirtualQRCodeCardProps {
  amount: number;
  customerName: string;
  orderCode?: string;
  onSimulatePaymentSuccess?: () => void;
  compact?: boolean;
}

export const VirtualQRCodeCard: React.FC<VirtualQRCodeCardProps> = ({
  amount,
  customerName,
  orderCode = 'CT-NEW',
  onSimulatePaymentSuccess,
  compact = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<'mbbank' | 'vietcombank' | 'momo'>('mbbank');
  const [isSimulatedPaid, setIsSimulatedPaid] = useState<boolean>(false);

  // Bank accounts config
  const banks = {
    mbbank: {
      name: 'MB Bank',
      fullName: 'Ngân hàng TMCP Quân Đội',
      accountNumber: '0987654321',
      accountName: 'GIAP CAN TIN - CO DONG KHU A',
      badgeColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      lightBg: 'bg-blue-50',
    },
    vietcombank: {
      name: 'Vietcombank',
      fullName: 'Ngân hàng TMCP Ngoại Thương VN',
      accountNumber: '1023948576',
      accountName: 'GIAP CAN TIN - CO DONG KHU A',
      badgeColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      lightBg: 'bg-emerald-50',
    },
    momo: {
      name: 'Ví MoMo',
      fullName: 'Ví Điện Tử MoMo Căn Tin',
      accountNumber: '0988776655',
      accountName: 'GIAP CAN TIN - NGUYEN VAN GIAP',
      badgeColor: 'bg-pink-600',
      textColor: 'text-pink-600',
      borderColor: 'border-pink-500',
      lightBg: 'bg-pink-50',
    },
  };

  const activeBank = banks[selectedBank];
  const transferMemo = `${orderCode} ${customerName.trim().toUpperCase() || 'KHACH'}`.slice(0, 30);

  const handleCopy = (text: string, field: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSimulatePayment = () => {
    setIsSimulatedPaid(true);
    if (onSimulatePaymentSuccess) {
      onSimulatePaymentSuccess();
    }
  };

  return (
    <div className="rounded-2xl border-2 border-stone-800 bg-white overflow-hidden shadow-md">
      {/* Top VietQR Standard Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-wide text-white">
                VietQR Chuyển Khoản Tự Động
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-500 text-white">
                24/7
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Quét mã bằng bất kỳ App Ngân Hàng hoặc Ví Điện Tử nào
            </p>
          </div>
        </div>

        {/* Bank Switcher Tabs */}
        <div className="flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl border border-stone-700">
          {(['mbbank', 'vietcombank', 'momo'] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBank(b)}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition cursor-pointer ${
                selectedBank === b
                  ? `${banks[b].badgeColor} text-white shadow-xs`
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {banks[b].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: QR Code + Details */}
      <div className="p-4 sm:p-5 space-y-4">
        {isSimulatedPaid ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-emerald-900">
              Thanh Toán Thành Công!
            </h4>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto">
              Hệ thống đã ghi nhận số tiền <strong>{formatCurrency(amount)}</strong> từ tài khoản của bạn qua {activeBank.name}.
            </p>
            <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-800 flex justify-center items-center gap-2">
              <span>Mã GD: <strong>VQR-{Date.now().toString().slice(-6)}</strong></span>
              <span>•</span>
              <span>Trạng thái: <strong>ĐÃ XÁC NHẬN</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setIsSimulatedPaid(false)}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Hiển thị lại mã QR
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left: Authentic SVG QR Code Container */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="relative p-3 bg-white rounded-xl shadow-xs border border-stone-200 flex flex-col items-center">
                {/* Visual Corner Target Marks */}
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-orange-600" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-orange-600" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-orange-600" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-orange-600" />

                {/* Scalable Vector SVG QR Code with Finder Patterns */}
                <svg
                  viewBox="0 0 160 160"
                  className="w-36 h-36 sm:w-44 sm:h-44"
                  shapeRendering="crispEdges"
                >
                  {/* Background */}
                  <rect width="160" height="160" fill="#ffffff" />

                  {/* Top-Left Finder Pattern (7x7 outer, 5x5 white, 3x3 inner) */}
                  <rect x="10" y="10" width="35" height="35" fill="#1c1917" rx="4" />
                  <rect x="15" y="15" width="25" height="25" fill="#ffffff" rx="2" />
                  <rect x="20" y="20" width="15" height="15" fill="#ea580c" rx="2" />

                  {/* Top-Right Finder Pattern */}
                  <rect x="115" y="10" width="35" height="35" fill="#1c1917" rx="4" />
                  <rect x="120" y="15" width="25" height="25" fill="#ffffff" rx="2" />
                  <rect x="125" y="20" width="15" height="15" fill="#ea580c" rx="2" />

                  {/* Bottom-Left Finder Pattern */}
                  <rect x="10" y="115" width="35" height="35" fill="#1c1917" rx="4" />
                  <rect x="15" y="120" width="25" height="25" fill="#ffffff" rx="2" />
                  <rect x="20" y="125" width="15" height="15" fill="#ea580c" rx="2" />

                  {/* Timing Patterns */}
                  <line x1="50" y1="27" x2="110" y2="27" stroke="#1c1917" strokeWidth="2.5" strokeDasharray="5,5" />
                  <line x1="27" y1="50" x2="27" y2="110" stroke="#1c1917" strokeWidth="2.5" strokeDasharray="5,5" />

                  {/* Data Dots & Matrix Pattern simulating QR Payload */}
                  <g fill="#1c1917">
                    {/* Column blocks */}
                    <rect x="52" y="12" width="6" height="8" />
                    <rect x="64" y="10" width="8" height="6" />
                    <rect x="78" y="14" width="6" height="6" />
                    <rect x="90" y="10" width="8" height="8" />
                    <rect x="102" y="16" width="6" height="6" />

                    <rect x="50" y="36" width="8" height="6" />
                    <rect x="62" y="38" width="6" height="8" />
                    <rect x="76" y="34" width="8" height="6" />
                    <rect x="92" y="36" width="6" height="8" />
                    <rect x="104" y="38" width="6" height="6" />

                    {/* Middle grid */}
                    <rect x="12" y="52" width="6" height="6" />
                    <rect x="24" y="56" width="8" height="6" />
                    <rect x="36" y="50" width="6" height="8" />

                    <rect x="50" y="50" width="8" height="8" />
                    <rect x="64" y="54" width="6" height="6" />
                    <rect x="90" y="50" width="8" height="6" />
                    <rect x="102" y="54" width="6" height="8" />

                    <rect x="116" y="52" width="8" height="6" />
                    <rect x="130" y="54" width="6" height="8" />
                    <rect x="142" y="50" width="6" height="6" />

                    <rect x="12" y="70" width="8" height="8" />
                    <rect x="26" y="74" width="6" height="6" />
                    <rect x="38" y="70" width="6" height="8" />

                    <rect x="52" y="68" width="6" height="6" />
                    <rect x="102" y="70" width="6" height="6" />

                    <rect x="118" y="68" width="8" height="8" />
                    <rect x="132" y="72" width="6" height="6" />
                    <rect x="144" y="70" width="6" height="8" />

                    <rect x="12" y="90" width="6" height="8" />
                    <rect x="24" y="92" width="8" height="6" />
                    <rect x="38" y="88" width="6" height="6" />

                    <rect x="50" y="90" width="8" height="6" />
                    <rect x="64" y="92" width="6" height="8" />
                    <rect x="76" y="88" width="8" height="6" />
                    <rect x="90" y="92" width="6" height="6" />
                    <rect x="104" y="90" width="6" height="8" />

                    <rect x="116" y="92" width="6" height="6" />
                    <rect x="128" y="88" width="8" height="8" />
                    <rect x="142" y="92" width="6" height="6" />

                    {/* Bottom row patterns */}
                    <rect x="52" y="116" width="6" height="6" />
                    <rect x="66" y="120" width="8" height="8" />
                    <rect x="80" y="114" width="6" height="6" />
                    <rect x="94" y="118" width="8" height="6" />
                    <rect x="108" y="114" width="6" height="8" />

                    <rect x="54" y="132" width="8" height="6" />
                    <rect x="68" y="136" width="6" height="8" />
                    <rect x="82" y="130" width="6" height="6" />
                    <rect x="96" y="134" width="6" height="8" />
                    <rect x="108" y="130" width="8" height="6" />

                    <rect x="120" y="118" width="8" height="8" />
                    <rect x="134" y="122" width="6" height="6" />
                    <rect x="144" y="116" width="6" height="8" />

                    <rect x="118" y="136" width="6" height="8" />
                    <rect x="130" y="134" width="8" height="6" />
                    <rect x="142" y="138" width="6" height="6" />
                  </g>

                  {/* Center Badge (VietQR / Canteen icon) */}
                  <rect x="64" y="64" width="32" height="32" rx="6" fill="#ffffff" stroke="#e7e5e4" strokeWidth="1.5" />
                  <rect x="67" y="67" width="26" height="26" rx="4" fill="#ea580c" />
                  <text
                    x="80"
                    y="84"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    VQR
                  </text>
                </svg>

                <div className="mt-2 text-center">
                  <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest">
                    {activeBank.name} • VIETQR
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-stone-500 text-center mt-2 flex items-center justify-center gap-1">
                <Smartphone className="w-3 h-3 text-stone-400" />
                Quét mã để tự động điền tiền & nội dung
              </p>
            </div>

            {/* Right: Transfer Information & Quick Copy Buttons */}
            <div className="md:col-span-7 space-y-2.5 text-xs">
              {/* Amount Display */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-orange-800 font-bold block">
                    Số tiền cần thanh toán
                  </span>
                  <span className="text-lg font-black text-orange-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(amount.toString(), 'amount')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-orange-300 text-orange-700 hover:bg-orange-100 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedField === 'amount' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bank Details Table */}
              <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                {/* Account Number */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Số tài khoản</span>
                    <span className="font-mono font-black text-stone-900 text-sm tracking-wider">
                      {activeBank.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeBank.accountNumber, 'stk')}
                    className="px-2 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedField === 'stk' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Chép STK</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="border-t border-stone-200/60 pt-1.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Chủ tài khoản</span>
                    <span className="font-bold text-stone-800 text-[11px]">{activeBank.accountName}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                    {activeBank.fullName}
                  </span>
                </div>

                {/* Transfer Content Memo */}
                <div className="border-t border-stone-200/60 pt-1.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 font-medium block">Nội dung chuyển khoản (Memo)</span>
                    <span className="font-mono font-extrabold text-blue-800 text-xs bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-200">
                      {transferMemo}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferMemo, 'memo')}
                    className="px-2 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedField === 'memo' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Chép nội dung</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Action: Simulate Successful Payment */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Giả lập: Khách đã quét QR thành công (Xác nhận ngay)</span>
                </button>
                <p className="text-[10px] text-stone-400 text-center mt-1">
                  💡 Nhấn nút trên để test mô phỏng hoàn tất thanh toán tức thì mà không cần chuyển khoản thật!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
