import { Actor, HttpAgent } from "@dfinity/agent";
import { _SERVICE as LedgerActor } from "@candid/IcrcIndex/icrc_index";
import { idlFactory as LedgerFactory } from "@candid/IcrcIndex/icrc_index.idl";
import { Principal } from "@dfinity/principal";

export interface ICRCIndexActorArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default function ICRCIndexActor(args: ICRCIndexActorArgs) {
  const { canisterId, agent } = args;
  return Actor.createActor<LedgerActor>(LedgerFactory, {
    agent,
    canisterId,
  });
}
