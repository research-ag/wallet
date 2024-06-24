import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
import { AllowanceArgs } from "@candid/icrcLedger/icrcLedgerService";

interface ICRC2AllowanceArgs extends AllowanceArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC2Allowance(args: ICRC2AllowanceArgs) {
  const { canisterId, agent, ...params } = args;
  const actor = ICRCLedgerActor({ canisterId, agent });
  return await actor.icrc2_allowance(params);
}
