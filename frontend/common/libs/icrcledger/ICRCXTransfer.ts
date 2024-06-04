import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE as IcrcxActor, WithdrawArgs } from "@candid/icrcx/service.did";
import { idlFactory as IcrcxIDLFactory } from "@candid/icrcx/candid.did";

interface ICRCXWithdrawArgs extends WithdrawArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRCXWithdraw(args: ICRCXWithdrawArgs) {
  const { canisterId, agent, ...params } = args;
  const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
    agent: agent,
    canisterId: canisterId,
  });
  return await serviceActor.icrcX_withdraw(params);
}
