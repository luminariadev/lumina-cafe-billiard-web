import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export const metadata: Metadata = {
  title: "Cue & Brew | Management Portal",
  description: "Cue & Brew Billiard & Cafe Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-on-surface antialiased selection:bg-primary/30">
        <AuthProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}