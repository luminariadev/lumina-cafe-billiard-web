/**
 * Lightweight client error reporter.
 * Logs runtime errors to a configurable endpoint when REACT_APP_ERROR_DSN is set.
 * No external SDK dependency — keeps bundle small.
 */

type ErrorLog = {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
};

export function initErrorReporter(): void {
  if (typeof window === "undefined") return;

  const dsn = process.env.NEXT_PUBLIC_ERROR_DSN;
  if (!dsn) return;

  window.addEventListener("error", (event) => {
    reportError({
      message: event.message || "Unknown error",
      stack: event.error?.stack,
      source: event.filename || window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError({
      message: "Unhandled promise rejection",
      stack: event.reason?.stack || String(event.reason),
      source: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  });
}

function reportError(log: ErrorLog): void {
  const dsn = process.env.NEXT_PUBLIC_ERROR_DSN;
  if (!dsn) return;
  try {
    navigator.sendBeacon(dsn, new Blob([JSON.stringify(log)], { type: "application/json" }));
  } catch {
    /* silently ignore — telemetry must never block the app */
  }
}