import { ContactSubAccount, NewContact, ReceiverActions, ReceiverState } from "@/@types/transactions";
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
    case ReceiverActions.SET_RECEIVER_THIRD_NEW_CONTACT:
      return {
        ...state,
        thirdNewContact: action.payload,
      };
    case ReceiverActions.SET_RECEIVER_THIRD_CONTACT_SUB_ACCOUNT:
      return {
        ...state,
        thirdContactSubAccount: action.payload,
      };
    default:
      return state;
  }
}

export default function useReceiver() {
  const [state, dispatch] = useReducer(receiverReducer, initialState);
  console.log("RECEIVER STATE", state);

  function setReceiverOwnSubAccount(subAccount: SubAccount) {
    // TODO: clean third new contact
    // TODO: clean thirdContactSubAccount
    dispatch({ type: ReceiverActions.SET_RECEIVER_OWN_SUB_ACCOUNT, payload: subAccount });
  }

  function setReceiverNewContact(newContact: NewContact) {
    // TODO: clean ownSubAccount
    // TODO: clean thirdContactSubAccount
    dispatch({ type: ReceiverActions.SET_RECEIVER_THIRD_NEW_CONTACT, payload: newContact });
  }

  function setReceiverThirdContactSubAccount(subAccount: ContactSubAccount) {
    // TODO: clean ownSubAccount
    // TODO: clean thirdNewContact
    dispatch({ type: ReceiverActions.SET_RECEIVER_THIRD_CONTACT_SUB_ACCOUNT, payload: subAccount });
  }

  return { receiver: state, setReceiverOwnSubAccount, setReceiverNewContact, setReceiverThirdContactSubAccount };
}
