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
  return <SendForm />;
}

function DrawerSend(props: DrawerSendProps) {
  if (!props.drawerOpen) return <></>;
  return <Drawer {...props} />;
}

export default DrawerSend;

function OldComponent() {
  // const {
  //   receiver,
  //   setReciver,
  //   setNewAccount,
  //   amount,
  //   setAmount,
  //   amountBI,
  //   setAmountBI,
  //   modal,
  //   showModal,
  //   qrView,
  //   setQRview,
  //   sendingStatus,
  //   assetDropOpen,
  //   setSelectedAccount,
  //   contactToSend,
  //   setContactToSend,
  //   selectedAccount,
  //   showAccounts,
  //   setOpenContactList,
  //   setManualSub,
  //   manualSub,
  //   setManualPrinc,
  //   manualPrinc,
  //   setManual,
  //   manual,
  //   setErrAddress,
  //   errAddress,
  //   setShowAccounts,
  //   setNewAccountErr,
  //   newAccount,
  //   setAssetDropOpen,
  //   setSendingStatus,
  //   newAccountErr,
  // } = SentHook(drawerOpen, baseAccount);

  // const { selectedAsset, selectedAccount: baseAccount } = GeneralHook();
  return (
    <Fragment>
      {/* {!receiver.icrcAccount.owner ? (
        qrView ? (
          <QRscanner
            setQRview={setQRview}
            qrView={qrView}
            onSuccess={(value: string) => {
              setNewAccount(value);
              setQRview(false);
              navigator.clipboard.writeText(value);
            }}
          />
        ) : (
          <SendOutAccount
            selectedAccount={selectedAccount}
            setNewAccount={setNewAccount}
            setContactToSend={setContactToSend}
            selectedAsset={selectedAsset}
            setQRview={setQRview}
            setReciver={setReciver}
            // TODO: refactor in a hook
            showAccounts={showAccounts}
            setShowAccounts={setShowAccounts}
            setOpenContactList={setOpenContactList}
            setNewAccountErr={setNewAccountErr}
            newAccountErr={newAccountErr}
            newAccount={newAccount}
            errAddress={errAddress}
            setErrAddress={setErrAddress}
            manual={manual}
            setManual={setManual}
            manualPrinc={manualPrinc}
            setManualPrinc={setManualPrinc}
            manualSub={manualSub}
            setManualSub={setManualSub}
          ></SendOutAccount>
        )
      ) : (
        <SendOwnAccount
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          selectedAsset={selectedAsset}
          receiver={receiver}
          setReciver={setReciver}
          contactToSend={contactToSend}
          assetDropOpen={assetDropOpen}
          setAssetDropOpen={setAssetDropOpen}
          showModal={showModal}
          amount={amount}
          setDrawerOpen={setDrawerOpen}
          setSendingStatus={setSendingStatus}
          setAmount={setAmount}
          setAmountBI={setAmountBI}
          setNewAccount={setNewAccount}
          setContactToSend={setContactToSend}
        ></SendOwnAccount>
      )} */}

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
