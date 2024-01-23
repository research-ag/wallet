import { useAppSelector } from "@redux/Store";
import ReceiverContactBook from "./ReceiverContactBook";
import ReceiverManual from "./ReceiverManual";

export default function ReceiverThird() {
  const { receiver } = useAppSelector((state) => state.transaction);
  if (receiver.isManual) return <ReceiverManual />;
  return <ReceiverContactBook />;
}
