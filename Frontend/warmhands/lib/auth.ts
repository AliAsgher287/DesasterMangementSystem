/**
 * Reads auth data from storage.
 * sessionStorage is written when "Remember Me" is NOT checked (clears on tab close).
 * localStorage is written when "Remember Me" IS checked (persists across sessions).
 * We always check sessionStorage first so logging out (clearing sessionStorage)
 * immediately takes effect even if stale localStorage data exists.
 */
export function getAuthToken(): string {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("token") || localStorage.getItem("token") || "";
}

export function getAuthItem(key: string): string {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
}

export function clearAuth(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("organizationName");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("organizationName");
}
