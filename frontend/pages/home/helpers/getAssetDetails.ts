import { SupportedStandard } from "@/@types/icrc";
import store from "@redux/Store";
import { getMetadataInfo } from "@common/utils/icrc";
import { getUSDFromToken } from "@common/utils/amount";
import { Asset } from "@redux/models/AccountModels";
import { AccountDefaultEnum } from "@common/const";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import ICRC1BalanceOf from "@/common/libs/icrcledger/ICRC1BalanceOf";
import ICRC1SupportedStandards from "@/common/libs/icrcledger/ICRC1SupportedStandards";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import logger from "@/common/utils/logger";

interface DetailsParams {
  canisterId: Principal | string;
  includeDefault: boolean;
  customSymbol?: string;
  customName?: string;
  sortIndex?: number;
  supportedStandard?: SupportedStandard[];
  ledgerIndex?: string;
}
/**
 * Get asset details from the ledger (supported standards, symbol, name, logo, balance and usd amount)
 */
export default async function getAssetDetails(params: DetailsParams): Promise<Asset | undefined> {
  try {
    const { canisterId, customSymbol, customName, sortIndex, supportedStandard: standard, ledgerIndex } = params;

    const { metadata } = IcrcLedgerCanister.create({
      agent: store.getState().auth.userAgent,
      canisterId: typeof canisterId === "string" ? Principal.fromText(canisterId) : canisterId,
    });

    const myMetadata = await metadata({
      certified: false,
    });

    let supportedStandards: SupportedStandard[] = [];

    if (!standard) {
      supportedStandards = await ICRC1SupportedStandards({
        canisterId: canisterId.toString(),
        agent: store.getState().auth.userAgent,
      });
    } else {
      supportedStandards = standard;
    }

    const { symbol, decimals, name, logo, fee } = getMetadataInfo(myMetadata);

    const balance = await ICRC1BalanceOf({
      canisterId: canisterId,
      agent: store.getState().auth.userAgent,
      owner: store.getState().auth.userPrincipal,
      subaccount: [hexToUint8Array("0x0")],
    });

    const assetMarket = store.getState().asset.utilData.tokensMarket.find((token) => token.symbol === symbol);

    let USDAmount = "0";

    if (assetMarket) {
      USDAmount = getUSDFromToken(balance.toString(), assetMarket.price, decimals);
    }

    const asset: Asset = {
      sortIndex: sortIndex || 999,
      address: canisterId.toString(),
      index: ledgerIndex || "",
      tokenSymbol: symbol,
      tokenName: name,
      symbol: customSymbol || symbol,
      name: customName || name,
      logo,
      decimal: decimals.toFixed(0),
      shortDecimal: decimals.toFixed(0),
      supportedStandards,
      subAccounts: [
        {
          sub_account_id: "0x0",
          name: AccountDefaultEnum.Values.Default,
          amount: balance.toString(),
          currency_amount: USDAmount,
          address: "",
          decimal: decimals,
          symbol,
          transaction_fee: fee,
        },
      ],
    };

    return asset;
  } catch (error) {
    logger.debug(error);
    return undefined;
  }
}
