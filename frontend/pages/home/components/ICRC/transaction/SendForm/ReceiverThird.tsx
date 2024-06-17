import { useAppSelector } from "@redux/Store";
import ContactScannerReceiver from "@/pages/home/components/ICRC/transaction/SendForm/ContactScannerReceiver";
import ReceiverManual from "@/pages/home/components/ICRC/transaction/SendForm/ReceiverManual";
import ContactBookReceiver from "@/pages/home/components/ICRC/transaction/SendForm/ContactBookReceiver";
import ServiceBookReceiver from "@/pages/home/components/ICRC/transaction/SendForm/ServiceBookReceiver";

export default function ReceiverThird() {
  const { receiver } = useAppSelector((state) => state.transaction);
  if (receiver?.thirdContactSubAccount?.subAccountId) return <ContactBookReceiver />;
  if (receiver?.serviceSubAccount?.servicePrincipal) return <ServiceBookReceiver />;
  if (receiver.isManual) return <ReceiverManual />;
  return <ContactScannerReceiver />;
}
