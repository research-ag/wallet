import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
import { ApproveArgs } from "@candid/icrcLedger/icrcLedgerService";

interface ICRC2ApproveArgs extends ApproveArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC2Approve(args: ICRC2ApproveArgs) {
  const { canisterId, agent, ...params } = args;
  const actor = ICRCLedgerActor({ canisterId, agent });
  return await actor.icrc2_approve(params);
}
