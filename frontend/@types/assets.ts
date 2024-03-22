import { HttpAgent } from "@dfinity/agent";
import { Asset } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";

/**
 * Interface containing parameters for the updateAllBalances function
 */
export interface UpdateAllBalancesParams {
  /**
   * Flag indicating if loading animation should be displayed
   */
  loading: boolean;
  /**
   * HttpAgent object used for making network requests
   */
  myAgent: HttpAgent;
  /**
   * Array of Token objects representing the tokens to update balances for
   */
  tokens: Token[];
  /**
   * Optional flag indicating if basic search should be used (limited to 1000 subaccounts)
   */
  basicSearch?: boolean;
  /**
   * Optional flag indicating if data is being fetched after login
   */
  fromLogin?: boolean;
}

export interface UpdateBalanceReturn {
  newAssetsUpload: Asset[];
  tokens: Token[];
}

