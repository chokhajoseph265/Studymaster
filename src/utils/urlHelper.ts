/**
 * URL and Domain Helpers for StudyMaster Malawi
 */

export function getPublicAppUrl(path: string = '/'): string {
  if (typeof window === 'undefined') return path;
  
  const origin = window.location.origin;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

export function getPublicHost(): string {
  if (typeof window === 'undefined') return 'StudyMaster Malawi';
  return window.location.host;
}

export function openInPublicTab(path: string = '/'): void {
  const url = getPublicAppUrl(path);
  window.open(url, '_blank');
}
