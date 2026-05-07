export function formatTemperature(value: number): string {
  const rounded = Math.round(value);
  return `${rounded}C`;
}

export function formatWindSpeed(value: number): string {
  const rounded = Math.round(value);
  return `${rounded} km/h`;
}
