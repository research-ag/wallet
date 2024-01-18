import ReceiverContactBook from "./ReceiverContactBook";
import ReceiverManual from "./ReceiverManual";

interface ReceiverThirdProps {
  isManual: boolean;
}

export default function ReceiverThird(props: ReceiverThirdProps) {
  const { isManual } = props;
  // TODO: send manual using principal and sub account
  // TODO: send using the contact book sub accounts
  // TODO: send using the scanner
  // TODO: send using the principal with 0x0 selected by default
  if (isManual) return <ReceiverManual />;
  return <ReceiverContactBook />;
}
