import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a clean premium look
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ex Financer",
  description: "Track your expenses simply and efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
