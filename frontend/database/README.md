## Database Structure

The database is structured around a `WalletDatabase` service, which includes several functions to interact with the data: `dump`, `pullContacts`, `pullAssets`, `pushContacts`, and `pushAssets`.

The data is organized into records, each consisting of a Principal ID and a set of Asset and Contact collections.

## AssetDocument

The `AssetDocument` record includes details about a asset such as the address, decimal, deletion status, ID, ID number, index, logo, name, subAccounts, symbol, and update time.

## ContactDocument

The `ContactDocument` record includes details about a contact such as the account identifier, assets, deletion status, name, principal, and update time.

## Database Functions

- `dump` is a query function that returns all stored records. This function doesn't require any inputs and returns a vector of records, each containing a principal and a record of optional Asset and Contact documents.

- `pullContacts` is a query function that returns all Contact records from the database. It takes three parameters: a natural number, an optional text, and another natural number.

- `pullAssets` is similar to `pullContacts`, but it returns all Asset records from the database.

- `pushContacts` is a function that takes a vector of Contact documents and stores them in the database.

- `pushAssets` is similar to `pushContacts`, but it handles Asset documents.

## How It Works

The main idea for having a IC Canister that holds a database is to allow a secure decentralized data storage and real-time data updates for end users.

In a real-world application, users could interact with the database through a front-end application. The front-end would call these functions to display data to the user or update the database based on user actions.

DB Canister main functionality codebase can be found in `/db-canister` folder. It uses RXMODB package which is a fork of RxDB for Motoko language.

Candid definitions file can be found in `/frontend/database/candid` folder. Candid creates a layer of comunication between the FE canister and the BE canister that stores the RxDB database.

The FE canister uses a RxDB databse as well and from time to time it will replicate its data back and foward over to the DB BE canister RxDB database, that way the users can clear their browser storage or use a different browser or computer and based on their Principal ID, after loggin in, can retreive back all stored information they already have from the DB BE canister.
