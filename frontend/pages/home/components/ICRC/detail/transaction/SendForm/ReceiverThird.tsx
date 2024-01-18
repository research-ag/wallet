import {
  ReceiverState,
  SenderState,
  SetReceiverNewContact,
  SetReceiverThirdContactSubAccount,
} from "@/@types/transactions";
import ReceiverContactBook from "./ReceiverContactBook";
import ReceiverManual from "./ReceiverManual";

interface ReceiverThirdProps {
  setReceiverNewContact: SetReceiverNewContact;
  receiver: ReceiverState;
  sender: SenderState;
  setReceiverThirdContactSubAccount: SetReceiverThirdContactSubAccount;
  isManual: boolean;
}

export default function ReceiverThird(props: ReceiverThirdProps) {
  const { sender, setReceiverNewContact, receiver, setReceiverThirdContactSubAccount, isManual } = props;
  // TODO: send manual using principal and sub account
  // TODO: send using the contact book sub accounts
  // TODO: send using the scanner
  // TODO: send using the principal with 0x0 selected by default
  if (isManual) return <ReceiverManual setReceiverNewContact={setReceiverNewContact} receiver={receiver} />;
  return <ReceiverContactBook sender={sender} setReceiverThirdContactSubAccount={setReceiverThirdContactSubAccount} />;
}
