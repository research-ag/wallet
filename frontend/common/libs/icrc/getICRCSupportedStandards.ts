import { SupportedStandard } from "@/@types/icrc";
import { HttpAgent } from "@dfinity/agent";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import logger from "@/common/utils/logger";
import { getIcrcActor } from "./getIcrcActor";
extend(utc);
//

interface ICRCSupportedStandardsParams {
  assetAddress: string;
  agent: HttpAgent;
}

export async function getICRCSupportedStandards(params: ICRCSupportedStandardsParams): Promise<SupportedStandard[]> {
  try {
    const ledgerActor = getIcrcActor(params);
    const response = await ledgerActor.icrc1_supported_standards();
    return response.map((standard) => standard.name as SupportedStandard);
  } catch (error) {
    logger.debug(error);
    return [];
  }
}
