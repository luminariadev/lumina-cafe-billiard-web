import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Lumina | Management Portal",
  description: "Lumina Billiard & Cafe Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
