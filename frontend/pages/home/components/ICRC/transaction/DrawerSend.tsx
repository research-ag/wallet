import { useEffect, useState } from "react";
import SendForm from "@/pages/home/components/ICRC/transaction/SendForm";
import DialogSendConfirmation from "@/pages/home/components/ICRC/transaction/DialogSendConfirmation";
import SenderInitializer from "@/pages/home/components/ICRC/transaction/SendForm/SenderInitializer";
import SendFormConditionalRender from "@/pages/home/components/ICRC/transaction/SendForm/SendFormConditionalRender";
import { ProtocolTypeEnum } from "@/common/const";
import contactCacheRefresh from "@pages/contacts/helpers/contactCacheRefresh";

function DrawerSend() {
  const [modal, showConfirmationModal] = useState(false);

  // TODO: on open the drawer contact allowances and balances should be updated
  useEffect(() => {
    (async () => {
      await contactCacheRefresh();
    })();
  }, []);

  return (
    <div className="px-6 mt-8 overflow-y-auto ">
      <SenderInitializer>
        <SendFormConditionalRender showConfirmationModal={showConfirmationModal}>
          <SendForm />
        </SendFormConditionalRender>
      </SenderInitializer>
      <DialogSendConfirmation
        modal={modal}
        showConfirmationModal={showConfirmationModal}
        network={ProtocolTypeEnum.Enum.ICRC1}
      />
    </div>
  );
}

export default DrawerSend;
