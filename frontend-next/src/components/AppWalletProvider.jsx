"use client"; // Ensure this component runs only on the client

import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Solana wallet adapter UI styles
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({ children }) {
  const network = WalletAdapterNetwork.Devnet;

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
