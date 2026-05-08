"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// This variable is strictly in-memory.
// If a user types a URL directly into the browser address bar or refreshes the page,
// the entire JavaScript state is wiped out, and this resets to false.
// If they navigate by clicking a button (client-side routing), this stays true.
let appInitializedViaUI = false;

export default function NavigationGuard() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // The landing page is the only allowed entry point.
        if (pathname === "/landingPage" || pathname === "/") {
            appInitializedViaUI = true;
            return;
        }

        // If they are on any other page and this flag is false, it means they bypassed the UI
        // (e.g., typed the URL directly or refreshed the page). We block them.
        if (!appInitializedViaUI) {
            router.replace("/landingPage");
        }
    }, [pathname, router]);

    return null;
}
