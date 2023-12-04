/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// svgs
import SearchIcon from "@assets/svg/files/icon-search.svg";
import QRIcon from "@assets/svg/files/qr.svg";
//
import { CustomButton } from "@components/Button";
import { CustomInput } from "@components/Input";
import { IcrcAccount, decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import { getICRC1Acc, shortAddress, subUint8ArrayToHex, getFirstNFrom, hexToUint8Array, checkHexString } from "@/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import SendUserIcon from "@assets/svg/files/send-user-icon.svg";
import { Contact, SubAccountContact } from "@redux/models/ContactsModels";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";

interface SendOutAccountProps {
  setOpenContactList(value: boolean): void;
  contacts: Contact[];
  selectedAccount: SubAccount | undefined;
  selectedAsset: Asset | undefined;
  setShowAccounts(value: boolean): void;
  showAccounts: boolean;
  setNewAccountErr(value: string): void;
  newAccountErr: string;
  setNewAccount(value: string): void;
  newAccount: string;
  setReciver(value: any): void;
  setContactToSend(value: any): void;
  setQRview(value: boolean): void;
  errAddress: boolean;
  setErrAddress(value: boolean): void;
  manual: boolean;
  setManual(value: boolean): void;
  manualPrinc: { princ: string; err: boolean };
  setManualPrinc(value: { princ: string; err: boolean }): void;
  manualSub: string;
  setManualSub(value: string): void;
}

interface ContactToSend {
  cName: string;
  sName: string;
  princ: string;
  subaccount_index: string;
}

interface ContactToSend {
  cName: string;
  sName: string;
  princ: string;
  subaccount_index: string;
}

const SendOutAccount = ({
  setOpenContactList,
  contacts,
  selectedAccount,
  selectedAsset,
  setShowAccounts,
  showAccounts,
  setNewAccountErr,
  newAccountErr,
  setNewAccount,
  newAccount,
  setReciver,
  setContactToSend,
  setQRview,
  errAddress,
  setErrAddress,
  manual,
  setManual,
  manualPrinc,
  setManualPrinc,
  manualSub,
  setManualSub,
}: SendOutAccountProps) => {
  const { t } = useTranslation();
  const [errAddress, setErrAddress] = useState(false);

  return (
    <div className="flex flex-col justify-start items-start w-full">
      <div className="flex flex-row justify-start items-center gap-2 mb-2">
        <p className="opacity-70 text-md text-PrimaryTextColorLight  dark:text-PrimaryTextColor">{"Manual"}</p>
        <div
          className={`flex flex-row w-9 h-4 rounded-full relative cursor-pointer items-center ${
            manual ? "bg-[#26A17B]" : "bg-[#7E7D91]"
          }`}
          onClick={onManualToggle}
        >
          <div
            className={`w-3 h-3 rounded-full bg-white transition-spacing duration-300 ${manual ? "ml-5" : "ml-1"}`}
          ></div>
        </div>
      </div>
      {manual ? (
        <div className="flex flex-col justify-start items-start w-full gap-2">
          <CustomInput
            intent={"secondary"}
            placeholder={"Principal"}
            compOutClass="mb-1"
            value={manualPrinc.princ}
            onChange={onChangePrincipal}
            sizeInput="small"
            border={manualPrinc.err ? "error" : "secondary"}
          />
          <CustomInput
            compOutClass="!w-[40%]"
            intent={"secondary"}
            placeholder={t("sub-acc")}
            value={manualSub}
            onChange={onChangeIdx}
            sizeInput="small"
            border={"secondary"}
            sufix={<p className="text-sm text-PrimaryTextColorLight  dark:text-PrimaryTextColor opacity-50">(Hex)</p>}
          />
        </div>
      ) : (
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
                  <DropdownMenu.Portal>
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
                              onSelecetContact(s);
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
          border={errAddress ? "error" : undefined}
          onChange={onChangeInput}
          onKeyUp={onKeyUp}
        />
      )}
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
                    onSetReceiver(sa);
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
  );

  function onManualToggle() {
    setManual(!manual);
    setNewAccount("");
    setErrAddress(false);
    setNewAccountErr("");
    setManualPrinc({
      err: false,
      princ: "",
    });
    setManualSub("");
  }

  function onChangePrincipal(e: ChangeEvent<HTMLInputElement>) {
    let errPrin = false;
    if (e.target.value.trim() !== "")
      try {
        Principal.fromText(e.target.value);
      } catch {
        errPrin = true;
      }
    setManualPrinc({
      err: errPrin,
      princ: e.target.value,
    });
  }
  function onChangeIdx(e: ChangeEvent<HTMLInputElement>) {
    if (checkHexString(e.target.value)) setManualSub(e.target.value.trim());
  }

  function onChangeInput(e: ChangeEvent<HTMLInputElement>) {
    setNewAccount(e.target.value);
    if (newAccountErr !== "") setNewAccountErr("");
    if (e.target.value.trim() !== "")
      try {
        decodeIcrcAccount(e.target.value);
        setErrAddress(false);
      } catch {
        setErrAddress(true);
      }
    else setErrAddress(false);
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSetReceiver();
    }
  }

  function onSetReceiver(sa: SubAccount) {
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
  }

  function onSelecetContact(s: ContactToSend) {
    setContactToSend({
      name: s.cName,
      subName: s.sName,
      subId: s.subaccount_index,
    });
    handleSetReceiver(getICRCAccount(s.princ, `0x${s.subaccount_index}`));
  }

  function contactsToShow() {
    let count = 0;
    contacts.map((c: Contact) => {
      const hasAsset = c.assets.find((asst) => asst.tokenSymbol === selectedAsset?.tokenSymbol);
      if (hasAsset) count++;
    });
    return count;
  }

  function getContactsToShow() {
    const subs: ContactToSend[] = [];
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
  }

  function getICRCAccount(principal: string, sub: string) {
    return getICRC1Acc({
      owner: Principal.fromText(principal),
      subaccount: hexToUint8Array(sub),
    } as IcrcAccount);
  }

  async function handleSetReceiver(contactAcc?: string) {
    if (manual && (manualPrinc.err || manualPrinc.princ.trim() === "")) return;
    try {
      let manualHex = "";
      let manulReciver = "";
      if (manual) {
        if (manualSub.toLowerCase().includes("0x")) {
          manualHex = manualSub.substring(2);
        } else manualHex = manualSub;
        manulReciver = encodeIcrcAccount({
          owner: Principal.fromText(manualPrinc.princ),
          subaccount: hexToUint8Array(`0x${manualHex}`),
        });
      }

      const myReceiver = decodeIcrcAccount(manual ? manulReciver : contactAcc ? contactAcc : newAccount);
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
  }
};

export default SendOutAccount;
