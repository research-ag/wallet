import {
  AllowanceContactSubAccount,
  NewAllowanceContact,
  SenderActions,
  SenderInitialState,
} from "@/@types/transactions";
import { useAppSelector } from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useEffect, useReducer } from "react";

const initialState = {} as SenderInitialState;

function senderReducer(state: SenderInitialState, action: any) {
  switch (action.type) {
    case SenderActions.SET_SENDER_ASSET:
      return { ...state, asset: action.payload };
    case SenderActions.SET_SENDER_SUB_ACCOUNT:
      return { ...state, subAccount: action.payload };
    case SenderActions.SET_SENDER_ALLOWANCE_CONTACT:
      return { ...state, allowanceContactSubAccount: action.payload };
    case SenderActions.SET_SENDER_NEW_ALLOWANCE_CONTACT:
      return { ...state, newAllowanceContact: action.payload };
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
    dispatch({ type: SenderActions.SET_SENDER_ALLOWANCE_CONTACT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_NEW_ALLOWANCE_CONTACT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: subAccount });
  }

  function setSenderAllowanceContact(allowanceContactSubAccount: AllowanceContactSubAccount) {
    dispatch({ type: SenderActions.SET_SENDER_NEW_ALLOWANCE_CONTACT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_ALLOWANCE_CONTACT, payload: allowanceContactSubAccount });
  }

  function setSenderNewAllowanceContact(newAllowanceContact: NewAllowanceContact) {
    dispatch({ type: SenderActions.SET_SENDER_SUB_ACCOUNT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_ALLOWANCE_CONTACT, payload: {} });
    dispatch({ type: SenderActions.SET_SENDER_NEW_ALLOWANCE_CONTACT, payload: newAllowanceContact });
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

  return {
    sender: state,
    setSenderAsset,
    setSenderSubAccount,
    setSenderAllowanceContact,
    setSenderNewAllowanceContact,
  };
}
