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
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://hitscounter.dev; connect-src 'self' https://dummyjson.com https://cloudflareinsights.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none';" />
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
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "136e08eeda5c4767885f149528781334"}'
        />
      </body>
    </html>
  );
}
