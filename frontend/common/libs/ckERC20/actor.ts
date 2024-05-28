import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as ckERC20Factory } from "@candid/ckERC20/candid.did";
import { _SERVICE as ckERC20Service } from "@/candid/ckERC20/service.did";

export interface CKERC20ActorArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default function ckERC20Actor(args: CKERC20ActorArgs) {
  return Actor.createActor<ckERC20Service>(ckERC20Factory, {
    agent: args.agent,
    canisterId: args.canisterId,
  });
}
