# ICRC-1 Wallet

[![License: GPL3](https://img.shields.io/badge/License-GPL3-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/#)
[![React Version](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-4.4.3-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/badge/node-18.16.0-green.svg)](https://nodejs.org/es)
[![dfx Version](https://img.shields.io/badge/dfx-0.14.1-violet.svg)](https://internetcomputer.org/docs/current/references/cli-reference/dfx-parent)

ICRC-1 Wallet is an application designed for Internet Computer Network. This project allows users to manage their digital assets and perform transactions with major ICRC1 cryptocurrencies. Whether you're a beginner or an experienced crypto enthusiast, ICRC-1 Wallet provides a user-friendly interface for your Wallet needs.

## Table of Contents

- [Getting Started](#getting-started)
- [Local deployment](#local-deployment)
- [IC deployment](#ic-deployment)
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
   npm i -g ic-mops
   mops install
   ```

4. Add git info base file named generatedGitInfo.json inside root frontend folder:

   ```
   {
      "gitBranch": "branch-name",
      "gitCommitHash": "b5508aa23aeef0b6b23740d12c5029c8ae15f793",
      "dateString": "2024.8.26",
      "hourString": "11:46:40"
   }
   ```

## Local deployment

1. Create canisters on local replica and save the ID shown in the output

   ```
   dfx start --clean --background
   dfx canister create --all
   ```

2. Modify .env file in the root of the project with the previously saved IDs:

   ```
   # Canister id of RXDB replica canister
   VITE_DB_CANISTER_ID=[db canister ID]
   VITE_DB_CANISTER_HOST=http://localhost:8000
   # SIWE canister id
   VITE_CANISTER_ID_IC_SIWE_PROVIDER=[ic_siwe_provider canister ID]
   ```

3. Deploy canisters to the local replica

   ```
   make deploy-local
   ```

   Step by step and arguments needed are specify in Makefile (at project root).
   Frontend will be deployed under the canister name "assets"

4. For development server

   ```
   npm run dev
   ```

## IC deployment

1. Create canisters on IC Blockchain and save the ID shown in the output

   ```
   dfx canister --ic create --all
   ```

2. Modify .env file in the root of the project with the previously saved IDs:

   ```
   # Canister id of RXDB replica canister
   VITE_DB_CANISTER_ID=[db canister ID]
   VITE_DB_CANISTER_HOST=https://identity.ic0.app
   # SIWE canister id
   VITE_CANISTER_ID_IC_SIWE_PROVIDER=[ic_siwe_provider canister ID]
   ```

3. Deploy canisters to mainnet

   ```
   make deploy
   ```

Step by step and arguments needed are specify in Makefile (at project root).
Frontend will be deployed under the canister name "assets"

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
