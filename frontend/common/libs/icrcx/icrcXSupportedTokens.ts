import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";

interface IcrcXSupportedTokensArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function icrcXSupportedTokens(args: IcrcXSupportedTokensArgs) {
  const { canisterId, agent } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.icrcXSupportedTokens();
}
