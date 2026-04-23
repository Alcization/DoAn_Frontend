import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SWTIS",
  description: "SWTIS - Smart Weather and Traffic Information System",
  referrer: "no-referrer-when-downgrade",
};

import Header from "./shared_component/header";
import LanguageProvider from "../context/language/LanguageProvider";
import { ThemeProvider } from "../context/theme/ThemeContext";
import { SidebarProvider } from "../context/sidebar/SidebarContext";

// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <SidebarProvider>
              <Header />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
