export function resolveImagePath(raw?: string) {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export default resolveImagePath;
