export function getDateKey(iso: string): string {
  return iso.includes('T') ? iso.split('T')[0] : iso;
}

export function getHourLabel(iso: string): string {
  if (!iso.includes('T')) {
    return iso;
  }

  const [, timePart] = iso.split('T');
  return timePart?.slice(0, 5) ?? iso;
}

export function formatWeekday(isoDate: string, options?: { locale?: string }): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(options?.locale, { weekday: 'short' }).format(date);
}

export function formatMonthDay(isoDate: string, options?: { locale?: string }): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(options?.locale, { month: 'short', day: 'numeric' }).format(date);
}
