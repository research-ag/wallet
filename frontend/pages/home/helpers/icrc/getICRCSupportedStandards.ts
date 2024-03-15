import { SupportedStandard } from "@/@types/icrc";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";
// import { PollStrategy, PollStrategyFactory } from "@dfinity/agent/lib/cjs/polling";
import { backoff, chain, conditionalDelay, once, timeout } from "@dfinity/agent/lib/cjs/polling/strategy";

interface ICRCSupportedStandardsParams {
    assetAddress: string;
    agent: HttpAgent;
}

export async function getICRCSupportedStandards(params: ICRCSupportedStandardsParams): Promise<SupportedStandard[]> {
    try {
        const { assetAddress, agent } = params;
        const canisterId = Principal.fromText(assetAddress);
        const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
            agent,
            canisterId,
        });
        const response = await ledgerActor.icrc1_supported_standards();
        return response.map((standard) => standard.name as SupportedStandard);
    } catch (error) {
        console.error(error);
        return [];
    }
}

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;

export function getIcrcActor(params: ICRCSupportedStandardsParams): LedgerActor {
    const { assetAddress, agent } = params;
    const canisterId = Principal.fromText(assetAddress);
    const ledgerActor = Actor.createActor<LedgerActor>(LedgerFactory, {
        agent,
        canisterId,
        pollingStrategyFactory: () => chain(conditionalDelay(once(), 1000), backoff(1000, 1.2), timeout(FIVE_MINUTES_IN_MSEC)),
    });
    return ledgerActor;
};
