import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import GovHeader from "@/components/GovHeader";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReactQueryProvider } from "@/lib/react-query";

import FloatingElements from "@/components/FloatingElements";

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Youth Welfare | Department of Youth Welfare and PRD, Uttarakhand",
  description:
    "A Single Platform for Youth of Uttarakhand to get information related to Jobs, Skill development, Vocational Training, Employment, Sports, Health and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-roboto)]">
        <ReactQueryProvider>
        <AuthProvider>
        <LanguageProvider>
        <GovHeader />
        <MainHeader />
        <main className="flex-1">{children}</main>
        <Footer />

        <FloatingElements />
        </LanguageProvider>
        </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
