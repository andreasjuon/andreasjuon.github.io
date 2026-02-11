import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Andreas Juon - Academic Researcher | Data Scientist | Advisory Services",
  description: "Academic researcher, data scientist, and advisory services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="pt-4 md:pt-6">
          {children}
        </div>
      </body>
    </html>
  );
}
