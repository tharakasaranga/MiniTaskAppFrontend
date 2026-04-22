import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Task Management App",
  description: "Task management app with Next.js and Firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}