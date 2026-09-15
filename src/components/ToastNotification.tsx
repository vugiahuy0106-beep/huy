import React from 'react';
import { BellRing, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'callout';
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom duration-200 ${
            t.type === 'callout'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : t.type === 'success'
              ? 'bg-stone-900 text-white border-stone-800'
              : 'bg-white text-stone-900 border-stone-200'
          }`}
        >
          <div className="mt-0.5">
            {t.type === 'callout' ? (
              <BellRing className="w-5 h-5 text-emerald-300 animate-bounce" />
            ) : t.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm">{t.title}</h4>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{t.message}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-stone-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
