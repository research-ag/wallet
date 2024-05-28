import ckERC20Actor, { CKERC20ActorArgs } from "@/common/libs/ckERC20/actor";

export default async function getOrchestratorInfo(args: CKERC20ActorArgs) {
  const actor = ckERC20Actor(args);
  return await actor.get_orchestrator_info();
}
