import "./globals.css";
import type { Metadata } from "next";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Meḥfil-e-Yash - Wedding Invitation",
  description: "Generate wedding invitation flyers with QR codes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Add Syamsiah Arabic font with suppressHydrationWarning */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Syamsiah Arabic';
                src: url('/fonts/Syamsiah-Arabic.woff2') format('woff2'),
                     url('/fonts/Syamsiah-Arabic.ttf') format('truetype');
                font-weight: 100 900;
                font-style: normal;
                font-display: swap;
              }
              @font-face {
                font-family: 'SyamsiahArabic';
                src: url('/fonts/Syamsiah-Arabic.woff2') format('woff2'),
                     url('/fonts/Syamsiah-Arabic.ttf') format('truetype');
                font-weight: 100 900;
                font-style: normal;
                font-display: swap;
              }
            `,
          }}
          suppressHydrationWarning
        />
      </head>
      <body className={cinzel.className}>{children}</body>
    </html>
  );
}
