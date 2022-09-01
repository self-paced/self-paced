// Format date to local timezone in YYYY/MM/DD HH:mm:ss format
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Format date to local timezone in YYYY/MM/DD HH:mm:ss format
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDecimals(
  value: number,
  decimals = 2,
  hideDecimalWhenInt = true
): string {
  const res = value.toFixed(decimals);
  return hideDecimalWhenInt ? res.replace(/\.0+/, '') : res;
}
