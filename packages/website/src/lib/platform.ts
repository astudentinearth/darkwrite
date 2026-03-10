export function getOperatingSystem(): string {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  if (/Windows NT/.test(ua)) {
    return "Windows";
  }
  if (/Macintosh/.test(ua)) {
    return "macOS";
  }
  if (/Linux/.test(ua)) {
    return "Linux";
  }
  return "Other";
}
