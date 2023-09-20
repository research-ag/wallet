import { SendingStatusEnum, SendingStatus } from "@/const";
import { IcrcAccount } from "@dfinity/ledger";
import { useAppSelector } from "@redux/Store";
import { SubAccount } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";

export const SentHook = (drower: boolean, baseAccount: SubAccount | undefined) => {
  const { contacts } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    if (drower) {
      setReciver({
        name: "",
        color: "",
        strAccount: "",
        icrcAccount: {} as IcrcAccount,
      });
      setNewAccount("");
      setAmount("");
      setNewAccountErr("");
      setShowAccounts(false);
      setQRview(false);
      setContactToSend(undefined);
    }
  }, [drower]);

  useEffect(() => {
    setSelectedAccount(baseAccount);
  }, [baseAccount]);

  const [receiver, setReciver] = useState({
    name: "",
    color: "",
    strAccount: "",
    icrcAccount: {} as IcrcAccount,
  });
  const [modal, showModal] = useState(false);
  const [qrView, setQRview] = useState(false);
  const [openContactList, setOpenContactList] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>(SendingStatusEnum.Enum.none);
  const [showAccounts, setShowAccounts] = useState(false);
  const [newAccount, setNewAccount] = useState("");
  const [newAccountErr, setNewAccountErr] = useState("");
  const [amount, setAmount] = useState("");
  const [assetDropOpen, setAssetDropOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SubAccount | undefined>(baseAccount);
  const [contactToSend, setContactToSend] = useState<{ name: string; subName: string; subId: string } | undefined>();

  return {
    receiver,
    setReciver,
    newAccount,
    setNewAccount,
    showAccounts,
    setShowAccounts,
    amount,
    setAmount,
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
    contacts,
    contactToSend,
    setContactToSend,
  };
};
