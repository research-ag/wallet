import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { Token } from "@candid/icrcx/service.did";

interface IcrcXCreditArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
  token: Token;
}

export default async function icrcXCredit(args: IcrcXCreditArgs) {
  const { canisterId, agent, token } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.icrcXCredit(token);
}
