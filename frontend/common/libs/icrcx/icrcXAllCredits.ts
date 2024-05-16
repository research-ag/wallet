import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";

interface icrcXAllCreditsArgs {
  address: string | Principal;
  agent: HttpAgent;
};

export default async function icrcXAllCredits(args: icrcXAllCreditsArgs) {
  const { address, agent } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.icrcXAllCredits();
};
