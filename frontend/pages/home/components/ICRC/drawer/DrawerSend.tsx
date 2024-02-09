import { useState } from "react";
import SendForm from "../detail/transaction/SendForm";
import DialogSendConfirmation from "../detail/transaction/DialogSendConfirmation";
import SenderInitializer from "../detail/transaction/SendForm/SenderInitializer";
import SendFormConditionalRender from "../detail/transaction/SendForm/SendFormConditionalRender";
import { ProtocolTypeEnum } from "@/const";

interface DrawerSendProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

function DrawerSend({ drawerOpen, setDrawerOpen }: DrawerSendProps) {
  const [modal, showConfirmationModal] = useState(false);

  if (!drawerOpen) return <></>;

  return (
    <>
      <SenderInitializer>
        <SendFormConditionalRender showConfirmationModal={showConfirmationModal}>
          <SendForm setDrawerOpen={setDrawerOpen} />
        </SendFormConditionalRender>
      </SenderInitializer>
      <DialogSendConfirmation
        modal={modal}
        setDrawerOpen={setDrawerOpen}
        showConfirmationModal={showConfirmationModal}
        network={ProtocolTypeEnum.Enum.ICRC1}
      />
    </>
  );
}

export default DrawerSend;
