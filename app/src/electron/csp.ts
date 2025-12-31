import { is } from "@electron-toolkit/utils";
import { session } from "electron";

export function getCSP() {
  // unsafe-eval is enabled in development only, otherwise vite will explode!
  if (is.dev) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:", // Vite needs eval for HMR
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: embed: http://localhost:5173",
      "font-src 'self' data:",
      "connect-src 'self' ws://localhost:5173 http://localhost:5173", // WebSocket for HMR
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
  } else {
    return [
      "default-src 'self' file:",
      "script-src 'self' file:",
      "style-src 'self' 'unsafe-inline' file:",
      "img-src 'self' data: blob: file: embed:",
      "font-src 'self' data: file:",
      "connect-src 'self' file:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
  }
}

export function setupCsp() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [getCSP()],
      },
    });
  });
}
