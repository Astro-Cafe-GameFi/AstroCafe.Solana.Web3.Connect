# AstroCafe.Solana.Web3.Connect

It makes available to connect Solana web wallets such as the Phantom, Solflare and so on.

Link to this site to

- Sign a message

- Send a transaction

## Installation

`yarn` to install

`yarn start` to begin

`yarn build` to compile

## Sign a message

| Params          | Description           |
| --------------- | --------------------- |
| &action=sign    | action to verify user |
| &message=hello  | message to sign       |

example to sign a message: `http://localhost:3000/?action=sign&message=helloworld`

## Send a transaction

Create a link with the following params

| Params            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| &action=send      | action to send transaction                                       |
| &networkId=0      | 0 for mainnet, 1 for devnet                                      |
| &txMessage=0x01   | The message of transaction compiled                              |

example to send a transaction: `http://localhost:3000/?action=send&networkId=0&txMessage=0x1000...0000`
