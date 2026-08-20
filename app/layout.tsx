import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "5 Dots",
  description: "Click the dots left to right, then back again!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
