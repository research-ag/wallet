import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { DepositArgs } from "@candid/icrcx/service.did";

interface IcrcXDepositArgs extends DepositArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function icrcXDeposit(args: IcrcXDepositArgs) {
  const { canisterId, agent, token, subaccount, amount } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.icrcXDeposit({ token, subaccount, amount });
}
