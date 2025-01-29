import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
export const metadata = {
  title: "Bob",
  description: "Decentralized data labelling platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100 dark:bg-dynamic-black">
        <AppWalletProvider>
          <Toaster />
          <Navbar />
          <main className="flex-grow">{children}</main>
        </AppWalletProvider>
      </body>
    </html>
  );
}
