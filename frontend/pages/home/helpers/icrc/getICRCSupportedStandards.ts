import { getIcrcActor } from "@/pages/home/helpers/icrc";
import { SupportedStandard } from "@/@types/icrc";
import { HttpAgent } from "@dfinity/agent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
//

interface ICRCSupportedStandardsParams {
  assetAddress: string;
  agent: HttpAgent;
}

export async function getICRCSupportedStandards(params: ICRCSupportedStandardsParams): Promise<SupportedStandard[]> {
    try {
        const { assetAddress, agent } = params;
        const ledgerActor = getIcrcActor({
            agent,
            assetAddress,
        });
        const response = await ledgerActor.icrc1_supported_standards();
        return response.map((standard) => standard.name as SupportedStandard);
    } catch (error) {
        console.error(error);
        return [];
    }
}
