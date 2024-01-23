// import QRscanner from "@pages/components/QRscanner";
// import { GeneralHook } from "@pages/home/hooks/generalHook";
// import { SentHook } from "@pages/home/hooks/sentHooks";
// import SendOutAccount from "../../../drawer/SendOutAccount";
// import SendOwnAccount from "../../../drawer/SendOwnAccount";
import ReceiverType from "./ReceiverType";
import { ReceiverOption } from "@/@types/transactions";
import ReceiverOwner from "./ReceiverOwner";
import ReceiverThird from "./ReceiverThird";
import { useAppSelector } from "@redux/Store";
import { clearReceiverAction, setReceiverOptionAction } from "@redux/transaction/TransactionActions";
import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
import { useTranslation } from "react-i18next";

export default function ReceiverItem() {
  const { receiver } = useAppSelector((state) => state.transaction);
  const { t } = useTranslation();
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
        <ReceiverType />
      </div>

      <div className="p-4">
        {receiver.receiverOption === ReceiverOption.own && <ReceiverOwner />}
        {receiver.receiverOption === ReceiverOption.third && <ReceiverThird />}
      </div>

      <div className="flex p-4">
        {receiver.receiverOption === ReceiverOption.third && (
          <button onClick={onReceiverOptionChange}>
            <p className="text-md text-RadioCheckColor text-start">Transfer to own account</p>
          </button>
        )}
        {receiver.receiverOption === ReceiverOption.own && (
          <button onClick={onReceiverOptionChange}>
            <p className="flex items-center justify-center text-md text-RadioCheckColor text-start">
              <DownAmountIcon className="relative mt-4 rotate-90 bottom-2 right-2" />
              {t("back")}
            </p>
          </button>
        )}
      </div>
    </div>
  );

  function onReceiverOptionChange() {
    if (receiver.receiverOption === ReceiverOption.third) setReceiverOptionAction(ReceiverOption.own);
    if (receiver.receiverOption === ReceiverOption.own) setReceiverOptionAction(ReceiverOption.third);
    clearReceiverAction();
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
