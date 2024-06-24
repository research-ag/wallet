import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
import { Account } from "@candid/icrcLedger/icrcLedgerService";
import { HttpAgent } from "@dfinity/agent";

interface ICRC1BalanceOfArgs extends Account {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC1BalanceOf(args: ICRC1BalanceOfArgs) {
  const { canisterId, agent, ...params } = args;
  const actor = ICRCLedgerActor({ agent, canisterId });
  return await actor.icrc1_balance_of(params);
}
