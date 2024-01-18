// import QRscanner from "@pages/components/QRscanner";
// import { GeneralHook } from "@pages/home/hooks/generalHook";
// import { SentHook } from "@pages/home/hooks/sentHooks";
// import SendOutAccount from "../../../drawer/SendOutAccount";
// import SendOwnAccount from "../../../drawer/SendOwnAccount";
import ReceiverType from "./ReceiverType";
import { useState } from "react";
import { ReceiverOption } from "@/@types/transactions";
import ReceiverOwner from "./ReceiverOwner";
import ReceiverThird from "./ReceiverThird";

interface ReceiverItemProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

export default function ReceiverItem(props: ReceiverItemProps) {
  const [receiverOption, setReceiverOption] = useState<ReceiverOption>(ReceiverOption.third);
  const [isManual, setIsManual] = useState<boolean>(false);
  // const { setDrawerOpen, drawerOpen } = props;
  // const { selectedAsset, selectedAccount: baseAccount } = GeneralHook();
  // const {
  //   receiver,
  //   setReciver,
  //   setNewAccount,
  //   amount,
  //   setAmount,
  //   amountBI,
  //   modal,
  //   sendingStatus,
  //   setAmountBI,
  //   showModal,
  //   qrView,
  //   setQRview,
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

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <ReceiverType isManual={isManual} setIsManual={setIsManual} />
      </div>
      <div className="p-4">
        {receiverOption === ReceiverOption.own && <ReceiverOwner />}
        {receiverOption === ReceiverOption.third && <ReceiverThird />}
      </div>
      <div className="flex p-4">
        {receiverOption === ReceiverOption.third && (
          <button onClick={onTransferToOwn}>
            <p className="text-md text-RadioCheckColor text-start">Transfer to own account</p>
          </button>
        )}
        {receiverOption === ReceiverOption.own && (
          <button onClick={onTransferToThird}>
            <p className="text-md text-RadioCheckColor text-start">Transfer to third</p>
          </button>
        )}
      </div>
    </div>
  );

  function onTransferToOwn() {
    setReceiverOption(ReceiverOption.own);
  }

  function onTransferToThird() {
    setReceiverOption(ReceiverOption.third);
  }

  // return (
  //   <>
  //     {!receiver.icrcAccount.owner ? (
  //       qrView ? (
  //         <QRscanner
  //           setQRview={setQRview}
  //           qrView={qrView}
  //           onSuccess={(value: string) => {
  //             setNewAccount(value);
  //             setQRview(false);
  //             navigator.clipboard.writeText(value);
  //           }}
  //         />
  //       ) : (
  //         <SendOutAccount
  //           selectedAccount={selectedAccount}
  //           setNewAccount={setNewAccount}
  //           setContactToSend={setContactToSend}
  //           selectedAsset={selectedAsset}
  //           setQRview={setQRview}
  //           setReciver={setReciver}
  //           // TODO: refactor in a hook
  //           showAccounts={showAccounts}
  //           setShowAccounts={setShowAccounts}
  //           setOpenContactList={setOpenContactList}
  //           setNewAccountErr={setNewAccountErr}
  //           newAccountErr={newAccountErr}
  //           newAccount={newAccount}
  //           errAddress={errAddress}
  //           setErrAddress={setErrAddress}
  //           manual={manual}
  //           setManual={setManual}
  //           manualPrinc={manualPrinc}
  //           setManualPrinc={setManualPrinc}
  //           manualSub={manualSub}
  //           setManualSub={setManualSub}
  //         ></SendOutAccount>
  //       )
  //     ) : (
  //       <SendOwnAccount
  //         selectedAccount={selectedAccount}
  //         setSelectedAccount={setSelectedAccount}
  //         selectedAsset={selectedAsset}
  //         receiver={receiver}
  //         setReciver={setReciver}
  //         contactToSend={contactToSend}
  //         assetDropOpen={assetDropOpen}
  //         setAssetDropOpen={setAssetDropOpen}
  //         showModal={showModal}
  //         amount={amount}
  //         setDrawerOpen={setDrawerOpen}
  //         setSendingStatus={setSendingStatus}
  //         setAmount={setAmount}
  //         setAmountBI={setAmountBI}
  //         setNewAccount={setNewAccount}
  //         setContactToSend={setContactToSend}
  //       ></SendOwnAccount>
  //     )}
  //   </>
  // );
}
