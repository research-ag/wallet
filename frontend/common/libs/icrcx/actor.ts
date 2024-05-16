import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as icrcxFactory } from "@/candid/icrcx/candid.did";
import { _SERVICE as icrcxService } from "@/candid/icrcx/service.did";

interface ICRCXActorArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export function ICRCXActor(args: ICRCXActorArgs) {
  return Actor.createActor<icrcxService>(icrcxFactory, {
    agent: args.agent,
    canisterId: args.canisterId,
  });
}
