import { SendingStatusEnum, SendingStatus } from "@/const";
import { IcrcAccount } from "@dfinity/ledger";
import { SubAccount } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";

export const SentHook = (drawer: boolean, baseAccount: SubAccount | undefined) => {
  const [receiver, setReciver] = useState({
    name: "",
    color: "",
    strAccount: "",
    icrcAccount: {} as IcrcAccount,
  });

  const [newAccount, setNewAccount] = useState("");
  const [qrView, setQRview] = useState(false);
  const [contactToSend, setContactToSend] = useState<{ name: string; subName: string; subId: string } | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<SubAccount | undefined>(baseAccount);

  const [manual, setManual] = useState(false);
  const [manualPrinc, setManualPrinc] = useState({ princ: "", err: false });
  const [manualSub, setManualSub] = useState("");
  const [errAddress, setErrAddress] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [newAccountErr, setNewAccountErr] = useState("");
  const [amount, setAmount] = useState("");
  const [openContactList, setOpenContactList] = useState(false);

  const [modal, showModal] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>(SendingStatusEnum.Enum.none);
  const [amountBI, setAmountBI] = useState(BigInt(0));
  const [assetDropOpen, setAssetDropOpen] = useState(false);

  useEffect(() => {
    if (drawer) {
      setReciver({
        name: "",
        color: "",
        strAccount: "",
        icrcAccount: {} as IcrcAccount,
      });
      setAmount("");
      setNewAccountErr("");
      setShowAccounts(false);
      setErrAddress(false);
      setManual(false);
      setManualPrinc({ princ: "", err: false });
      setManualSub("");

      setNewAccount("");
      setQRview(false);
      setContactToSend(undefined);
    }
  }, [drawer]);

  useEffect(() => {
    setSelectedAccount(baseAccount);
  }, [baseAccount]);

  return {
    receiver,
    setReciver,
    newAccount,
    setNewAccount,
    showAccounts,
    setShowAccounts,
    amount,
    setAmount,
    amountBI,
    setAmountBI,
    newAccountErr,
    setNewAccountErr,
    modal,
    qrView,
    setQRview,
    openContactList,
    setOpenContactList,
    showModal,
    sendingStatus,
    setSendingStatus,
    assetDropOpen,
    setAssetDropOpen,
    selectedAccount,
    setSelectedAccount,
    contactToSend,
    setContactToSend,
    errAddress,
    setErrAddress,
    manual,
    setManual,
    manualPrinc,
    setManualPrinc,
    manualSub,
    setManualSub,
  };
};
