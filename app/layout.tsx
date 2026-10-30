import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: { default: "Ladder", template: "%s | Ladder" },
  description: "An 8 week Python, C++ and Java study tracker alongside CSE220, CSE250 and CSE320.",
  icons: { icon: "/favicon.svg" }
};
export const viewport = { themeColor: "#020a18" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-surface text-on-surface font-body-md antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}
