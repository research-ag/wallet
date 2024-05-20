import { SupportedStandard } from "@/@types/icrc";
import { HttpAgent } from "@dfinity/agent";
import { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import { Principal } from "@dfinity/principal";
import ICRCLedgerActor from "./actor";
extend(utc);
//

interface ICRCSupportedStandardsParams {
  canisterId: string | Principal;
  agent: HttpAgent;
}

export default async function ICRC1SupportedStandards(
  args: ICRCSupportedStandardsParams,
): Promise<SupportedStandard[]> {
  try {
    const ledgerActor = ICRCLedgerActor(args);
    const response = await ledgerActor.icrc1_supported_standards();
    return response.map((standard) => standard.name as SupportedStandard);
  } catch (error) {
    console.error(error);
    return [];
  }
}
