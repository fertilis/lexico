import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import MenuButton from "@/components/MenuButton";
import CurrentArticleIndex from "@/components/CurrentArticleIndex";
import ThemeButton from "@/components/ThemeButton";

const notoSans = Noto_Sans({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Lexico",
  description: "Interactive Greek dictionary",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light_theme">
      <body className={notoSans.variable}>
        <StoreProvider>
          <div className="main_box">
            <div className="top_row">
              <MenuButton />
              <div className="top_row_center">
                <CurrentArticleIndex />
              </div>
              <ThemeButton />
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
