import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevSnip",
  description: "A social code snippet feed for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-zinc-100 font-sans text-zinc-950">
        {children}
      </body>
    </html>
  );
}
