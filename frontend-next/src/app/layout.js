import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";

import { Toaster } from "sonner";
export const metadata = {
  title: "Bob",
  description: "Decentralized data labelling platform",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppWalletProvider>
          <Toaster />

          <main className="flex-grow">{children}</main>
        </AppWalletProvider>
      </body>
    </html>
  );
}
