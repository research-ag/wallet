import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
import { TransferFromArgs } from "@candid/icrcLedger/icrcLedgerService";
import { HttpAgent } from "@dfinity/agent";

interface ICRC2TransferFormArgs extends TransferFromArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC2TransferForm(args: ICRC2TransferFormArgs) {
  const { canisterId, agent, ...params } = args;
  const canister = ICRCLedgerActor({ canisterId, agent });
  return await canister.icrc2_transfer_from(params);
}
