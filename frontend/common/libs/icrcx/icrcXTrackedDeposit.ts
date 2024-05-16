import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { Token } from "@candid/icrcx/service.did";

interface IcrcXTrackedDepositArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
  token: Token;
}

export default async function icrcXTrackedDeposit(args: IcrcXTrackedDepositArgs) {
  const { canisterId, agent, token } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.icrcXTrackedDeposit(token);
}
