import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anikatradingco.com"),
  title: {
    default: "ANIKA TRADING & CO. | Building. Supplying. Exporting. Connecting.",
    template: "%s | ANIKA TRADING & CO.",
  },
  description:
    "ANIKA TRADING & CO. is a Bangladesh-based diversified business company operating across construction, government supply, distribution, import & trading, and international export.",
  icons: {
    icon: "/images/anika-official-logo.png",
  },
  openGraph: {
    title: "ANIKA TRADING & CO.",
    description:
      "Building. Supplying. Exporting. Connecting. A diversified Bangladesh-based business company across construction, supply and international trade.",
    siteName: "ANIKA TRADING & CO.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
