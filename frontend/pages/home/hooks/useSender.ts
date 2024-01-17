import { useAppSelector } from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useEffect, useReducer } from "react";

export interface SenderInitialState {
  asset: Asset;
  subAccount: SubAccount;
}

enum SenderActions {
  SET_SENDER_ASSET = "SET_SENDER_ASSET",
  SET_SENDER_SUB_ACCOUNT = "SET_SENDER_SUB_ACCOUNT",
}

const initialState = {} as SenderInitialState;

function senderReducer(state: SenderInitialState, action: any) {
  switch (action.type) {
    case SenderActions.SET_SENDER_ASSET:
      return { ...state, asset: action.payload };
    case SenderActions.SET_SENDER_SUB_ACCOUNT:
      return { ...state, subAccount: action.payload };
    default:
      return state;
  }
}

export default function useSender() {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const [state, dispatch] = useReducer(senderReducer, initialState);

  console.log("sender state", state);

  function setSenderAsset(asset: Asset) {
    dispatch({ type: SenderActions.SET_SENDER_ASSET, payload: asset });
  }

  function setSenderSubAccount(subAccount: SubAccount) {
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: subAccount });
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

  return { sender: state, setSenderAsset, setSenderSubAccount };
}
