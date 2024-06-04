import { useAppSelector } from "@redux/Store";
import ContactScannerReceiver from "./ContactScannerReceiver";
import ReceiverManual from "./ReceiverManual";
import ContactBookReceiver from "./ContactBookReceiver";
import ServiceBookReceiver from "./ServiceBookReceiver";

export default function ReceiverThird() {
  const { receiver } = useAppSelector((state) => state.transaction);
  if (receiver?.thirdContactSubAccount?.subAccountId) return <ContactBookReceiver />;
  if (receiver?.serviceSubAccount?.servicePrincipal) return <ServiceBookReceiver />;
  if (receiver.isManual) return <ReceiverManual />;
  return <ContactScannerReceiver />;
}
