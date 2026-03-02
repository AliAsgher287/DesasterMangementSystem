"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
                duration: 5000,
                style: {
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    color: "#0f172a",
                    fontSize: "13px",
                    fontWeight: "700",
                    borderRadius: "24px",
                    padding: "16px 28px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                    letterSpacing: "-0.01em",
                },
                success: {
                    style: {
                        border: "1px solid #dcfce7",
                        background: "linear-gradient(to right, #ffffff, #f0fdf4)",
                    },
                    iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                    },
                },
                error: {
                    style: {
                        border: "1px solid #fee2e2",
                        background: "linear-gradient(to right, #ffffff, #fef2f2)",
                    },
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
}
