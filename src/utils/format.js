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