import React, { useState, useRef } from 'react';
import { AppearanceSettings, ThemeColor } from '../../types';
import {
  THEME_PALETTES,
  DEFAULT_APPEARANCE,
  FOOD_BACKGROUND_PRESETS,
  HERO_BANNER_PRESETS,
} from '../../utils/appearance';
import { formatCurrency } from '../../utils/formatters';
import {
  X,
  Palette,
  LayoutGrid,
  Type,
  Volume2,
  VolumeX,
  Eye,
  Check,
  Sparkles,
  Sliders,
  RotateCcw,
  Plus,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Layers,
} from 'lucide-react';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  appearance?: AppearanceSettings;
  settings?: AppearanceSettings;
  onChangeAppearance?: (newSettings: AppearanceSettings) => void;
  onSaveSettings?: (newSettings: AppearanceSettings) => void;
  onResetAppearance?: () => void;
}

type TabKey = 'wallpaper' | 'banner' | 'theme' | 'layout';

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  appearance: propAppearance,
  settings,
  onChangeAppearance,
  onSaveSettings,
  onResetAppearance,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('wallpaper');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [urlInputError, setUrlInputError] = useState<string | null>(null);

  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const appearance: AppearanceSettings = propAppearance || settings || DEFAULT_APPEARANCE;
  const currentPalette = THEME_PALETTES[appearance?.themeColor] || THEME_PALETTES.orange;

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    const updated = {
      ...appearance,
      [key]: value,
    };
    if (onChangeAppearance) onChangeAppearance(updated);
    if (onSaveSettings) onSaveSettings(updated);
  };

  const updateMultipleSettings = (partial: Partial<AppearanceSettings>) => {
    const updated = {
      ...appearance,
      ...partial,
    };
    if (onChangeAppearance) onChangeAppearance(updated);
    if (onSaveSettings) onSaveSettings(updated);
  };

  const handleReset = () => {
    if (onResetAppearance) {
      onResetAppearance();
    } else {
      if (onChangeAppearance) onChangeAppearance(DEFAULT_APPEARANCE);
      if (onSaveSettings) onSaveSettings(DEFAULT_APPEARANCE);
    }
  };

  // Handle local image file upload for Wallpaper
  const handleWallpaperFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateMultipleSettings({
          backgroundImage: result,
          backgroundPreset: 'custom',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL submit for Wallpaper
  const handleApplyCustomWallpaperUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWallpaperUrl.trim()) return;

    try {
      new URL(customWallpaperUrl);
      updateMultipleSettings({
        backgroundImage: customWallpaperUrl.trim(),
        backgroundPreset: 'custom',
      });
      setUrlInputError(null);
    } catch {
      setUrlInputError('Địa chỉ URL ảnh không hợp lệ. Vui lòng kiểm tra lại đường dẫn https://');
    }
  };

  // Handle local image file upload for Banner
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateMultipleSettings({
          heroBannerImage: result,
          heroBannerPreset: 'custom',
          showHeroImage: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL submit for Banner
  const handleApplyCustomBannerUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBannerUrl.trim()) return;

    try {
      new URL(customBannerUrl);
      updateMultipleSettings({
        heroBannerImage: customBannerUrl.trim(),
        heroBannerPreset: 'custom',
        showHeroImage: true,
      });
      setUrlInputError(null);
    } catch {
      setUrlInputError('Địa chỉ URL banner không hợp lệ.');
    }
  };

  const bgOpacity = appearance.backgroundOpacity ?? 0.35;
  const bgBlur = appearance.backgroundBlur ?? 1;
  const bgOverlay = appearance.backgroundOverlay ?? 'warm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-6 pb-4 shrink-0 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Tùy Biến Giao Diện & Hình Nền Ẩm Thực
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Mới
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Thay đổi hình nền đồ ăn, ảnh banner căn tin và màu sắc giao diện theo sở thích
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Đặt lại giao diện mặc định"
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-100 px-4 pt-2 border-b border-stone-200 flex gap-1.5 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('wallpaper')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'wallpaper'
                ? 'bg-white text-orange-600 shadow-2xs border-t-2 border-orange-500'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <span>🍲</span>
            <span>Hình Nền Đồ Ăn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banner')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'banner'
                ? 'bg-white text-orange-600 shadow-2xs border-t-2 border-orange-500'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <span>🖼️</span>
            <span>Ảnh Banner Căn Tin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-white text-orange-600 shadow-2xs border-t-2 border-orange-500'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Màu Sắc Chủ Đạo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'layout'
                ? 'bg-white text-orange-600 shadow-2xs border-t-2 border-orange-500'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
            <span>Bố Cục & Trợ Năng</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: FOOD WALLPAPER BACKGROUND */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Wallpaper Presets */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🍲</span> Chọn Mẫu Hình Nền Ẩm Thực
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Áp dụng nền cho toàn bộ không gian ứng dụng
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FOOD_BACKGROUND_PRESETS.map((preset) => {
                    const isSelected =
                      appearance.backgroundPreset === preset.id ||
                      appearance.backgroundImage === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() =>
                          updateMultipleSettings({
                            backgroundImage: preset.url,
                            backgroundPreset: preset.id,
                          })
                        }
                        className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all text-left flex flex-col group ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-[1.02]'
                            : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="h-24 w-full relative overflow-hidden bg-stone-100">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {preset.tag}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                          <div className="absolute bottom-1.5 left-2.5 right-2">
                            <p className="text-xs font-bold text-white leading-tight truncate">
                              {preset.name}
                            </p>
                          </div>
                        </div>
                        <div className="p-2 bg-stone-50 text-[11px] text-stone-600 line-clamp-1 border-t border-stone-100">
                          {preset.subtitle}
                        </div>
                      </div>
                    );
                  })}

                  {/* Option: Disable Background (Clean minimalist mode) */}
                  <div
                    onClick={() =>
                      updateMultipleSettings({
                        backgroundImage: '',
                        backgroundPreset: 'none',
                      })
                    }
                    className={`rounded-2xl border-2 p-3 cursor-pointer transition-all flex flex-col justify-center items-center text-center gap-1.5 min-h-[96px] ${
                      appearance.backgroundPreset === 'none' || !appearance.backgroundImage
                        ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900/15'
                        : 'border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-600 flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">Không Dùng Ảnh Nền</p>
                      <p className="text-[10px] text-stone-500">Màu ấm tối giản tiêu chuẩn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Image Upload or External URL */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-orange-500" />
                  Tải Ảnh Nền Đồ Ăn Của Bạn Hoặc Nhập Link
                </h4>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    ref={wallpaperInputRef}
                    onChange={handleWallpaperFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => wallpaperInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition cursor-pointer shadow-2xs shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Tải ảnh từ máy tính</span>
                  </button>

                  <form onSubmit={handleApplyCustomWallpaperUrl} className="flex-1 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="url"
                        placeholder="Hoặc dán URL ảnh đồ ăn (https://...)"
                        value={customWallpaperUrl}
                        onChange={(e) => {
                          setCustomWallpaperUrl(e.target.value);
                          setUrlInputError(null);
                        }}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Áp dụng
                    </button>
                  </form>
                </div>
                {urlInputError && (
                  <p className="text-[11px] text-rose-600 font-medium">{urlInputError}</p>
                )}
              </div>

              {/* Background Adjustments: Opacity, Blur, Overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/90">
                {/* Opacity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-orange-500" />
                      Độ đậm hình nền
                    </label>
                    <span className="text-xs font-bold text-orange-600">
                      {Math.round(bgOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.75"
                    step="0.05"
                    value={bgOpacity}
                    onChange={(e) => updateSetting('backgroundOpacity', parseFloat(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Gợi ý: 30% - 45% giúp hình nền ẩm thực nổi bật nhưng chữ và thẻ món vẫn đọc rõ nét.
                  </p>
                </div>

                {/* Blur Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      Độ mờ hậu cảnh (Blur)
                    </label>
                    <span className="text-xs font-bold text-blue-600">{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={bgBlur}
                    onChange={(e) => updateSetting('backgroundBlur', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    0px: Ảnh sắc nét nguyên bản; 1-3px: Chiều sâu trường ảnh tinh tế.
                  </p>
                </div>

                {/* Overlay Filter Option */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    Lớp phủ bảo vệ tương phản (Overlay Filter)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'warm', label: 'Ấm Áp Căn Tin', desc: 'Tone nâu gỗ ấm' },
                      { id: 'cream', label: 'Kem Dịu', desc: 'Sáng nhẹ nhàng' },
                      { id: 'dark', label: 'Trầm Tối', desc: 'Tương phản mạnh' },
                      { id: 'glass', label: 'Phủ Mờ Sương', desc: 'Hiện đại, nhẹ' },
                    ].map((item) => {
                      const isSelected = bgOverlay === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            updateSetting(
                              'backgroundOverlay',
                              item.id as 'warm' | 'cream' | 'dark' | 'glass'
                            )
                          }
                          className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold shadow-2xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <p className="text-xs">{item.label}</p>
                          <p className="text-[10px] text-stone-500">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER IMAGE */}
          {activeTab === 'banner' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Toggle Show Hero Image */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-900">Hiển thị ảnh nền trên Banner Căn tin</p>
                  <p className="text-[11px] text-stone-500">
                    Trang trí đầu trang bằng hình ảnh chụp món ăn, quầy bếp sống động
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSetting('showHeroImage', appearance.showHeroImage === false ? true : false)
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                    appearance.showHeroImage !== false ? 'bg-orange-600' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      appearance.showHeroImage !== false ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Banner Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
                  Bộ Sưu Tập Banner Căn Tin Sẵn Có
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HERO_BANNER_PRESETS.map((preset) => {
                    const isSelected =
                      appearance.heroBannerPreset === preset.id ||
                      appearance.heroBannerImage === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() =>
                          updateMultipleSettings({
                            heroBannerImage: preset.url,
                            heroBannerPreset: preset.id,
                            showHeroImage: true,
                          })
                        }
                        className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all text-left flex flex-col group ${
                          isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="h-28 w-full relative overflow-hidden bg-stone-100">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                          <div className="absolute bottom-2 left-3 right-3">
                            <p className="text-xs font-bold text-white leading-snug">
                              {preset.name}
                            </p>
                            <p className="text-[10px] text-white/80 line-clamp-1">{preset.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Banner Upload */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                  Đổi Ảnh Banner Theo Ý Muốn
                </h4>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition cursor-pointer shadow-2xs shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Tải ảnh banner lên</span>
                  </button>

                  <form onSubmit={handleApplyCustomBannerUrl} className="flex-1 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="url"
                        placeholder="Dán link ảnh banner (https://...)"
                        value={customBannerUrl}
                        onChange={(e) => setCustomBannerUrl(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Áp dụng
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THEME COLOR */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Bộ Màu Chủ Đạo (Theme Palette)
                  </span>
                  <span className="text-[11px] font-normal text-stone-500">
                    Đang chọn: <strong>{currentPalette.name}</strong>
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(Object.keys(THEME_PALETTES) as ThemeColor[]).map((themeKey) => {
                    const palette = THEME_PALETTES[themeKey];
                    const isSelected = appearance.themeColor === themeKey;
                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => updateSetting('themeColor', themeKey)}
                        className={`p-2.5 rounded-2xl border-2 text-left transition cursor-pointer relative flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-stone-900 bg-stone-50 shadow-xs ring-2 ring-stone-900/10'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl shadow-xs flex items-center justify-center text-white"
                          style={{ backgroundColor: palette.previewColor }}
                        >
                          {isSelected && <Check className="w-5 h-5 drop-shadow-sm stroke-[3]" />}
                        </div>
                        <div className="text-center w-full">
                          <p className="text-xs font-bold text-stone-800 truncate">{palette.name}</p>
                          <span className="text-[10px] text-stone-500 block">{palette.badgeLabel}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & DENSITY */}
          {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Card Density */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                  Mật Độ Hiển Thị Thẻ Món Ăn
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSetting('cardDensity', 'spacious')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-3 ${
                      appearance.cardDensity === 'spacious'
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        appearance.cardDensity === 'spacious'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Thoáng Đãng & Chi Tiết</p>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        Hình ảnh món to rõ, đầy đủ mô tả nguyên liệu và nút bấm rộng rãi.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('cardDensity', 'compact')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-3 ${
                      appearance.cardDensity === 'compact'
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        appearance.cardDensity === 'compact'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Gọn Gàng & Xem Nhanh</p>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        Thẻ tối ưu diện tích, hiển thị được nhiều món ăn trên màn hình hơn.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-purple-500" />
                  Cỡ Chữ Toàn Hệ Thống
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSetting('fontSize', 'normal')}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                      appearance.fontSize === 'normal'
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">Tiêu Chuẩn (100%)</p>
                      <p className="text-[11px] text-stone-500">Cân đối, tối ưu màn hình laptop & tablet</p>
                    </div>
                    {appearance.fontSize === 'normal' && <Check className="w-4 h-4 text-stone-900" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting('fontSize', 'large')}
                    className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                      appearance.fontSize === 'large'
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">Cỡ Lớn Dễ Đọc (115%)</p>
                      <p className="text-[11px] text-stone-500">To rõ, dễ nhìn khi đứng xa quầy hoặc trên điện thoại</p>
                    </div>
                    {appearance.fontSize === 'large' && <Check className="w-4 h-4 text-stone-900" />}
                  </button>
                </div>
              </div>

              {/* Sound & Contrast Options */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Trợ Năng & Âm Thanh
                </h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {appearance.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-stone-400" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-stone-800">Âm thanh chuông báo (Loa gọi món)</p>
                      <p className="text-[11px] text-stone-500">
                        Phát tiếng chuông thanh thoát khi có số thứ tự sẵn sàng hoặc hoàn tất đơn
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('soundEnabled', !appearance.soundEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                      appearance.soundEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        appearance.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-stone-700" />
                    <div>
                      <p className="text-xs font-bold text-stone-800">Viền tương phản cao (High Contrast)</p>
                      <p className="text-[11px] text-stone-500">
                        Tăng cường độ nét của đường viền thẻ để dễ nhìn dưới ánh sáng mạnh
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('highContrastMode', !appearance.highContrastMode)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                      appearance.highContrastMode ? 'bg-stone-900' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        appearance.highContrastMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LIVE PREVIEW CONTAINER (Always visible at bottom of content body) */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-orange-500" />
                Xem Trước Thực Tế (Live Preview Trên Nền Ẩm Thực)
              </label>
              <span className="text-[11px] text-stone-500 font-medium">
                Cập nhật tức thì
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden p-4 sm:p-6 flex justify-center items-center min-h-[190px] border border-stone-300">
              {/* Wallpaper Background in Preview */}
              {appearance.backgroundImage && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={appearance.backgroundImage}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{
                      opacity: bgOpacity,
                      filter: `blur(${bgBlur}px)`,
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 ${
                      bgOverlay === 'cream'
                        ? 'bg-amber-100/50'
                        : bgOverlay === 'dark'
                        ? 'bg-black/50'
                        : bgOverlay === 'glass'
                        ? 'bg-white/40'
                        : 'bg-amber-950/25'
                    }`}
                  />
                </div>
              )}
              {!appearance.backgroundImage && (
                <div className="absolute inset-0 z-0 bg-stone-100" />
              )}

              {/* Sample Dish Card with real styling */}
              <div
                className={`relative z-10 bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden max-w-sm w-full transition-all shadow-md ${
                  appearance.highContrastMode
                    ? 'border-2 border-stone-900'
                    : 'border border-stone-200/90'
                } ${appearance.cardDensity === 'compact' ? 'p-3 flex gap-3' : 'p-3.5 space-y-2.5'}`}
              >
                <div
                  className={`relative rounded-xl overflow-hidden bg-stone-100 shrink-0 ${
                    appearance.cardDensity === 'compact' ? 'w-20 h-20' : 'w-full h-28'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=300&auto=format&fit=crop&q=80"
                    alt="Cơm tấm"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-xs ${currentPalette.badge}`}>
                    Bán chạy
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h5
                      className={`font-black text-stone-900 truncate ${
                        appearance.fontSize === 'large' ? 'text-base' : 'text-sm'
                      }`}
                    >
                      Cơm Tấm Sườn Bì Chả Nướng
                    </h5>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      Sườn nướng mật ong thơm lừng, bì thính vàng giòn
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-stone-100">
                    <span
                      className={`font-black tracking-tight ${currentPalette.accentText} ${
                        appearance.fontSize === 'large' ? 'text-base' : 'text-sm'
                      }`}
                    >
                      {formatCurrency(35000)}
                    </span>
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl font-bold text-xs shadow-xs text-white ${currentPalette.primaryBg}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Chọn món</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-stone-500 hidden sm:block">
            Cài đặt hình nền & giao diện được tự động lưu trên thiết bị của bạn.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 font-bold text-xs transition cursor-pointer"
            >
              Mặc định
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer ${currentPalette.primaryBg} ${currentPalette.primaryHover}`}
            >
              Hoàn tất & Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
