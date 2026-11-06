import type { Metadata } from "next";
import PageIntro from "@/components/ui/PageIntro";
import TradeShowsGrid from "@/components/tradeshows/TradeShowsGrid";
import { getCollectionItems } from "@/lib/cms";
import type { TradeShowItem } from "@/types/cms";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Trade Shows",
  description: "Upcoming trade shows and exhibitions where you can meet the ANIKA TRADING & CO. export team in person.",
};

export default async function TradeShowsPage() {
  const [events, locale] = await Promise.all([
    getCollectionItems<TradeShowItem>("tradeshows", []),
    getLocale(),
  ]);
  const dict = getDictionary(locale).tradeShows;

  return (
    <>
      <PageIntro eyebrow={dict.eyebrow} title={dict.heading} description={dict.description} />
      {/* This Server Component renders once per request (the page is already
          dynamic via getLocale()'s cookies() call), so "now" is a legitimate
          per-request input, not a React re-render hazard. */}
      {/* eslint-disable-next-line react-hooks/purity */}
      <TradeShowsGrid events={events} dict={dict} now={Date.now()} />
    </>
  );
}
