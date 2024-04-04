import { HttpAgent } from "@dfinity/agent";
import { Asset } from "@redux/models/AccountModels";

/**
 * Interface containing parameters for the updateAllBalances function
 */
export interface UpdateAllBalancesParams {
  /**
   * Flag indicating if loading animation should be displayed
   */
  loading: boolean;
  /**
   * Array of Asset objects representing the tokens to update balances for
   */
  /**
   * HttpAgent object used for making network requests
   */
  myAgent?: HttpAgent;
  assets: Asset[];
  /**
   * Optional flag indicating if basic search should be used (limited to 1000 subaccounts)
   */
  basicSearch?: boolean;
  /**
   * Optional flag indicating if data is being fetched after login
   */
  fromLogin?: boolean;
}

export type UpdateAllBalances = (params: UpdateAllBalancesParams) => Promise<Asset[] | undefined>;

export interface GetAllTransactionsICPParams {
  subaccount_index: string;
  loading: boolean;
  isOGY: boolean;
}
