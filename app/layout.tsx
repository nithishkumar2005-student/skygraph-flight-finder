import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkyGraph | Global Traversal Engine",
  description: "Graph-based flight pathfinding application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-screen">
        {children}
      </body>
    </html>
  );
}