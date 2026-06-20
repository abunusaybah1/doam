import type { Metadata } from "next";
import {
  Playfair_Display,
  IBM_Plex_Mono,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Do-am: Community Problem Tracker",
  description:
    "A living documentary of real problems facing local communities.",
  icons: [
    {
      url: "/images/doam.ico",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} ${sourceSerif.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
