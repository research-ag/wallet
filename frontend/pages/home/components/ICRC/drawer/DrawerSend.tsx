/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Fragment } from "react";
import { GeneralHook } from "../../../hooks/generalHook";
import { SentHook } from "../../../hooks/sentHooks";
import QRscanner from "@pages/components/QRscanner";
import DialogSendConfirmation from "./DialogSendConfirmation";
import SendOwnAccount from "./SendOwnAccount";
import SendOutAccount from "./SendOutAccount";
import SendForm from "../detail/transaction/SendForm";

interface DrawerSendProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

function Drawer(props: DrawerSendProps) {
  const { setDrawerOpen, drawerOpen } = props;
  return <SendForm setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen}  />;
}

function DrawerSend(props: DrawerSendProps) {
  if (!props.drawerOpen) return <></>;
  return <Drawer {...props} />;
}

export default DrawerSend;

function OldComponent() {
  // const { selectedAsset, selectedAccount: baseAccount } = GeneralHook();
  return (
    <Fragment>
      {/* INFO: confirm transference */}
      {/* {modal && (
        <DialogSendConfirmation
          setDrawerOpen={setDrawerOpen}
          showModal={showModal}
          modal={modal}
          receiver={receiver}
          sendingStatus={sendingStatus}
          amountBI={amountBI}
          setAmountBI={setAmountBI}
          selectedAccount={selectedAccount}
          selectedAsset={selectedAsset}
        ></DialogSendConfirmation>
      )} */}
    </Fragment>
  );
}
