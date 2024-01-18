/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// import { GeneralHook } from "../../../hooks/generalHook";
// import { SentHook } from "../../../hooks/sentHooks";
// import QRscanner from "@pages/components/QRscanner";
// import DialogSendConfirmation from "./DialogSendConfirmation";
// import SendOwnAccount from "./SendOwnAccount";
// import SendOutAccount from "./SendOutAccount";
import SendForm from "../detail/transaction/SendForm";

interface DrawerSendProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

function DrawerSend(props: DrawerSendProps) {
  if (!props.drawerOpen) return <></>;
  return <SendForm />;
}

export default DrawerSend;

// const DrawerSend = ({ setDrawerOpen, drawerOpen }: DrawerSendProps) => {
//   const { selectedAsset, selectedAccount: baseAccount } = GeneralHook();
//   const {
//     receiver,
//     setReciver,
//     newAccount,
//     setNewAccount,
//     showAccounts,
//     setShowAccounts,
//     amount,
//     setAmount,
//     amountBI,
//     setAmountBI,
//     newAccountErr,
//     setNewAccountErr,
//     modal,
//     showModal,
//     qrView,
//     setQRview,
//     setOpenContactList,
//     sendingStatus,
//     setSendingStatus,
//     assetDropOpen,
//     setAssetDropOpen,
//     selectedAccount,
//     setSelectedAccount,
//     contacts,
//     contactToSend,
//     setContactToSend,
//     errAddress,
//     setErrAddress,
//     manual,
//     setManual,
//     manualPrinc,
//     setManualPrinc,
//     manualSub,
//     setManualSub,
//   } = SentHook(drawerOpen, baseAccount);

//   return (
//     <Fragment>
//       {!receiver.icrcAccount.owner ? (
//         qrView ? (
//           <QRscanner
//             setQRview={setQRview}
//             qrView={qrView}
//             onSuccess={(value: string) => {
//               setNewAccount(value);
//               setQRview(false);
//               navigator.clipboard.writeText(value);
//             }}
//           />
//         ) : (
//           <SendOutAccount
//             setOpenContactList={setOpenContactList}
//             contacts={contacts}
//             selectedAccount={selectedAccount}
//             selectedAsset={selectedAsset}
//             setShowAccounts={setShowAccounts}
//             showAccounts={showAccounts}
//             setNewAccountErr={setNewAccountErr}
//             newAccountErr={newAccountErr}
//             setNewAccount={setNewAccount}
//             newAccount={newAccount}
//             setReciver={setReciver}
//             setContactToSend={setContactToSend}
//             setQRview={setQRview}
//             errAddress={errAddress}
//             setErrAddress={setErrAddress}
//             manual={manual}
//             setManual={setManual}
//             manualPrinc={manualPrinc}
//             setManualPrinc={setManualPrinc}
//             manualSub={manualSub}
//             setManualSub={setManualSub}
//           ></SendOutAccount>
//         )
//       ) : (
//         <SendOwnAccount
//           selectedAccount={selectedAccount}
//           setSelectedAccount={setSelectedAccount}
//           selectedAsset={selectedAsset}
//           receiver={receiver}
//           setReciver={setReciver}
//           contactToSend={contactToSend}
//           assetDropOpen={assetDropOpen}
//           setAssetDropOpen={setAssetDropOpen}
//           showModal={showModal}
//           amount={amount}
//           setDrawerOpen={setDrawerOpen}
//           setSendingStatus={setSendingStatus}
//           setAmount={setAmount}
//           setAmountBI={setAmountBI}
//           setNewAccount={setNewAccount}
//           setContactToSend={setContactToSend}
//         ></SendOwnAccount>
//       )}
//       {modal && (
//         <DialogSendConfirmation
//           setDrawerOpen={setDrawerOpen}
//           showModal={showModal}
//           modal={modal}
//           receiver={receiver}
//           sendingStatus={sendingStatus}
//           amountBI={amountBI}
//           setAmountBI={setAmountBI}
//           selectedAccount={selectedAccount}
//           selectedAsset={selectedAsset}
//         ></DialogSendConfirmation>
//       )}
//     </Fragment>
//   );
// };
