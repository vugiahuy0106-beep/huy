import { OrderStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;
  } catch {
    return isoString;
  }
}

export function getStatusDetails(status: OrderStatus): {
  label: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  stepIndex: number;
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ chế biến',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        borderClass: 'border-amber-400',
        bgClass: 'bg-amber-50/60',
        stepIndex: 1,
      };
    case 'cooking':
      return {
        label: 'Đang nấu',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        borderClass: 'border-blue-400',
        bgClass: 'bg-blue-50/60',
        stepIndex: 2,
      };
    case 'ready':
      return {
        label: 'Mời nhận món',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse',
        borderClass: 'border-emerald-500',
        bgClass: 'bg-emerald-50/60',
        stepIndex: 3,
      };
    case 'completed':
      return {
        label: 'Đã nhận món',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
        borderClass: 'border-stone-300',
        bgClass: 'bg-stone-50/40',
        stepIndex: 4,
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        borderClass: 'border-rose-400',
        bgClass: 'bg-rose-50/40',
        stepIndex: 0,
      };
  }
}
