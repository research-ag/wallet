import { SupportedStandard } from "@/@types/icrc";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
//
import { _SERVICE as LedgerActor } from "@candid/icrcLedger/icrcLedgerService";
import { idlFactory as LedgerFactory } from "@candid/icrcLedger/icrcLedgerCandid.did";

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
