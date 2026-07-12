export function photoServingUrl(pathname: string): string {
  return `/api/photos?pathname=${encodeURIComponent(pathname)}`;
}
