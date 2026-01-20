import { is } from "@electron-toolkit/utils";
import { session } from "electron";

export function getCSP() {
  // unsafe-eval is enabled in development only, otherwise vite will explode!
  if (is.dev) {
    return [
      "default-src 'self' chrome-extension://*",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: chrome-extension://*", // Vite needs eval for HMR
      "style-src 'self' 'unsafe-inline' chrome-extension://*",
      "img-src 'self' data: blob: embed: http://localhost:5173 chrome-extension://*",
      "font-src 'self' data: chrome-extension://*",
      "connect-src 'self' ws://localhost:5173 http://localhost:5173 chrome-extension://*", // WebSocket for HMR
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
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
