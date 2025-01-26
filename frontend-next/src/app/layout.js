"use client";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppWalletProvider>
          <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-lg">
            <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
              <WalletMultiButton />
            </div>
          </nav>
          <main className="flex-grow">{children}</main>
        </AppWalletProvider>
      </body>
    </html>
  );
}
