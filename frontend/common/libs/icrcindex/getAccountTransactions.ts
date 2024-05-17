import ICRCIndexActor, { ICRCIndexActorArgs } from "@/common/libs/icrcindex/actor";
import { GetAccountTransactionsArgs } from "@candid/IcrcIndex/icrc_index";

type Args = GetAccountTransactionsArgs & ICRCIndexActorArgs;

export default function getAccountTransactions(args: Args) {
  const { account, agent, canisterId, max_results, start } = args;
  const actor = ICRCIndexActor({ canisterId, agent });
  return actor.get_account_transactions({ account, max_results, start });
}
