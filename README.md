# ICRC-1 Wallet

[![License: GPL3](https://img.shields.io/badge/License-GPL3-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/#)
[![React Version](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-4.4.3-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/badge/node-18.16.0-green.svg)](https://nodejs.org/es)
[![dfx Version](https://img.shields.io/badge/dfx-0.14.1-violet.svg)](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent)

ICRC-1 Wallet is an application designed for Internet Computer Network. This project allows users to manage their digital assets and perform transactions with major ICRC1 cryptocurrencies. Whether you're a beginner or an experienced crypto enthusiast, ICRC-1 Wallet provides a user-friendly interface for your Wallet needs.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies](#technologies)
- [Usage](#usage)
- [License](#license)

## Getting Started

To get started with ICRC-1 Wallet, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone git@github.com:research-ag/wallet.git
   ```

2. Change your directory to the project folder:

   ```
   cd wallet
   ```

3. Install the project dependencies:

   ```
   npm install
   ```

4. Create .env file in the root of the project:

   ```
   NODE_ENV=PRODUCTION
   # Ledger canister for ICP
   VITE_ICP_LEDGER_CANISTER_ID="ryjl3-tyaaa-aaaaa-aaaba-cai"
   # Transaction history API for ICP
   VITE_ROSETTA_URL=https://rosetta-api.internetcomputer.org
   # Blockchain ID for the Network to use
   VITE_NET_ID_BLOCKCHAIN="Internet Computer"
   # Network ID for the Network to use
   VITE_NET_ID_NETWORK="00000000000000020101"
   # HOST for login with Internet Identity
   VITE_AGGENT_HOST=https://icp0.io
   # HOST for login with NFID
   VITE_AGGENT_NFID_HOST=https://nfid.one
   # APP logo for loging
   VITE_APP_LOGO=https://bv3c6-6aaaa-aaaap-abejq-cai.icp0.io/assets/hpl-wallet-f3061133.svg
   # APP NAME
   VITE_APP_NAME=HPL
   # Market price in USD for ICRC1 cryptocurrencies
   VITE_APP_TOKEN_MARKET=https://nftpkg.com/api/icpcoins/list

   ```

5. Run the development server:

```
npm run dev
```

6. Open your web browser and visit `http://localhost:3000` to access the ICRC-1 Wallet application.

## Features

- Create and manage wallets for major cryptocurrencies.
- View your digital asset portfolio and transaction history.
- Send and receive cryptocurrencies securely.
- Real-time cryptocurrency price tracking.
- Support for Internet Computer Network's unique features.

## Technologies

ICRC-1 Wallet is built using the following technologies:

- React 18.2
- TypeScript
- Internet Computer Network with Dfinity.js (for blockchain interaction)
- Redux for state management
- Zod for declaration and validation of schemas
- Radix for UI development
- CVA for building type-safe UI components
- Tailwind as utility-first CSS framework pack
- i18next for language management

## Usage

Once you have installed the project and started the development server, you can access the ICRC-1 Wallet application in your web browser. Here are some basic usage instructions:

- Create a new wallet and secure your wallet information.
- Add your cryptocurrencies and manage your digital assets.
- Send and receive cryptocurrencies to and from other users.
- Explore real-time price charts and market data.

## License

This project is licensed under the GPL3 License - see the [LICENSE](LICENSE) file for details.
