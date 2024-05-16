import { Principal } from "@dfinity/principal";
import { ICRCXActor } from "@/common/libs/icrcx/actor";
import { HttpAgent } from "@dfinity/agent";

interface PrincipalToSubaccountArgs {
  canisterId: string | Principal;
  agent: HttpAgent;
  principal: Principal;
}

export default async function principalToSubaccount(args: PrincipalToSubaccountArgs) {
  const { principal, canisterId, agent } = args;
  const actor = ICRCXActor({ canisterId, agent });
  return await actor.principalToSubaccount(principal);
}
