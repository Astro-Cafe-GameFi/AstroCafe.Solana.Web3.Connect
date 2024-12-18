/* eslint-disable */
import { useEffect, useState } from "react";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  VersionedMessage,
  TransactionMessage,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { hexToByte } from "../helpers/string";
import { sleep } from "../helpers/time";

const useSolanaWallet = () => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();

  const [account, setAccount] = useState("");

  useEffect(() => {
    setAccount(wallet?.publicKey ? wallet.publicKey.toBase58() : "");

    if (wallet.connected && walletModal.visible) {
      walletModal.setVisible(false);
    }
  }, [wallet]);

  const connect = async () => {
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const reset = async () => {
    await wallet.disconnect();
  };

  const signPersonalMessage = async (message) => {
    if (account && wallet?.signMessage) {
      const data = new TextEncoder().encode(message);
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);
      return serializedSignature;
    }
    return null;
  };

  const sendTransactionByBlockhash = async (txMessage) => {
    try {
      if (account && wallet.publicKey) {
        const data = hexToByte(txMessage);
        const message = VersionedMessage.deserialize(data);
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();
        message.recentBlockhash = blockhash;
        const transactionMessage = TransactionMessage.decompile(message);
        const transaction = new VersionedTransaction(
          transactionMessage.compileToLegacyMessage()
        );

        let signedTx;
        if (wallet.signTransaction) {
          signedTx = await wallet.signTransaction(transaction);
        } else if (wallet.signAllTransactions) {
          const signedAllTxs = await wallet.signAllTransactions([transaction]);
          signedTx = signedAllTxs[0];
        }

        if (signedTx) {
          const rawTransaction = signedTx.serialize();
          const txHash = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          await connection.confirmTransaction(txHash, "finalized");
          return txHash;
        } else {
          const txHash = await wallet.sendTransaction(transaction, connection, {
            minContextSlot,
          });
          return txHash;
        }
      }
      return null;
    } catch (error) {
      console.error("Transaction failed or was not finalized:", error);
      return null;
    }
  };

  const sendTransaction = async (txMessage) => {
    try {
      if (account && wallet.publicKey) {
        // const latestBlockhash = await connection.getLatestBlockhash();
        const transaction = Transaction.from(Buffer.from(txMessage, "hex"));

        let signedTx;
        if (wallet.signTransaction) {
          signedTx = await wallet.signTransaction(transaction);
        } else if (wallet.signAllTransactions) {
          const signedAllTxs = await wallet.signAllTransactions([transaction]);
          signedTx = signedAllTxs[0];
        }

        if (signedTx) {
          const rawTransaction = signedTx.serialize();
          const txHash = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          });
          // Solflare wallet doesn't accept this method way
          await connection.confirmTransaction(txHash, "finalized");
          // const confirmation = await connection.confirmTransaction(
          //   {
          //     signature: txHash,
          //     blockhash: transaction.recentBlockhash,
          //     lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          //   },
          //   "finalized"
          // );

          // if (confirmation.value.err) {
          //   console.log(
          //     `Transaction failed: ${JSON.stringify(confirmation.value.err)}`
          //   );
          //   return null;
          // }
          return txHash;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error("Transaction failed or was not finalized:", error);
      return null;
    }
  };

  return {
    account,
    connect,
    reset,
    signPersonalMessage,
    sendTransaction,
    sendTransactionByBlockhash,
  };
};

export default useSolanaWallet;
