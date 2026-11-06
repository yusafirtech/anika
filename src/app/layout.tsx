import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MaintenanceBanner from "@/components/layout/MaintenanceBanner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SITE_URL, getPageContent, jsonLd } from "@/lib/cms";
import type { SiteGlobalContent } from "@/types/cms";
import { navLinks, footerColumns, companyInfo } from "@/data/site";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { rtlLocales } from "@/i18n/config";
import { BuyerAuthProvider } from "@/context/BuyerAuthContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

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
  metadataBase: new URL(SITE_URL),
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, locale] = await Promise.all([
    getPageContent<SiteGlobalContent>("site", {
      companyInfo,
      navLinks,
      footerColumns,
    }),
    getLocale(),
  ]);
  const dict = getDictionary(locale);
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <BuyerAuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.companyInfo.name,
              url: SITE_URL,
              logo: `${SITE_URL}/images/anika-official-logo.png`,
              slogan: site.companyInfo.tagline,
              address: { "@type": "PostalAddress", streetAddress: site.companyInfo.address, addressCountry: "BD" },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "sales",
                telephone: site.companyInfo.phone,
                email: site.companyInfo.email,
                availableLanguage: ["English", "Bengali"],
              },
            }),
          }}
        />
        <Navbar navLinks={site.navLinks} locale={locale} dict={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer footerColumns={site.footerColumns} companyInfo={site.companyInfo} />
        <MaintenanceBanner dict={dict.maintenance} />
        <WhatsAppButton phone={site.companyInfo.whatsapp} dict={dict.whatsapp} />
        </BuyerAuthProvider>
      </body>
    </html>
  );
}
