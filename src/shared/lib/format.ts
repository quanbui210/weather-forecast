export function formatTemperature(value: number): string {
  const rounded = Math.round(value);
  return `${rounded}\u00B0C`;
}

export function formatWindSpeed(value: number): string {
  const rounded = Math.round(value);
  return `${rounded} km/h`;
}

export function formatHumidity(value: number): string {
  const rounded = Math.round(value);
  return `${rounded}%`;
}
