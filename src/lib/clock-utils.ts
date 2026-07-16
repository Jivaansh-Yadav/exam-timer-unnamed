export function padTime(value: number) {
  return value.toString().padStart(2, "0");
}

export function minutesToTime(minutes: number) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${padTime(hours)}:${padTime(mins)}`;
}

export function timeToMinutes(time: string) {
  const [hourPart, minutePart] = time.split(":");
  const hours = Number(hourPart);
  const minutes = Number(minutePart);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return Math.min(1439, Math.max(0, hours * 60 + minutes));
}

export function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function getProgressPercent(current: Date, startTime: string, endTime: string) {
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  const now = getCurrentMinutes(current);

  if (end <= start) end += 1440;
  const adjustedNow = now < start && end > 1440 ? now + 1440 : now;
  const progress = clamp((adjustedNow - start) / (end - start));

  return Math.round(progress * 1000) / 10;
}

export function hslString(hue: number, saturation: number, lightness: number) {
  return `hsl(${Math.round(hue)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

export function interpolateHsl(progressPercent: number) {
  const progress = clamp(progressPercent / 100);
  const start = { hue: 142, saturation: 22, lightness: 93 };
  const end = { hue: 12, saturation: 34, lightness: 89 };

  const hue = start.hue + (end.hue - start.hue) * progress;
  const saturation = start.saturation + (end.saturation - start.saturation) * progress;
  const lightness = start.lightness + (end.lightness - start.lightness) * progress;

  return hslString(hue, saturation, lightness);
}

export function formatTriggerTime(date: Date) {
  return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
}
