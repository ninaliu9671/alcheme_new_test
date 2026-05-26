import type { Metadata, Viewport } from "next";
import "@fontsource/press-start-2p/400.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";
import "./globals.css";
import PageTransitionProvider from "@/components/PageTransitionProvider";

export const metadata: Metadata = {
  title: "Alcheme",
  description: "Distill the magic of your day.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#A9C8D1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-sky font-sans">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
