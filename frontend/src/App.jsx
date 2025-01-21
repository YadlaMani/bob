// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuestion from "./pages/createQuestion";
import AnswerQuestion from "./pages/AnswerQuestion";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  const network = clusterApiUrl("devnet");
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Toaster />
            <div>
              <h1>App</h1>
              <WalletMultiButton />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreateQuestion />} />
                <Route path="/answer/:id" element={<AnswerQuestion />} />
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
