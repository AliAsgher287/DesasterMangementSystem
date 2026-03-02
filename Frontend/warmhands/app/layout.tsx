import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

const interSize = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfitSize = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warm Hands | Disaster Coordination Platform",
  description: "AI-driven disaster response and resource coordination for institutional resilience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSize.variable} ${outfitSize.variable} font-sans antialiased`}
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
