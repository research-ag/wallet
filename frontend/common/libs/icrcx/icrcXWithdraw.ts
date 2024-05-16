import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { WithdrawArgs } from "@candid/icrcx/service.did";

interface IcrcXWithdrawArgs extends WithdrawArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function icrcXWithdraw(args: IcrcXWithdrawArgs) {
  const { canisterId, agent, token, toSubaccount, amount } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.icrcXWithdraw({ token, toSubaccount, amount });
}
