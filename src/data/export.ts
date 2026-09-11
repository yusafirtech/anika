import type { ExportProduct } from "@/types/cms";

export const exportCategories = [
  { id: "seafood", label: "Seafood", image: "/images/story-seafood-closeup.jpg" },
  { id: "frozen-fish", label: "Frozen Fish", image: "/images/story-seafood.jpg" },
  { id: "vegetables", label: "Vegetables", image: "/images/story-vegetable-market.jpg" },
  { id: "agricultural-products", label: "Agricultural Products", image: "/images/story-agriculture-origin.jpg" },
];

export const exportProcess = [
  { step: "Source", description: "Identifying reliable Bangladesh-origin supply." },
  { step: "Quality", description: "Checking product quality against buyer requirements." },
  { step: "Prepare", description: "Preparing and grading product for export." },
  { step: "Pack", description: "Export-appropriate packaging for the product type." },
  { step: "Ship", description: "Coordinating shipment to the destination market." },
  { step: "Deliver", description: "Delivery confirmation with the buyer." },
];

export type { ExportProduct };

export const exportProducts: ExportProduct[] = [
  {
    slug: "frozen-shrimp",
    name: "Frozen Shrimp",
    category: "Seafood",
    origin: "Bangladesh",
    availability: "Seasonal",
    moq: "[MOQ available upon request]",
    summary:
      "Frozen shrimp sourced and processed for export, packed to preserve quality through international shipment.",
    image: "/images/story-seafood-closeup.jpg",
    images: [
      "/images/story-seafood-closeup.jpg",
      "/images/story-seafood.jpg",
      "/images/trade-detail.jpg",
      "/images/story-international-trade.jpg",
    ],
    specifications: [
      { label: "Product category", value: "Seafood" },
      { label: "Origin", value: "Bangladesh" },
      { label: "Packaging", value: "[Details available upon request]" },
      { label: "Storage", value: "Frozen / cold chain" },
      { label: "Shelf life", value: "[Details available upon request]" },
      { label: "Export documentation", value: "[Provided upon order confirmation]" },
    ],
  },
  {
    slug: "fresh-frozen-fish",
    name: "Fresh & Frozen Fish",
    category: "Frozen Fish",
    origin: "Bangladesh",
    availability: "Year-round",
    moq: "[MOQ available upon request]",
    summary:
      "Fresh and frozen fish supply, processed and packaged to export-ready condition.",
    image: "/images/story-seafood.jpg",
    images: [
      "/images/story-seafood.jpg",
      "/images/story-seafood-closeup.jpg",
      "/images/trade-detail.jpg",
      "/images/hero-port-supply-route.jpg",
    ],
    specifications: [
      { label: "Product category", value: "Frozen Fish" },
      { label: "Origin", value: "Bangladesh" },
      { label: "Packaging", value: "[Details available upon request]" },
      { label: "Storage", value: "Frozen / cold chain" },
      { label: "Export documentation", value: "[Provided upon order confirmation]" },
    ],
  },
  {
    slug: "fresh-vegetables",
    name: "Fresh Vegetables",
    category: "Vegetables",
    origin: "Bangladesh",
    availability: "Seasonal",
    moq: "[MOQ available upon request]",
    summary:
      "Fresh vegetables sourced, graded and packed for both regional and international buyers.",
    image: "/images/story-vegetable-market.jpg",
    images: [
      "/images/story-vegetable-market.jpg",
      "/images/story-agriculture-origin.jpg",
      "/images/trade-detail.jpg",
      "/images/story-global-connection.jpg",
    ],
    specifications: [
      { label: "Product category", value: "Vegetables" },
      { label: "Origin", value: "Bangladesh" },
      { label: "Grade", value: "[Details available upon request]" },
      { label: "Packaging", value: "[Details available upon request]" },
      { label: "Export documentation", value: "[Provided upon order confirmation]" },
    ],
  },
  {
    slug: "agricultural-produce",
    name: "Agricultural Produce",
    category: "Agricultural Products",
    origin: "Bangladesh",
    availability: "Seasonal",
    moq: "[MOQ available upon request]",
    summary:
      "Bangladesh-origin agricultural produce, sourced and prepared to meet export specifications.",
    image: "/images/story-agriculture-origin.jpg",
    images: [
      "/images/story-agriculture-origin.jpg",
      "/images/story-vegetable-market.jpg",
      "/images/trade-detail.jpg",
      "/images/story-global-connection.jpg",
    ],
    specifications: [
      { label: "Product category", value: "Agricultural Products" },
      { label: "Origin", value: "Bangladesh" },
      { label: "Packaging", value: "[Details available upon request]" },
      { label: "Supply capacity", value: "[Details available upon request]" },
      { label: "Export documentation", value: "[Provided upon order confirmation]" },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return exportProducts.find((p) => p.slug === slug);
}
