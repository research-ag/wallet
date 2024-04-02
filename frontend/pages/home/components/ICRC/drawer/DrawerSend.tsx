import { useEffect, useState } from "react";
import SendForm from "../detail/transaction/SendForm";
import DialogSendConfirmation from "../detail/transaction/DialogSendConfirmation";
import SenderInitializer from "../detail/transaction/SendForm/SenderInitializer";
import SendFormConditionalRender from "../detail/transaction/SendForm/SendFormConditionalRender";
import { ProtocolTypeEnum } from "@/const";
import contactCacheRefresh from "@pages/contacts/helpers/contacts";

function DrawerSend() {
  const [modal, showConfirmationModal] = useState(false);

  useEffect(() => {
    (async () => {
      await contactCacheRefresh();
    })();
  }, []);

  return (
    <div className="px-8 mt-8 overflow-y-auto">
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
