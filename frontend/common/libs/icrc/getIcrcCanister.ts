import { HttpAgent } from "@dfinity/agent";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";

/**
 * Creates an IcrcLedgerCanister object from the provided asset address to interact with the canister.
 *
 * @param assetAddress The address of the asset, as a string or a Principal object.
 * @returns An IcrcLedgerCanister object representing the canister for the given asset address.
 */

interface CanisterOptions {
  assetAddress: string | Principal;
  agent?: HttpAgent;
}

export function getCanister(options: CanisterOptions): IcrcLedgerCanister {
  const { assetAddress, agent = store.getState().auth.userAgent } = options;

  const canisterId = typeof assetAddress === "string" ? Principal.fromText(assetAddress) : assetAddress;

  return IcrcLedgerCanister.create({
    agent,
    canisterId,
  });
}
