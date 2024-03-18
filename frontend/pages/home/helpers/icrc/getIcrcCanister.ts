import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";

/**
 * Creates an IcrcLedgerCanister object from the provided asset address to interact with the canister.
 *
 * @param assetAddress The address of the asset, as a string or a Principal object.
 * @returns An IcrcLedgerCanister object representing the canister for the given asset address.
 */
export function getCanister(assetAddress: string | Principal): IcrcLedgerCanister {
    const agent = store.getState().auth.userAgent;
    const canisterId = typeof assetAddress === "string"
        ? Principal.fromText(assetAddress)
        : assetAddress;

    return IcrcLedgerCanister.create({
        agent,
        canisterId,
    });
}


