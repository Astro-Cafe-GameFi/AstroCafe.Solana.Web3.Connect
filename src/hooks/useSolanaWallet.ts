/* eslint-disable */
import { useEffect, useState } from 'react';

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedMessage, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { hexToByte } from '../helpers/string';
import { sleep } from '../helpers/time';

const useSolanaWallet = () => {

  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();

  const [account, setAccount] = useState('');

  useEffect(() => {
    setAccount(wallet?.publicKey ? wallet.publicKey.toBase58() : '');

    if (wallet.connected && walletModal.visible) {
      walletModal.setVisible(false);
    }
  }, [wallet]);

  const connect = async() => {
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  }

  const reset = async() => {
    await wallet.disconnect()
  }

  const signPersonalMessage = async(message: string) => {
    if (account && wallet?.signMessage) {
      const data = new TextEncoder().encode(message);
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);
      return serializedSignature;
    }
    return null;
  }

  const sendTransaction = async(txMessage: string) => {
    if (account && wallet.publicKey) {
      const data = hexToByte(txMessage);
      const message = VersionedMessage.deserialize(data);

      const {
        context: { slot: minContextSlot },
        value: { blockhash },
      } = await connection.getLatestBlockhashAndContext();
      const lastValidBlockHeight = minContextSlot + 150;
      message.recentBlockhash = blockhash;
      const transactionMessage = TransactionMessage.decompile(message);
      const transaction = new VersionedTransaction(transactionMessage.compileToLegacyMessage());

      let signedTx;
      if (wallet.signTransaction) {
        signedTx = await wallet.signTransaction(transaction);
      } else if (wallet.signAllTransactions) {
        const signedAllTxs = await wallet.signAllTransactions([transaction]);
        signedTx = signedAllTxs[0];
      }

      if (signedTx) {
        const rawTransaction = signedTx.serialize();
        let blockheight = await connection.getBlockHeight();
        do {
          const txHash = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true });
          await sleep(500);
          const ret = await connection.getTransaction(txHash, {commitment: "confirmed", maxSupportedTransactionVersion: 1});
          if (ret) {
            return txHash;
          }
          blockheight = await connection.getBlockHeight();
          console.log(`retrying transfer if blockheight(${blockheight}) less than ${lastValidBlockHeight}`);
        } while (blockheight < lastValidBlockHeight);
      } else {
        const txHash = await wallet.sendTransaction(transaction, connection, { minContextSlot });
        return txHash;
      }
    }
    return null;
  }

  return {
    account,
    connect,
    reset,
    signPersonalMessage,
    sendTransaction,
  };
}

export default useSolanaWallet;