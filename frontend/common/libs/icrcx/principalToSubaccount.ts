import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";

interface PrincipalToSubaccountArgs {
  address: string | Principal;
  agent: HttpAgent;
  principal: Principal;
};

export default async function principalToSubaccount(args: PrincipalToSubaccountArgs) {
  const { principal, address, agent } = args;
  const actor = ICRCXActor({ address, agent });
  return await actor.principalToSubaccount(principal);
};
