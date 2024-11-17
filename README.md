# AstroCafe.Solana.Web3.Connect

AstroCafe.Solana.Web3.Connect is a Unity library that facilitates interaction between Solana Web3 wallets (e.g. Phatom, Solflare), and games made in Unity on macOS and Windows. This library is called when a transaction on the Solana blockchain is initiated within the game. When a transaction is initiated in the game, a web page is displayed where a connection with Solana Web3 wallets is established, enabling users to interact directly with the Solana blockchain from the Unity game on macOS and Windows.

Link to this site to

- Sign a message

- Send a transaction

## Installation

`yarn` to install

`yarn dev` to begin

`yarn build` to compile

## Sign a message

| Params         | Description           |
| -------------- | --------------------- |
| &action=sign   | action to verify user |
| &message=hello | message to sign       |

example to sign a message: `http://localhost:3000/?action=sign&message=helloworld`

## Send a transaction

Create a link with the following params

| Params          | Description                         |
| --------------- | ----------------------------------- |
| &action=send    | action to send transaction          |
| &networkId=0    | 0 for mainnet, 1 for devnet         |
| &txMessage=0x01 | The message of transaction compiled |

example to send a transaction: `http://localhost:3000/?action=send&networkId=0&txMessage=0x1000...0000`

## The page url

https://astro-cafe-gamefi.github.io/AstroCafe.Solana.Web3.Connect/
