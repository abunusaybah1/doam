import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StaleAuthHashCleanup } from "@/components/StaleAuthHashCleanup ";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Do-am: Community Problem Tracker",
  description:
    "A living documentary of real problems facing local communities.",
  icons: [{ url: "/images/logos/doam.ico", sizes: "180x180", type: "image/png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-poppins antialiased`}
      >
        <StaleAuthHashCleanup />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
