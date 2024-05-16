import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";

interface IcrcXSupportedTokensArgs {
  address: string | Principal;
  agent: HttpAgent;
};

export default async function icrcXSupportedTokens(args: IcrcXSupportedTokensArgs) {
  const { address, agent } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.icrcXSupportedTokens();
};
