import { SupportedStandard } from "@/@types/icrc";
import { HttpAgent } from "@dfinity/agent";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import ICRCXActor from "@/common/libs/icrcledger/actor";
extend(utc);
//

interface ICRCSupportedStandardsParams {
  assetAddress: string;
  agent: HttpAgent;
}

export async function getICRCSupportedStandards(params: ICRCSupportedStandardsParams): Promise<SupportedStandard[]> {
  try {
    const { assetAddress, agent } = params;
    const ledgerActor = ICRCXActor({
      agent,
      canisterId: assetAddress,
    });
    const response = await ledgerActor.icrc1_supported_standards();
    return response.map((standard) => standard.name as SupportedStandard);
  } catch (error) {
    console.error(error);
    return [];
  }
}
