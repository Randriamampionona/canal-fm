// @ts-ignore
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Makes it feel like a native app
};

export const metadata: Metadata = {
  title: {
    default: "Canal FM | Echoes of Iarivo",
    template: "%s | Canal FM",
  },
  metadataBase: new URL("https://canal-fm.vercel.app"), // Replace with your actual domain

  description:
    "The soul of Malagasy airwaves, refined for the modern web. Stream Tantara Gasy in high fidelity, anywhere, for free.",
  keywords: [
    "Radio Madagascar",
    "Tantara Gasy",
    "Malagasy Radio",
    "Live FM",
    "Iarivo Echoes",
  ],
  authors: [{ name: "Your Name/Brand" }],
  creator: "Your Brand",

  // OpenGraph (Facebook/LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Canal FM",
    title: "Canal FM — High Fidelity Malagasy Radio",
    description:
      "Experience the ultimate free radio streaming from the heart of Madagascar.",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Canal FM - Echoes of Iarivo",
      },
    ],
  },

  // X (Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Canal FM | Echoes of Iarivo",
    description: "The soul of Malagasy airwaves, refined for the modern web.",
    images: ["/og-image.png"],
    creator: "@yourhandle",
  },

  // Icons & Manifest
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// Load Poppins as the sole font provider
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
