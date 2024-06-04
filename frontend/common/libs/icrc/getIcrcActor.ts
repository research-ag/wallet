import { Actor, HttpAgent } from "@dfinity/agent";
import { backoff, chain, conditionalDelay, once, timeout } from "@dfinity/agent/lib/cjs/polling/strategy";
import { Principal } from "@dfinity/principal";
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
const DELAY = 250;

/**
 * Interface defining the parameters required to create an ICRC Ledger Actor.
 */
export interface IcrcActorParams {
  /** The address of the ICRC Ledger canister. */
  assetAddress: string | Principal;
  /** The HTTP agent used for communication with the Dfinity network. */
  agent: HttpAgent;
}

/**
 * Creates a new ICRC Ledger Actor instance.
 *
 * This function takes an `IcrcActorParams` object containing the asset address and the HTTP agent
 * and returns a new `LedgerActor` instance. The function uses the provided agent and canister ID to
 * create the actor and configures a polling strategy that combines conditional delay, backoff, and timeout.
 *
 * @param params - An object containing the asset address and the HTTP agent.
 * @returns A new `LedgerActor` instance.
 */
export function getIcrcActor(params: IcrcActorParams): LedgerActor {
  const { assetAddress, agent } = params;
  const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
    agent,
    canisterId: assetAddress,
    pollingStrategyFactory: () => chain(conditionalDelay(once(), DELAY), backoff(0, 0), timeout(FIVE_MINUTES_IN_MSEC)),
  });
  return ledgerActor;
}
