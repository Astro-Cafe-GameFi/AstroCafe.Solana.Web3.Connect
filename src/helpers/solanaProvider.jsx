/* eslint-disable */
import React, { useEffect, useMemo } from 'react';
import { useStateStore } from "../store/stateStore.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

const SolanaProvider = ({ children }) => {
  const useMainnet = useStateStore((state) => state.useMainnet);
  const network = useMemo(() => useMainnet ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet, [useMainnet]);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  useEffect(() => {
    const interval = setInterval(() => {
      const walletButtons = document.querySelectorAll(".wallet-adapter-button");
      walletButtons.forEach((button) => {
        // console.log(button.textContent.toLowerCase())
        if (button.textContent && button.textContent.toLowerCase().includes("phantom")) {
          
        } else {
          button.remove();
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaProvider;