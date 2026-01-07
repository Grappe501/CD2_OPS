import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CD2_OPS",
  description: "Campaign operating system — Arkansas CD2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
