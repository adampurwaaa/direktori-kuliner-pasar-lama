import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Direktori Kuliner Pasar Lama Tangerang",
  description: "Daftar kuliner khas, jajanan viral malam hari, rincian menu dan harga resmi, serta rute navigasi Google Maps Pasar Lama Tangerang.",
  keywords: ["kuliner pasar lama", "pasar lama tangerang", "sate h ishak", "es buntin", "jajanan tangerang"],
  openGraph: {
    title: "Direktori Kuliner Pasar Lama Tangerang",
    description: "Panduan lengkap menu, harga, promo, dan peta lokasi kuliner Pasar Lama Tangerang.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
