import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as icrcxFactory } from "@/candid/icrcx/candid.did";

interface ICRCXActorArgs {
  address: string | Principal;
  agent: HttpAgent;
};

export default function getICRCXActor(args: ICRCXActorArgs) {
  const { address, agent } = args;
  return Actor.createActor<ICRCXActorArgs>(icrcxFactory, {
    agent,
    canisterId: typeof address === "string" ? Principal.fromText(address) : address,
  });
};

