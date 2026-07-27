import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodie",
  description: "Log and track the food you've tried.",
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
