import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineVerse — Stream Movies, TV Shows & Anime Free",
  description:
    "CineVerse is a premium streaming platform for movies, TV shows, and anime. Watch unlimited content for free with Netflix-level quality UI.",
  keywords: ["streaming", "movies", "tv shows", "anime", "free", "watch online"],
  openGraph: {
    title: "CineVerse",
    description: "Stream Movies, TV Shows & Anime — Free",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
