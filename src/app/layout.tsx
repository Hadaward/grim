import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grim Island",
  description: "Grim Island is an MMO (Massive Multiplayer Online) game that features survival, resource management, stamina, hunger and thirst, animal breeding, action battles against monsters and players, social interaction and exploration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="auto">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
