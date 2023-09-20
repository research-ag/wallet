/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// svgs
import SearchIcon from "@assets/svg/files/icon-search.svg";
import QRIcon from "@assets/svg/files/qr.svg";
import SuccesIcon from "@assets/svg/files/success.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import ChevIcon from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as ExchangeIcon } from "@assets/svg/files/arrows-exchange-v.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { CustomInput } from "@components/Input";
import { clsx } from "clsx";
import { IdentityHook } from "@hooks/identityHook";
import { IcrcAccount, IcrcLedgerCanister, decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import {
  getFirstNFrom,
  getICRC1Acc,
  hexToUint8Array,
  roundToDecimalN,
  shortAddress,
  subUint8ArrayToHex,
  toFullDecimal,
} from "@/utils";
import { GeneralHook } from "../hooks/generalHook";
import Modal from "@components/Modal";
import { IconTypeEnum, SendingStatusEnum } from "@/const";
import { SentHook } from "../hooks/sentHooks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import QRscanner from "@pages/components/QRscanner";
import SendUserIcon from "@assets/svg/files/send-user-icon.svg";
import { Contact, SubAccountContact } from "@redux/models/ContactsModels";
import { AssetHook } from "../hooks/assetHook";
import { CustomCopy } from "@components/CopyTooltip";

interface DrawerSendProps {
  setDrawerOpen(value: boolean): void;
  drawerOpen: boolean;
}

const DrawerSend = ({ setDrawerOpen, drawerOpen }: DrawerSendProps) => {
  const { t } = useTranslation();
  const { userAgent } = IdentityHook();

  const { getAssetIcon, selectedAsset, selectedAccount: baseAccount } = GeneralHook();
  const {
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
    showModal,
    qrView,
    setQRview,
    setOpenContactList,
    sendingStatus,
    setSendingStatus,
    assetDropOpen,
    setAssetDropOpen,
    selectedAccount,
    setSelectedAccount,
    contacts,
    contactToSend,
    setContactToSend,
  } = SentHook(drawerOpen, baseAccount);
  const { reloadBallance } = AssetHook();

  const contactsToShow = () => {
    let count = 0;
    contacts.map((c: Contact) => {
      const hasAsset = c.assets.find((asst) => asst.tokenSymbol === selectedAsset?.tokenSymbol);
      if (hasAsset) count++;
    });
    return count;
  };
  const getContactsToShow = () => {
    const subs: { cName: string; sName: string; princ: string; subaccount_index: string }[] = [];
    contacts.map((c: Contact) => {
      const viewAsset = c.assets.find((asst) => asst.tokenSymbol === selectedAsset?.tokenSymbol);
      if (viewAsset) {
        if (viewAsset.subaccounts.length !== 0) {
          viewAsset.subaccounts.map((s: SubAccountContact) => {
            subs.push({ cName: c.name, sName: s.name, princ: c.principal, subaccount_index: s.subaccount_index });
          });
        } else subs.push({ cName: c.name, sName: "Sub-0", princ: c.principal, subaccount_index: "0" });
      }
    });
    return subs;
  };

  const getICRCAccount = (principal: string, sub: string) => {
    return getICRC1Acc({
      owner: Principal.fromText(principal),
      subaccount: hexToUint8Array(sub),
    } as IcrcAccount);
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case SendingStatusEnum.enum.sending:
        return t("sending");
      case SendingStatusEnum.enum.done:
        return t("sending.successful");
      case SendingStatusEnum.enum.error:
        return t("sending.failed");
      default:
        return "";
    }
  };

  const maxAmount = () => {
    const amount = roundToDecimalN(
      Number(selectedAccount?.amount || "0") - Number(selectedAccount?.transaction_fee || "0"),
      selectedAsset?.decimal || 8,
    );
    const over =
      Number(amount) > Number(selectedAccount?.amount || "0") - Number(selectedAccount?.transaction_fee || "");
    const valid = Number(selectedAccount?.amount || "0") >= Number(selectedAccount?.transaction_fee || "");
    return { amount, over, valid };
  };

  const handleSetReceiver = async (contactAcc?: string) => {
    try {
      const myReceiver = decodeIcrcAccount(contactAcc ? contactAcc : newAccount);
      const receiverSubHex = `0x${subUint8ArrayToHex(myReceiver.subaccount)}`;
      if (selectedAccount?.address === myReceiver.owner.toText() && receiverSubHex === selectedAccount.sub_account_id) {
        setNewAccountErr(t("sendes.as.receiver"));
      } else {
        let name = "";
        const cntct = contacts.find((c) => c.principal === myReceiver.owner.toText());
        if (cntct) {
          const viewAsset = cntct.assets.find((asst) => asst.tokenSymbol === selectedAsset?.tokenSymbol);
          if (viewAsset) {
            const viewIdx = viewAsset.subaccounts.find((sac) => sac.subaccount_index === receiverSubHex);
            if (viewIdx) {
              name = `${cntct.name}/${viewIdx.name}`;
            } else {
              name = cntct.name;
            }
          } else {
            name = cntct.name;
          }
        } else {
          selectedAsset?.subAccounts.map((sa) => {
            if (sa?.address === myReceiver.owner.toText() && receiverSubHex === sa.sub_account_id) {
              name = sa.name;
            }
          });
          name = name !== "" && name !== "-" ? name : selectedAsset?.symbol || "";
        }
        setReciver({
          icrcAccount: myReceiver,
          strAccount: encodeIcrcAccount(myReceiver),
          name: name,
          color: "#8A9CB7",
        });
      }
    } catch (e) {
      console.error(e);

      if (
        (e as Error)?.message.includes("does not have a valid checksum") ||
        (e as Error)?.message.includes("Invalid account") ||
        (e as Error)?.message.includes("Invalid character")
      ) {
        setNewAccountErr(t("no.valid.address"));
      } else {
        setNewAccountErr(t("no.valid.address.unknown"));
      }
      return;
    }
  };

  // Tailwind CSS constants
  const sendBox = clsx(
    "flex",
    "flex-row",
    "w-full",
    "justify-between",
    "items-start",
    "rounded",
    "border",
    "p-3",
    "mb-4",
  );
  const accountInfo = clsx("flex", "flex-col", "justify-start", "items-start", "w-full", "pl-2", "pr-2");

  return (
    <Fragment>
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
          <div className="flex flex-col justify-start items-start w-full">
            <CustomInput
              prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
              sufix={
                <div className="flex flex-row justify-center items-center mx-2 gap-2">
                  {contactsToShow() > 0 && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <img
                          src={SendUserIcon}
                          className="cursor-pointer"
                          alt="search-icon"
                          onClick={() => {
                            setOpenContactList(true);
                          }}
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal className="w-full">
                        <DropdownMenu.Content
                          className=" w-[22.6rem] max-h-[calc(100vh-15rem)] scroll-y-light bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-AccpetButtonColor cursor-pointer"
                          sideOffset={12}
                          align="end"
                        >
                          {getContactsToShow().map((s, k) => {
                            return (
                              <button
                                key={k}
                                className="flex flex-row justify-start items-center w-full hover:bg-[rgb(51,178,239,0.2)] px-2 py-3 gap-3 text-md"
                                onClick={() => {
                                  setContactToSend({
                                    name: s.cName,
                                    subName: s.sName,
                                    subId: s.subaccount_index,
                                  });
                                  handleSetReceiver(getICRCAccount(s.princ, `0x${s.subaccount_index}`));
                                }}
                              >
                                <div className="flex justify-center items-center !w-8 !h-8 !min-w-[2rem] rounded-md bg-ReceiverColor">
                                  <p className="font-semibold">{getFirstNFrom(s.sName, 1)}</p>
                                </div>
                                <div className="flex flex-col justify-start items-start w-full">
                                  <p className="text-left w-full max-w-[18rem] break-words">{`${s.cName} [${s.sName}]`}</p>
                                  <p className="text-SvgColor">{`${shortAddress(
                                    getICRCAccount(s.princ, `0x${s.subaccount_index}`),
                                    6,
                                    10,
                                  )}`}</p>
                                </div>
                              </button>
                            );
                          })}
                          <DropdownMenu.Arrow
                            className=" fill-AccpetButtonColor rounded-lg dark:fill-AccpetButtonColor"
                            width={10}
                            hanging={10}
                          />
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  )}

                  <img
                    src={QRIcon}
                    className="cursor-pointer"
                    alt="search-icon"
                    onClick={() => {
                      setQRview(true);
                    }}
                  />
                </div>
              }
              intent={"secondary"}
              placeholder={t("icrc.account")}
              compOutClass="mb-1"
              value={newAccount}
              onChange={(e) => {
                setNewAccount(e.target.value);
                if (newAccountErr !== "") setNewAccountErr("");
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSetReceiver();
                }
              }}
            />
            <p className="text-md text-LockColor text-left">{newAccountErr}</p>
            <div className="w-full flex flex-row justify-between items-center mt-2 mb-4">
              <CustomButton
                intent={"noBG"}
                className="!font-light !p-0 mt-3"
                onClick={() => {
                  setShowAccounts(true);
                }}
              >
                {showAccounts ? "" : (selectedAsset?.subAccounts.length || 1) > 1 ? t("transfer.between.accounts") : ""}
              </CustomButton>

              <CustomButton
                className="min-w-[5rem]"
                onClick={() => {
                  handleSetReceiver();
                }}
              >
                <p>{t("next")}</p>
              </CustomButton>
            </div>
            {showAccounts && (
              <div className="flex flex-col justify-start items-start w-full text-lg max-h-[calc(100vh-18rem)] scroll-y-light">
                {selectedAsset?.subAccounts.map((sa, k) => {
                  if (selectedAccount?.sub_account_id !== sa.sub_account_id)
                    return (
                      <button
                        className="flex flex-row justify-start items-center w-full border-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo"
                        key={k}
                        onClick={() => {
                          setReciver({
                            icrcAccount: {
                              owner: Principal.fromText(sa.address),
                              subaccount: hexToUint8Array(sa.sub_account_id),
                            },
                            strAccount: encodeIcrcAccount({
                              owner: Principal.fromText(sa.address),
                              subaccount: hexToUint8Array(sa.sub_account_id),
                            }),
                            name: sa.name,
                            color: "",
                          });
                        }}
                      >
                        <div
                          style={{ background: "#8A9CB7" }}
                          className="flex justify-center items-center w-8 min-w-[2rem] h-8 rounded-lg mr-4 text-PrimaryTextColor dark:text-PrimaryTextColorLight"
                        >
                          {k}
                        </div>
                        <div className="flex flex-col justify-start items-start text-PrimaryTextColorLight  dark:text-PrimaryTextColor">
                          <p className="text-left break-words max-w-[20rem]">
                            {sa.name === "-" ? `${selectedAsset?.symbol || ""}` : sa.name}
                            <span className="ml-2 opacity-70 text-sm">{`[${sa.sub_account_id || "0"}]`}</span>
                          </p>
                          <p className="opacity-30">{shortAddress(sa.address, 12, 10)}</p>
                        </div>
                      </button>
                    );
                })}
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex flex-col justify-start items-center w-full h-full text-lg text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <p className="w-full text-left opacity-60">{t("from")}</p>
          <DropdownMenu.Root
            onOpenChange={(e: boolean) => {
              setAssetDropOpen(e);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <div
                className={clsx(
                  sendBox,
                  "border-BorderColorLight dark:border-BorderColor",
                  "items-center",
                  "cursor-pointer",
                )}
              >
                {getAssetIcon(IconTypeEnum.Enum.ASSET, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
                <div className={clsx(accountInfo)}>
                  <p className="text-left break-words w-full max-w-[18rem]">{`${selectedAsset?.name || ""} - ${
                    selectedAccount?.name === "-"
                      ? `SubAc N°: ${selectedAccount.sub_account_id}`
                      : selectedAccount?.name
                  }`}</p>
                  <p className="opacity-60">{`${t("balance")}: ${toFullDecimal(
                    selectedAccount?.amount || 0,
                    selectedAccount?.decimal || 8,
                  )}`}</p>
                </div>
                <img
                  src={ChevIcon}
                  style={{ width: "3rem", height: "2rem" }}
                  alt="chevron-icon"
                  className={`${assetDropOpen ? "rotate-90" : ""}`}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal className="w-full">
              <DropdownMenu.Content
                className="w-full text-lg max-h-[calc(100vh-17rem)] scroll-y-light bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                sideOffset={5}
              >
                {selectedAsset?.subAccounts.map((sa, idx) => {
                  if (
                    `own-${sa.sub_account_id}` !== receiver.strAccount ||
                    sa.address != receiver.icrcAccount.owner.toText()
                  )
                    return (
                      <DropdownMenu.Item
                        key={`subAc-${idx}`}
                        className={`flex flex-row justify-start items-center w-[25rem] p-3 cursor-pointer ${
                          idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                        }`}
                        onSelect={() => {
                          setSelectedAccount(sa);
                        }}
                      >
                        {getAssetIcon(IconTypeEnum.Enum.ASSET, selectedAsset?.tokenSymbol, selectedAsset?.logo)}
                        <div className="flex flex-col justify-center items-start ml-3">
                          <p className="text-left break-words w-full max-w-[20rem]">
                            {sa.name === "-" ? `SubAc N°: ${sa.sub_account_id}` : sa.name}
                          </p>
                          <p className="opacity-60">{`${t("balance")}: ${toFullDecimal(
                            sa?.amount || 0,
                            sa?.decimal || 8,
                          )}`}</p>
                        </div>
                      </DropdownMenu.Item>
                    );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div className="flex justify-center items-center w-full"></div>
          <p className="w-full text-left opacity-60">{t("to")}</p>
          <div className={clsx(sendBox, "border-BorderSuccessColor")}>
            <img src={SuccesIcon} alt="success-icon" />
            <div className={clsx(accountInfo)}>
              <p className="text-left break-words w-full pr-1">
                {contactToSend
                  ? `${contactToSend.name} - ${contactToSend.subName}`
                  : receiver.name === "-"
                  ? selectedAsset?.symbol || ""
                  : receiver.name}
                <span className="opacity-70 ml-2 text-sm">
                  {`[${
                    contactToSend
                      ? `0x${contactToSend.subId}`
                      : `0x${subUint8ArrayToHex(receiver.icrcAccount.subaccount)}`
                  }]`}
                </span>
              </p>
              <p className="opacity-60">{`${shortAddress(receiver.strAccount, 12, 10)}`}</p>
            </div>
            <CloseIcon
              className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              onClick={() => {
                setContactToSend(undefined);
                setNewAccount("");
                setReciver({
                  name: "",
                  color: "",
                  strAccount: "",
                  icrcAccount: {} as IcrcAccount,
                });
                setAmount("");
              }}
            />
          </div>
          <p className="w-full text-left opacity-60">{t("amount")}</p>
          <div className={clsx(sendBox, "border-BorderColorLight dark:border-BorderColor", "items-center", "!mb-1")}>
            <div className={clsx(accountInfo)} lang="en-US">
              <CustomInput
                intent={"primary"}
                placeholder={`0 ${selectedAsset?.symbol} `}
                value={amount}
                border={"none"}
                type="number"
                lang="en-US"
                onChange={(e) => {
                  if (Number(e.target.value) >= 0) setAmount(e.target.value);
                }}
                formNoValidate
              />
            </div>
            <button
              className="flex justify-center items-center p-1 bg-RadioCheckColor rounded cursor-pointer"
              onClick={() => {
                maxAmount().valid &&
                  setAmount(toFullDecimal(maxAmount().amount.toString(), selectedAccount?.decimal || "8"));
              }}
            >
              <p className="text-sm text-PrimaryTextColor">{t("max")}</p>
            </button>
            <ExchangeIcon />
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            {!maxAmount().valid ? (
              <p className="w-full text-left text-LockColor text-md  mr-3">{t("no.enought.balance")}</p>
            ) : Number(amount) > maxAmount().amount && maxAmount().valid ? (
              <p className="w-full text-left text-LockColor text-md whitespace-nowrap">{`${t(
                "max.amount.to.send",
              )}: ${toFullDecimal(maxAmount().amount, selectedAccount?.decimal || 8)} ${
                selectedAsset?.symbol || ""
              }`}</p>
            ) : (
              <p></p>
            )}
            <div className="flex flex-row justify-end items-center gap-2 text-md whitespace-nowrap">
              <p className="opacity-60">{t("fee")}</p>
              <p>{`${toFullDecimal(selectedAccount?.transaction_fee || "", selectedAccount?.decimal || 8)} ${
                selectedAsset?.symbol || ""
              }`}</p>
            </div>
          </div>

          <div className="w-full flex flex-row justify-end items-center mt-12">
            <CustomButton
              intent="deny"
              className="mr-3 min-w-[5rem]"
              onClick={() => {
                setContactToSend(undefined);
                setDrawerOpen(false);
              }}
            >
              <p>{t("cancel")}</p>
            </CustomButton>
            <CustomButton
              className="min-w-[5rem]"
              onClick={async () => {
                if (Number(amount) >= 0 && maxAmount().valid) {
                  if (Number(amount) > maxAmount().amount && maxAmount().valid) {
                    setSendingStatus(SendingStatusEnum.enum.error);
                    showModal(true);
                  } else {
                    let errorFound = false;
                    setSendingStatus(SendingStatusEnum.enum.sending);
                    showModal(true);
                    const { transfer } = IcrcLedgerCanister.create({
                      agent: userAgent,
                      canisterId: selectedAsset?.address as any,
                    });
                    try {
                      await transfer({
                        to: {
                          owner: receiver.icrcAccount.owner,
                          subaccount: receiver.icrcAccount.subaccount ? [receiver.icrcAccount.subaccount] : [],
                        },
                        amount: BigInt(
                          Math.floor(Math.round(Number(amount) * Math.pow(10, Number(selectedAsset?.decimal)))),
                        ),
                        from_subaccount: hexToUint8Array(selectedAccount?.sub_account_id || "0"),
                      });
                    } catch (e) {
                      console.error(e);
                      errorFound = true;
                      setSendingStatus(SendingStatusEnum.enum.error);
                    } finally {
                      if (!errorFound) {
                        setDrawerOpen(false);
                        setSendingStatus(SendingStatusEnum.enum.done);
                        reloadBallance();
                      }
                    }
                  }
                }
              }}
            >
              <p>{t("next")}</p>
            </CustomButton>
          </div>
        </div>
      )}
      {modal && (
        <Modal
          open={modal}
          width="w-[22rem]"
          padding="py-3 px-1"
          border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        >
          <div className="reative flex flex-col justify-start items-center w-full">
            <CloseIcon
              className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              onClick={() => {
                setDrawerOpen(false);
                showModal(false);
              }}
            />
            <div className="flex flex-col justify-start items-center w-full py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
              <div className="flex justify-center items-center p-2 rounded-md border border-BorderColorTwoLight dark:border-BorderColorTwo">
                <img src={UpAmountIcon} alt="send-icon" />
              </div>
              <p className="text-lg font-semibold mt-3">{getStatusMessage(sendingStatus)}</p>
            </div>
            <div className="flex flex-row justify-start items-start w-full pl-8 font-light opacity-50 text-md gap-4 py-4">
              <div className="flex flex-col justify-start items-start gap-2">
                <p>{`${t("principal")}:`}</p>
                <p>{`${t("acc.subacc")}:`}</p>
                <p>{`${t("amount")}:`}</p>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="flex flex-row justify-start items-center gap-2">
                  <p>{shortAddress(receiver.icrcAccount.owner.toText(), 12, 10)}</p>
                  <CustomCopy size={"small"} copyText={receiver.icrcAccount.owner.toText()} />
                </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <p>{`0x${subUint8ArrayToHex(receiver.icrcAccount.subaccount)}`}</p>
                  <CustomCopy size={"small"} copyText={subUint8ArrayToHex(receiver.icrcAccount.subaccount)} />
                </div>
                <p>{`${toFullDecimal(amount, selectedAccount?.decimal || 0)} ${selectedAsset?.symbol || ""}`}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default DrawerSend;
