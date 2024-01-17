import { useAppSelector } from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useEffect, useReducer } from "react";

export interface AllowanceContactSubAccount {
  contactName: string;
  contactPrincipal: string;
  contactAccountIdentifier: string | undefined;
  assetLogo: string | undefined;
  assetSymbol: string | undefined;
  assetTokenSymbol: string | undefined;
  assetAddress: string | undefined;
  assetDecimal: string | undefined;
  assetShortDecimal: string | undefined;
  assetName: string | undefined;
  subAccountIndex: string | undefined;
  subAccountId: string;
  subAccountAllowance: { allowance: string; expires_at: string } | undefined;
  subAccountName: string;
}

export interface SenderInitialState {
  asset: Asset;
  subAccount: SubAccount;
  allowanceContactSubAccount: AllowanceContactSubAccount;
}

enum SenderActions {
  SET_SENDER_ASSET = "SET_SENDER_ASSET",
  SET_SENDER_SUB_ACCOUNT = "SET_SENDER_SUB_ACCOUNT",
  SET_SENDER_ALLOWANCE_CONTACT = "SET_SENDER_ALLOWANCE_CONTACT",
}

const initialState = {} as SenderInitialState;

function senderReducer(state: SenderInitialState, action: any) {
  switch (action.type) {
    case SenderActions.SET_SENDER_ASSET:
      return { ...state, asset: action.payload };
    case SenderActions.SET_SENDER_SUB_ACCOUNT:
      return { ...state, subAccount: action.payload };
    case SenderActions.SET_SENDER_ALLOWANCE_CONTACT:
      return { ...state, allowanceContactSubAccount: action.payload };
    default:
      return state;
  }
}

export default function useSender() {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const [state, dispatch] = useReducer(senderReducer, initialState);

  console.log("STATE", state);

  function setSenderAsset(asset: Asset) {
    dispatch({ type: SenderActions.SET_SENDER_ASSET, payload: asset });
  }

  function setSenderSubAccount(subAccount: SubAccount) {
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: subAccount });
  }

  function setSenderAllowanceContact(allowanceContactSubAccount: AllowanceContactSubAccount) {
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_ALLOWANCE_CONTACT, payload: allowanceContactSubAccount });
  }

  useEffect(() => {
    if (selectedAsset) {
      setSenderAsset(selectedAsset);
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAccount) {
      setSenderSubAccount(selectedAccount);
    }
  }, [selectedAccount]);

  return { sender: state, setSenderAsset, setSenderSubAccount, setSenderAllowanceContact };
}
