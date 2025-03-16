import "./globals.css";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { DateTimeDisplay } from "@/components/date-time-display";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <ThemeProvider>
          <Toaster position="top-center" richColors />
          <DateTimeDisplay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
