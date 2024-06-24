import store from "@redux/Store";
import { AccountIdentifier, SubAccount as SubAccountNNS } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { GetAllTransactionsICPParams } from "@/@types/assets";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { formatckBTCTransaccion, formatIcpTransaccion } from "@/pages/home/helpers/mappers";
import { Actor } from "@dfinity/agent";
import { _SERVICE as LedgerActor } from "@candid/IcrcIndex/icrc_index";
import { idlFactory as LedgerFactory } from "@candid/IcrcIndex/icrc_index.idl";
import logger from "@/common/utils/logger";
import { SpecialTxTypeEnum } from "@common/const";

export const getAllTransactionsICP = async (params: GetAllTransactionsICPParams) => {
  const { subaccount_index, isOGY } = params;

  const myPrincipal = store.getState().auth.userPrincipal;
  let subacc: SubAccountNNS | undefined = undefined;

  try {
    subacc = SubAccountNNS.fromBytes(hexToUint8Array(subaccount_index)) as SubAccountNNS;
  } catch (error) {
    logger.debug("Error parsing subaccount", error);
    subacc = undefined;
  }

  const accountIdentifier = AccountIdentifier.fromPrincipal({
    principal: myPrincipal,
    subAccount: subacc,
  });

  try {
    const response = await fetch(
      `${isOGY ? import.meta.env.VITE_ROSETTA_URL_OGY : import.meta.env.VITE_ROSETTA_URL}/search/transactions`,
      {
        method: "POST",
        body: JSON.stringify({
          network_identifier: {
            blockchain: isOGY ? import.meta.env.VITE_NET_ID_BLOCKCHAIN_OGY : import.meta.env.VITE_NET_ID_BLOCKCHAIN,
            network: isOGY ? import.meta.env.VITE_NET_ID_NETWORK_OGY : import.meta.env.VITE_NET_ID_NETWORK,
          },
          account_identifier: {
            address: accountIdentifier.toHex(),
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      },
    ).catch();

    if (!response.ok) throw Error(`${response.statusText}`);
    const { transactions } = await response.json();

    const transactionsInfo = transactions.map(({ transaction, block_identifier }: any) =>
      formatIcpTransaccion(accountIdentifier.toHex(), transaction, block_identifier.hash),
    );

    return transactionsInfo;
  } catch (error) {
    logger.debug("Error getting transactions", error);
    return [];
  }
};

interface GetAllTransactionsICRCParams {
  canisterId: string | Principal;
  subaccount_index: Uint8Array;
  assetSymbol: string;
  canister: string;
  subNumber?: string;
}

export const getAllTransactionsICRC1 = async (params: GetAllTransactionsICRCParams) => {
  try {
    const { canisterId, subaccount_index, assetSymbol, canister, subNumber } = params;

    const myAgent = store.getState().auth.userAgent;
    const myPrincipal = store.getState().auth.userPrincipal;
    const actor = Actor.createActor<LedgerActor>(LedgerFactory, {
      agent: myAgent,
      canisterId,
    });

    const result = await actor.get_account_transactions({
      account: { owner: myPrincipal, subaccount: [subaccount_index] },
      max_results: BigInt(100),
      start: [],
    });

    if (!result?.Ok?.transactions) return [];

    return result?.Ok?.transactions
      .filter((tx) => tx.transaction.kind !== SpecialTxTypeEnum.Enum.approve)
      .map(({ transaction, id }) => {
        const formatresult = formatckBTCTransaccion({
          ckBTCTransaction: transaction,
          id,
          principal: myPrincipal?.toString(),
          symbol: assetSymbol,
          canister,
          subNumber,
        });

        return formatresult;
      });
  } catch (error) {
    logger.debug("Error getting transactions", error);
    return [];
  }
};
