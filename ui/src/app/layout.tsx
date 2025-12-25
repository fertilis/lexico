import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import MenuButton from "@/components/MenuButton";

const notoSans = Noto_Sans({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Lexico",
  description: "Interactive Greek dictionary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSans.variable}>
        <StoreProvider>
          <div className="main_box">
            <div className="top_row">
              <MenuButton />
            </div>
            <div className="bottom_row">
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
