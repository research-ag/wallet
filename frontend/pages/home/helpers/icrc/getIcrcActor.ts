import { Actor, HttpAgent } from "@dfinity/agent";
import { backoff, chain, conditionalDelay, once, timeout } from "@dfinity/agent/lib/cjs/polling/strategy";
import { Principal } from "@dfinity/principal";
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;

export interface IcrcActorParams {
    assetAddress: string;
    agent: HttpAgent;
};

export function getIcrcActor(params: IcrcActorParams): LedgerActor {
    const { assetAddress, agent } = params;
    const canisterId = Principal.fromText(assetAddress);
    const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
        agent,
        canisterId,
        pollingStrategyFactory: () => chain(conditionalDelay(once(), 250), backoff(0, 0), timeout(FIVE_MINUTES_IN_MSEC)),
    });
    return ledgerActor;
};
