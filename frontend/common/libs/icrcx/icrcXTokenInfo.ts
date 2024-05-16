import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { Token } from "@candid/icrcx/service.did";

interface IcrcXTokenInfoArgs {
  address: string | Principal;
  agent: HttpAgent;
  token: Token;
};

export default async function icrcXTokenInfo(args: IcrcXTokenInfoArgs) {
  const { address, agent, token } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.icrcXTokenInfo(token);
};
