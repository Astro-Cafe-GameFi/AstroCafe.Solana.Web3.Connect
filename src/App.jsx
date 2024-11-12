import { useEffect, useState } from "react";
import { useStateStore } from "./store/stateStore.js";
import logo from "./AClogo.png";
import "./App.css";
import copyTextToClipboard from "./helpers/clipboard";
import useSolanaWallet from "./hooks/useSolanaWallet";

function App() {
  const setUseMainnet = useStateStore((state) => state.setUseMainnet);
  const {
    account,
    connect,
    reset,
    signPersonalMessage,
    sendTransaction,
    sendMultiSignTransaction,
  } = useSolanaWallet();

  const [response, setResponse] = useState("");
  const [text, setText] = useState("");
  const [showText, setShowText] = useState(false);
  const [buttonText, setButtonText] = useState("Copy");
  const [showButton, setShowButton] = useState(false);
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text) => {
    copyTextToClipboard(text);
    setButtonText("Copied");
  };

  useEffect(() => {
    const handleLoad = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isMainnet = urlParams.get("networkId") === "0" ? true : false;
      setUseMainnet(isMainnet);

      connect();
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  });

  useEffect(() => {
    if (account?.length > 0) {
      setShowDisconnectButton(true);
      processAction();
    } else {
      setShowDisconnectButton(false);
    }
  }, [account]);

  function processAction() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");
    const message = urlParams.get("message");
    const txMessage = urlParams.get("txMessage");

    if (action === "sign" && message) {
      return signMessage(message);
    } else if (action === "send" && txMessage) {
      return sendRawTransaction(txMessage);
    } else if (action === "sendMultiSign" && txMessage) {
      return sendRawTransaction(txMessage, true);
    }
    displayResponse("Invalid URL");
  }

  async function signMessage(message) {
    setIsLoading(true);
    let signature;
    try {
      signature = await signPersonalMessage(message);
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);

    if (signature) {
      console.log({ signature });
      if (
        message ===
        "Please sign this message to log in with your wallet address."
      )
        displayResponse(
          "Signature complete.\n\nCopy to clipboard and sign the next message to login",
          `${account}-${signature}`
        );
      else
        displayResponse(
          "Signature complete.\n\nCopy to clipboard and return to Astro Café",
          `${account}-${signature}`
        );
    } else {
      displayResponse(
        "Signature Denied.\n\nCopy to clipboard and return to Astro Café",
        "error"
      );
    }
  }

  async function sendRawTransaction(txMessage, multiSign = false) {
    setIsLoading(true);
    let txHash;
    try {
      txHash = multiSign
        ? await sendMultiSignTransaction(txMessage)
        : await sendTransaction(txMessage);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);

    if (txHash) {
      console.log({ txHash });
      displayResponse(
        "Transaction sent.\n\nCopy to clipboard and return to Astro Café",
        txHash
      );
    } else {
      displayResponse(
        "Transaction Denied.\n\nCopy to clipboard and return to Astro Café",
        "error"
      );
    }
  }

  function displayResponse(txt, resp = undefined) {
    // display error or response
    setText(txt);
    setShowText(true);

    if (resp) {
      setResponse(resp);
      setShowButton(true);
    }
  }

  return (
    <div id="app">
      <div className="header">
        <button
          id="disconnect-button"
          title="Disconnect wallet"
          className={showDisconnectButton ? "active" : ""}
          onClick={() => reset()}
        >
          X
        </button>
      </div>
      <div className="center">
        <div id="logo">
          <img src={logo} alt="logo" />
        </div>
        {isLoading && (
          <div className="spinner">
            <div className="loading"></div>
          </div>
        )}
        <div id="response-text" className={showText ? "active" : ""}>
          {text}
        </div>
        <button
          id="response-button"
          className={showButton ? "active" : ""}
          onClick={() => copyToClipboard(response)}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default App;
