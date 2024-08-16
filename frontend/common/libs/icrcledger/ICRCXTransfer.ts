import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Account, _SERVICE as IcrcxActor } from "@candid/icrcx/service.did";
import { idlFactory as IcrcxIDLFactory } from "@candid/icrcx/candid.did";
import { getCreditBalance } from "@redux/services/ServiceActions";
import { isString } from "lodash";

interface ICRCXWithdrawArgs {
  to: Account;
  token: Principal;
  amount: bigint;
  expected_fee: [] | [bigint];
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRCXWithdraw(args: ICRCXWithdrawArgs) {
  const { canisterId, agent, ...params } = args;
  const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
    agent: agent,
    canisterId: canisterId,
  });
  const res = await serviceActor.icrc84_withdraw(params);

  if ((res as any).Ok) {
    const servicePrincipal = isString(canisterId) ? canisterId : canisterId.toText();
    const data = await getCreditBalance(agent, servicePrincipal, params.token.toText());
    return { res, data };
  }

  return { res, undefined };
}
