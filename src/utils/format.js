export const clampNumber = (val, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Math.min(Math.max(val, min), max);

export const sanitizeNumeric = (v) => {
  let x = (v || '').replace(/[^\d.]/g, '');
  const parts = x.split('.');
  if (parts.length > 2) x = parts[0] + '.' + parts.slice(1).join('');
  if (x.startsWith('.')) x = '0' + x;
  return x;
};

export const fmt = (num, d = 4) => {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  return Number(num).toLocaleString(undefined, {
    maximumFractionDigits: d,
    minimumFractionDigits: 0
  });
};

export function formatPrice(price) {
  if (price === null || price === undefined) return '—';
  const n = Number(price);
  if (Number.isNaN(n)) return '—';
  if (n >= 1000) return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  if (n > 0) return `$${n.toFixed(6)}`;
  return '$0.00';
}

export function formatChange(change) {
  if (change === null || change === undefined) return '—';
  const n = Number(change);
  if (Number.isNaN(n)) return '—';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

export function formatCompact(n) {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (Number.isNaN(num)) return '—';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}