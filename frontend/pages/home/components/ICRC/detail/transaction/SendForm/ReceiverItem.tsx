import QRscanner from "@pages/components/QRscanner";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { SentHook } from "@pages/home/hooks/sentHooks";
import SendOutAccount from "../../../drawer/SendOutAccount";
import SendOwnAccount from "../../../drawer/SendOwnAccount";

interface SendToItemProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

export default function SendToItem(props: SendToItemProps) {
  const { setDrawerOpen, drawerOpen } = props;
  const { selectedAsset, selectedAccount: baseAccount } = GeneralHook();
  const {
    receiver,
    setReciver,
    setNewAccount,
    amount,
    setAmount,
    amountBI,
    modal,
    sendingStatus,
    setAmountBI,
    showModal,
    qrView,
    setQRview,
    assetDropOpen,
    setSelectedAccount,
    contactToSend,
    setContactToSend,
    selectedAccount,
    showAccounts,
    setOpenContactList,
    setManualSub,
    manualSub,
    setManualPrinc,
    manualPrinc,
    setManual,
    manual,
    setErrAddress,
    errAddress,
    setShowAccounts,
    setNewAccountErr,
    newAccount,
    setAssetDropOpen,
    setSendingStatus,
    newAccountErr,
  } = SentHook(drawerOpen, baseAccount);

  return (
    <>
      {!receiver.icrcAccount.owner ? (
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
      )}
    </>
  );
}
