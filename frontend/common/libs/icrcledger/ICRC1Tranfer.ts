import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
import { TransferArg } from "@candid/icrcLedger/icrcLedgerService";
import { HttpAgent } from "@dfinity/agent";

interface ICRC1TranferArgs extends TransferArg {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC1Tranfer(args: ICRC1TranferArgs) {
  const { canisterId, agent, ...params } = args;
  const actor = ICRCLedgerActor({ agent, canisterId });
  return await actor.icrc1_transfer(params);
}
