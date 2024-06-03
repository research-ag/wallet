import { CustomInput } from "@components/input";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-empty.svg";
import { useTranslation } from "react-i18next";
import { checkHexString } from "@common/utils/hexadecimal";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { Contact, ContactAccount } from "@/@types/contacts";
import AllowanceTooltip from "../AllowanceTooltip";
import logger from "@common/utils/logger";
import { useContactError } from "@pages/contacts/contexts/ContactErrorProvider";
import { useContact } from "@pages/contacts/contexts/ContactProvider";

interface AddSubAccountOnCreateProps {
  contactAssetSelected: string;
}

export default function AddSubAccountOnCreate({ contactAssetSelected }: AddSubAccountOnCreateProps) {
  const { newContact, setNewContact } = useContact();
  const { t } = useTranslation();
  const { subAccountError, setSubAccountError } = useContactError();

  return (
    <div className="flex flex-col items-start justify-start w-full h-full gap-4 p-3 bg-SecondaryColorLight dark:bg-SecondaryColor">
      <p className="text-md">{`${t("sub-acc")} (${newContact.accounts.length})`}</p>
      <div className="flex flex-row justify-start items-start w-full gap-2 max-h-[15rem] scroll-y-light">
        <div className="flex flex-col items-start justify-start w-full gap-2">
          <p className="ml-7 opacity-60">{t("name.sub.account")}</p>
          {newContact.accounts.map((newSA, iterator) => {
            if (newSA.tokenSymbol !== contactAssetSelected) return null;

            const hasCurrentError = subAccountError?.index === iterator && subAccountError?.name;

            return (
              <div key={iterator} className="relative flex items-center justify-between w-full">
                {newSA.allowance ? (
                  <AllowanceTooltip
                    amount={newSA?.allowance?.amount}
                    expiration={newSA?.allowance.expiration}
                    tokenSymbol={contactAssetSelected}
                  />
                ) : (
                  <div className="w-8 h-4"></div>
                )}

                <CustomInput
                  sizeInput={"small"}
                  sizeComp={"small"}
                  intent={"primary"}
                  border={hasCurrentError ? "error" : undefined}
                  placeholder={t("name")}
                  value={newSA.name}
                  onChange={(e) => {
                    onChangeSubName(e.target.value, iterator);
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-start items-start w-[80%] gap-2">
          <p className="opacity-60">{t("sub-acc")}</p>
          {newContact.accounts.map((newSA, iterator) => {
            if (newSA.tokenSymbol !== contactAssetSelected) return null;

            const hasCurrentError = subAccountError?.index === iterator && subAccountError?.subAccountId;

            return (
              <div key={iterator} className="flex flex-row items-center justify-start w-full gap-2">
                <CustomInput
                  sizeInput={"small"}
                  sizeComp={"small"}
                  intent={"primary"}
                  border={hasCurrentError ? "error" : undefined}
                  placeholder={"Hex"}
                  value={newSA.subaccountId}
                  onChange={(e) => {
                    onchangeSubIdx(e.target.value, iterator);
                  }}
                  onKeyDown={(e) => {
                    onKeyPressSubIdx(e, newSA);
                  }}
                />
                <TrashIcon
                  onClick={() => {
                    onDeleteSubAccount(iterator);
                  }}
                  className="w-5 h-5 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  function onChangeSubName(value: string, k: number) {
    setNewContact((prev: Contact) => {
      const newSubAccount: ContactAccount = {
        ...prev.accounts[k],
        name: value,
      };

      return {
        ...prev,
        accounts: prev.accounts.map((sa, index) => {
          return index === k ? newSubAccount : sa;
        }),
      };
    });
  }

  function onchangeSubIdx(value: string, iterator: number) {
    if (checkHexString(value)) {
      const duplicatedIdByAsset =
        newContact.accounts.filter((sa) => {
          return sa.subaccountId === value && sa.tokenSymbol === contactAssetSelected;
        }).length >= 1;

      setNewContact((prev: Contact) => {
        const newSubAccount: ContactAccount = {
          ...prev.accounts[iterator],
          subaccountId: value,
          subaccount: value.includes("0x") ? value.trim() : `0x${value.trim()}`,
        };

        return {
          ...prev,
          accounts: prev.accounts.map((sa, index) => {
            return index === iterator ? newSubAccount : sa;
          }),
        };
      });

      if (duplicatedIdByAsset) {
        setSubAccountError({
          name: false,
          subAccountId: true,
          tokenSymbol: false,
          index: iterator,
        });
      } else {
        setSubAccountError(null);
      }
    } else {
      setSubAccountError({
        name: false,
        subAccountId: true,
        tokenSymbol: false,
        index: iterator,
      });
    }
  }

  function onKeyPressSubIdx(e: React.KeyboardEvent<HTMLInputElement>, newSA: ContactAccount) {
    if (!asciiHex.includes(e.key)) {
      e.preventDefault();
    }

    if (newSA.subaccountId.includes("0x") || newSA.subaccountId.includes("0X")) {
      if (e.key === "X" || e.key == "x") {
        e.preventDefault();
      }
    }
  }

  function onDeleteSubAccount(k: number) {
    setNewContact((prev: Contact) => {
      const accounts = prev.accounts.filter((sa, index) => {
        logger.debug(sa);
        return index !== k;
      });
      return { ...prev, accounts };
    });
  }
}
