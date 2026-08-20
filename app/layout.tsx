import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "5 Dots",
  description: "Click the dots left to right, then back again!",
  manifest: "/five-dots/manifest.json",
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/five-dots/icon-192.png" />
      </head>
      <body>
        {children}
        <script
          data-goatcounter="https://five-dots.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </body>
    </html>
  );
}
