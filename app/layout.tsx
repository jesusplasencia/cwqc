import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudWatch Query Crafter",
  description:
    "Craft CloudWatch Logs Insights queries visually and copy them instantly.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
