import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import ICRCLedgerActor from "./actor";

interface ICRC1FeeArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC1Fee(args: ICRC1FeeArgs) {
  const { canisterId, agent } = args;
  const actor = ICRCLedgerActor({ agent, canisterId });
  return await actor.icrc1_fee();
}
