import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Darkwrite | A notebook that is truly yours.",
  description: "Take notes the way you want, without all the distractions. Feature packed, customizable and open source.",
  keywords: ["notes app", "note taking app", "darkwrite", "todo app", "notes", "notebook", "notebook app", "open source", "open source notes app"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
