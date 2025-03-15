import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import Link from 'next/link';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
          <Toaster position="top-center" richColors />
          <nav className="p-4 bg-gray-100 dark:bg-gray-800">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/flashcards" className="hover:underline">Flashcards</Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:underline">Quiz</Link>
              </li>
              <li>
                <Link href="/matching" className="hover:underline">Matching</Link>
              </li>
            </ul>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
