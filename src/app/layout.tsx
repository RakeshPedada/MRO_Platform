import type { Metadata } from 'next';
import { Inter, Merriweather, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maniresearch.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MANI Research Organization (MRO) | Multidisciplinary Open-Access Publishing',
    template: '%s | MANI Research Organization',
  },
  description:
    'MANI Research Organization (MRO) is an international peer-reviewed, multidisciplinary open-access publishing platform operated by MANI Market Private Limited (CIN: U58130AP2026PTC127065). Dedicated to rapid, ethical, and high-impact scientific dissemination across 17 disciplinary fields.',
  keywords: [
    'MANI Research Organization',
    'MRO',
    'Open Access Journals',
    'Peer-Reviewed Research',
    'Multidisciplinary Journals',
    'Academic Publishing',
    'Scientific Papers',
    'Engineering Research',
    'DOI',
    'Nangireddy Manikanta',
    'MANI Market Private Limited',
  ],
  authors: [{ name: 'MANI Research Organization', url: 'https://maniresearch.org' }],
  creator: 'MANI Market Private Limited',
  publisher: 'MANI Research Organization',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'MANI Research Organization (MRO)',
    title: 'MANI Research Organization (MRO) | Multidisciplinary Open-Access Publishing',
    description:
      'International peer-reviewed open access publishing across 17 multidisciplinary research domains with permanent DOI archiving.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MANI_Research',
    creator: '@MANI_Research',
    title: 'MANI Research Organization (MRO)',
    description: 'Peer-reviewed, open-access multidisciplinary scholarly publishing platform.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-slate-900">
        {children}
      </body>
    </html>
  );
}
