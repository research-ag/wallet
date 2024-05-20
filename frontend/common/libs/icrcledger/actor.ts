import { Actor, HttpAgent } from "@dfinity/agent";
import { backoff, chain, conditionalDelay, once, timeout } from "@dfinity/agent/lib/cjs/polling/strategy";
import { Principal } from "@dfinity/principal";
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
const DELAY = 250;

export interface IcrcActorParams {
  canisterId: string | Principal;
  agent: HttpAgent;
}

const pollingStrategyFactory = () =>
  chain(conditionalDelay(once(), DELAY), backoff(0, 0), timeout(FIVE_MINUTES_IN_MSEC));

export default function ICRCLedgerActor(params: IcrcActorParams): LedgerActor {
  const { canisterId, agent } = params;
  return Actor.createActor<LedgerActor>(LedgerFactory, { agent, canisterId, pollingStrategyFactory });
}
