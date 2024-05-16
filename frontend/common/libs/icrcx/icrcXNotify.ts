import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";
import { NotifyArg } from "@candid/icrcx/service.did";

interface IcrcXNotifyArgs extends NotifyArg {
  address: string | Principal;
  agent: HttpAgent;
};

export default async function icrcXNotify(args: IcrcXNotifyArgs) {
  const { address, agent, token } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.icrcXNotify({ token });
};
