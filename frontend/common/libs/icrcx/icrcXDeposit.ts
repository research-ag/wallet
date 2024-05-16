import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { DepositArgs } from "@candid/icrcx/service.did";

interface IcrcXDepositArgs extends DepositArgs {
  address: string | Principal;
  agent: HttpAgent;
};

export default async function icrcXDeposit(args: IcrcXDepositArgs) {
  const { address, agent, token, subaccount, amount } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.icrcXDeposit({ token, subaccount, amount });
};
