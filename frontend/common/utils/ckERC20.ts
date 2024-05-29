import { Asset } from "@redux/models/AccountModels";
import getOrchestratorInfo from "@common/libs/ckERC20/getOrchestratorInfo";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { getMetadataInfo } from "@common/utils/icrc";
import store from "@redux/Store";
import { Principal } from "@dfinity/principal";
import logger from "@common/utils/logger";

export async function getckERC20Tokens(): Promise<Asset[]> {
  try {
    const canisterId = import.meta.env.VITE_CKUSDC_CANISTER_ID;
    const agent = store.getState().auth.userAgent;

    const { managed_canisters } = await getOrchestratorInfo({ agent, canisterId });

    const canisters = managed_canisters.map((data) => {
      const ledger = data.ledger as any;
      const index = data.index as any;

      return {
        ledger: ledger[0].Installed.canister_id as Principal,
        index: index[0].Installed.canister_id as Principal,
      };
    });

    const assetPromises: Promise<Asset>[] = canisters.map(async (canister) => {
      const { metadata } = IcrcLedgerCanister.create({
        agent,
        canisterId: canister.ledger,
      });

      const data = await metadata({ certified: false });
      const metadataInfo = getMetadataInfo(data);

      return {
        address: canister.ledger.toString(),
        decimal: metadataInfo.decimals.toString(),
        index: canister.index.toString(),
        logo: metadataInfo.logo,
        name: metadataInfo.name,
        shortDecimal: metadataInfo.decimals.toString(),
        sortIndex: 20000,
        subAccounts: [],
        supportedStandards: [],
        symbol: metadataInfo.symbol,
        tokenName: metadataInfo.name,
        tokenSymbol: metadataInfo.symbol,
      };
    });

    return await Promise.all(assetPromises);
  } catch (error) {
    logger.debug("getckERC20Tokens", error);
    return [];
  }
}
