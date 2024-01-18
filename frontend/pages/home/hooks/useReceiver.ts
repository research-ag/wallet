import { ReceiverActions, ReceiverState } from "@/@types/transactions";
import { SubAccount } from "@redux/models/AccountModels";
import { useReducer } from "react";

const initialState = {} as ReceiverState;

function receiverReducer(state = initialState, action: any) {
  switch (action.type) {
    case ReceiverActions.SET_RECEIVER_OWN_SUB_ACCOUNT:
      return {
        ...state,
        ownSubAccount: action.payload,
      };
    default:
      return state;
  }
}

export default function useReceiver() {
  const [state, dispatch] = useReducer(receiverReducer, initialState);

  function setReceiverOwnSubAccount(subAccount: SubAccount) {
    dispatch({ type: ReceiverActions.SET_RECEIVER_OWN_SUB_ACCOUNT, payload: subAccount });
  }

  return { receiver: state, setReceiverOwnSubAccount };
}
