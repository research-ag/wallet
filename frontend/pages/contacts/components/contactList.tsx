// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useContacts } from "../hooks/contactsHook";
import { useTranslation } from "react-i18next";
import {
  checkHexString,
  getInitialFromName,
  hexToNumber,
  hexToUint8Array,
  removeLeadingZeros,
  shortAddress,
} from "@/utils";
import { CustomCopy } from "@components/CopyTooltip";
import { CustomInput } from "@components/Input";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import ContactAssetPop from "./contactAssetPop";
import { DeleteContactTypeEnum, IconTypeEnum } from "@/const";
import { encodeIcrcAccount } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import { AccountIdentifier } from "@dfinity/nns";
import bigInt from "big-integer";
import { clsx } from "clsx";
import RemoveModal from "./removeModal";

interface ContactListProps {
  searchKey: string;
  assetFilter: string[];
}

const ContactList = ({ searchKey, assetFilter }: ContactListProps) => {
  const { t } = useTranslation();
  const {
    contacts,
    selCntcPrinAddAsst,
    setSelCntcPrinAddAsst,
    selContactPrin,
    setSelContactPrin,
    contactEdited,
    setContactEdited,
    openAssetsPrin,
    setOpenAssetsPrin,
    updateContact,
    openSubaccToken,
    setOpenSubaccToken,
    selSubaccIdx,
    setSelSubaccIdx,
    subaccEdited,
    setSubaccEdited,
    addAsset,
    deleteModal,
    setDeleteModal,
    deleteType,
    setDeleteType,
    deleteObject,
    setDeleteObject,
    editCntctSubacc,
    addCntctSubacc,
    checkPrincipalValid,
    contactEditedErr,
    setContactEditedErr,
    subaccEditedErr,
    setSubaccEditedErr,
    checkSubIndxValid,
    addSub,
    setAddSub,
  } = useContacts();
  const { assets, getAssetIcon, asciiHex } = GeneralHook();

  const getContactColor = (idx: number) => {
    if (idx % 3 === 0) return "bg-ContactColor1";
    else if (idx % 3 === 1) return "bg-ContactColor2";
    else return "bg-ContactColor3";
  };

  const changeSubIdx = (e: string) => {
    if (checkHexString(e)) {
      setSubaccEdited((prev) => {
        return { ...prev, subaccount_index: e.trim() };
      });
      setSubaccEditedErr((prev) => {
        return {
          name: prev.name,
          subaccount_index: false,
        };
      });
    }
  };
  const changeName = (e: string) => {
    setSubaccEdited((prev) => {
      return { ...prev, name: e };
    });
    setSubaccEditedErr((prev) => {
      return {
        name: false,
        subaccount_index: prev.subaccount_index,
      };
    });
  };

  const getSubAcc = (princ: string) => {
    return encodeIcrcAccount({
      owner: Principal.fromText(princ || ""),
      subaccount: hexToUint8Array(`0x${subaccEdited.subaccount_index}` || "0"),
    });
  };

  const getDeleteMsg = () => {
    let msg1 = "";
    let msg2 = "";

    switch (deleteType) {
      case DeleteContactTypeEnum.Enum.CONTACT:
        msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
        msg2 = deleteObject.name;
        break;
      case DeleteContactTypeEnum.Enum.ASSET:
        msg1 = t("delete.contact.asset.msg", { symbol: deleteObject.symbol });
        msg2 = deleteObject.symbol;
        break;
      case DeleteContactTypeEnum.Enum.SUB:
        msg1 = t("delete.contact.sub.msg", { name: deleteObject.subaccName });
        msg2 = deleteObject.subaccName;
        break;
      default:
        msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
        msg2 = deleteObject.name;
        break;
        break;
    }
    return { msg1: msg1, msg2: msg2 };
  };

  const dotH = (asst: AssetContact) => {
    let height = "0";
    if (asst.tokenSymbol === openSubaccToken && (asst.subaccounts.length > 0 || addSub))
      height = (5.7 + asst.subaccounts.length * 3.55 + (addSub ? 3.55 : 0)).toString();
    else height = "3.25";
    return `${height}rem`;
  };

  const checkSubAcc = (edit: boolean, cntc: Contact, asst: AssetContact, sa?: SubAccountContact) => {
    let subacc = subaccEdited.subaccount_index.trim();
    if (subacc.slice(0, 2).toLowerCase() === "0x") subacc = subacc.substring(2);

    const checkedIdx = removeLeadingZeros(subacc) === "" ? "0" : removeLeadingZeros(subacc);
    const checkedIdxValid = checkSubIndxValid(checkedIdx, asst.subaccounts);

    let eqHexValid = false;
    let eqHex = false;
    if (edit) {
      eqHex = (hexToNumber(`0x${subacc}`) || bigInt()).eq(hexToNumber(`0x${sa?.subaccount_index}`) || bigInt());
      if (!eqHex) {
        eqHexValid = !checkedIdxValid;
      }
    } else {
      eqHexValid = !checkedIdxValid;
    }

    setSubaccEditedErr({
      name: subaccEdited.name.trim() === "",
      subaccount_index: subacc === "" || eqHexValid,
    });

    if (edit) {
      if (subacc !== "" && subaccEdited.name.trim() !== "" && (eqHex || checkedIdxValid)) {
        editCntctSubacc(cntc.principal, asst.tokenSymbol, sa?.subaccount_index || "0", subaccEdited.name, checkedIdx);
        setSelSubaccIdx("");
      }
    } else {
      if (subacc !== "" && subaccEdited.name.trim() !== "" && checkedIdxValid) {
        addCntctSubacc(
          cntc.principal,
          asst.tokenSymbol,
          subaccEdited.name,
          removeLeadingZeros(subacc) === "" ? "0" : removeLeadingZeros(subacc),
        );
        setSelSubaccIdx("");
        setAddSub(false);
      }
    }
  };

  const getContactsToShow = () => {
    return contacts.filter((cntc) => {
      if (assetFilter.length === 0) {
        let incSubName = false;
        for (let i = 0; i < cntc.assets.length; i++) {
          const ast = cntc.assets[i];
          for (let j = 0; j < ast.subaccounts.length; j++) {
            const sa = ast.subaccounts[j];
            if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) {
              incSubName = true;
              break;
            }
          }
        }
        return (
          cntc.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          incSubName ||
          cntc.principal.toLowerCase().includes(searchKey.toLowerCase())
        );
      } else {
        const astFilValid = assetFilter.some((astFil) => {
          return cntc.assets.find((ast) => ast.tokenSymbol === astFil);
        });
        let incSubName = false;
        for (let i = 0; i < cntc.assets.length; i++) {
          const ast = cntc.assets[i];
          for (let j = 0; j < ast.subaccounts.length; j++) {
            const sa = ast.subaccounts[j];
            if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) {
              incSubName = true;
              break;
            }
          }
        }
        return (
          (cntc.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            incSubName ||
            cntc.principal.toLowerCase().includes(searchKey.toLowerCase())) &&
          astFilValid
        );
      }
    });
  };

  // Tailwind CSS
  const contactStyle = (cntc: Contact) =>
    clsx({
      ["border-b border-BorderColorTwoLight dark:border-BorderColorTwo"]: true,
      ["bg-SelectRowColor/10"]: cntc.principal === selContactPrin || cntc.principal === selCntcPrinAddAsst,
      ["bg-SecondaryColorLight dark:bg-SecondaryColor"]:
        cntc.principal === openAssetsPrin && cntc.principal !== selContactPrin && cntc.principal !== selCntcPrinAddAsst,
    });

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full mt-3 scroll-y-light max-h-[calc(100vh-12rem)]">
        <table className="w-full  text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
          <thead className="border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 sticky top-0 z-[1]">
            <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              <th className="p-2 text-left w-[30%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
                <p>{t("name")}</p>
              </th>
              <th className="p-2 text-left w-[40%] bg-PrimaryColorLight dark:bg-PrimaryColor">
                <p>{"Principal"}</p>
              </th>
              <th className="p-2 w-[15%] bg-PrimaryColorLight dark:bg-PrimaryColor">
                <p>{t("assets")}</p>
              </th>
              <th className="p-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor">
                <p>{t("action")}</p>
              </th>
              <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
            </tr>
          </thead>
          <tbody>
            {getContactsToShow().map((cntc, k) => (
              <Fragment key={k}>
                <tr className={contactStyle(cntc)}>
                  <td className="">
                    <div className="relative flex flex-row justify-start items-center w-full min-h-14 gap-2 px-4">
                      {(cntc.principal === selContactPrin ||
                        cntc.principal === openAssetsPrin ||
                        cntc.principal === selCntcPrinAddAsst) && (
                        <div className="absolute left-0 w-1 h-14 bg-SelectRowColor"></div>
                      )}
                      {cntc.principal === selContactPrin ? (
                        <CustomInput
                          intent={"primary"}
                          border={contactEditedErr.name ? "error" : "selected"}
                          sizeComp={"xLarge"}
                          sizeInput="small"
                          value={contactEdited.name}
                          onChange={(e) => {
                            setContactEdited((prev) => {
                              return { ...prev, name: e.target.value };
                            });
                            setContactEditedErr((prev) => {
                              return { name: false, principal: prev.principal };
                            });
                          }}
                        />
                      ) : (
                        <div className="flex flex-row justify-start items-center w-full gap-2">
                          <div
                            className={`flex justify-center items-center !min-w-[2rem] w-8 h-8 rounded-md ${getContactColor(
                              k,
                            )}`}
                          >
                            <p className="text-PrimaryTextColor">{getInitialFromName(cntc.name, 2)}</p>
                          </div>
                          <p className="text-left opacity-70 break-words w-full max-w-[14rem]">{cntc.name}</p>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row justify-start items-center gap-2 opacity-70 px-2">
                      <p>{shortAddress(cntc.principal, 12, 9)}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={cntc.principal} />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row justify-center items-center w-full">
                      <div
                        className={
                          "flex flex-row justify-between items-center w-28 h-8 rounded bg-black/10 dark:bg-white/10"
                        }
                      >
                        <p className="ml-2">{`${cntc.assets.length} ${t("assets")}`}</p>
                        <ContactAssetPop
                          compClass="flex flex-row justify-center items-center"
                          btnClass="!w-8 !h-8 bg-AddSecondaryButton rounded-l-none"
                          assets={assets.filter((ast) => {
                            let isIncluded = false;
                            cntc.assets.map((contAst) => {
                              if (ast.tokenSymbol === contAst.tokenSymbol) isIncluded = true;
                            });
                            return !isIncluded;
                          })}
                          getAssetIcon={getAssetIcon}
                          onAdd={(data) => {
                            const auxAsst: AssetContact[] = data.map((dt) => {
                              return {
                                symbol: dt.symbol,
                                tokenSymbol: dt.tokenSymbol,
                                logo: dt.logo,
                                subaccounts: [],
                              };
                            });
                            addAsset(auxAsst, cntc.principal);
                          }}
                          onOpen={() => {
                            setSelCntcPrinAddAsst(cntc.principal);
                            setAddSub(false);
                            setSelSubaccIdx("");
                            setSelContactPrin("");
                          }}
                          onClose={() => {
                            setSelCntcPrinAddAsst("");
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row justify-center items-start gap-4 w-full">
                      {cntc.principal === selContactPrin ? (
                        <CheckIcon
                          onClick={() => {
                            setContactEditedErr({
                              name: contactEdited.name.trim() === "",
                              principal:
                                contactEdited.principal !== cntc.principal &&
                                !checkPrincipalValid(contactEdited.principal),
                            });

                            if (
                              contactEdited.name.trim() !== "" &&
                              (checkPrincipalValid(contactEdited.principal) ||
                                contactEdited.principal === cntc.principal)
                            ) {
                              updateContact(
                                {
                                  ...contactEdited,
                                  assets: cntc.assets,
                                  accountIdentier: AccountIdentifier.fromPrincipal({
                                    principal: Principal.fromText(contactEdited.principal),
                                  }).toHex(),
                                },
                                cntc.principal,
                              );
                              setSelContactPrin("");
                            }
                          }}
                          className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                        />
                      ) : (
                        <PencilIcon
                          onClick={() => {
                            setAddSub(false);
                            setSelSubaccIdx("");
                            setSelContactPrin(cntc.principal);
                            setContactEdited(cntc);
                            if (cntc.principal !== openAssetsPrin) {
                              setOpenAssetsPrin("");
                            }
                            setContactEditedErr({ name: false, principal: false });
                          }}
                          className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor opacity-50 cursor-pointer"
                        />
                      )}
                      {cntc.principal === selContactPrin ? (
                        <CloseIcon
                          onClick={() => {
                            setSelContactPrin("");
                            setSubaccEditedErr({ name: false, subaccount_index: false });
                          }}
                          className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                        />
                      ) : (
                        <TrashIcon
                          onClick={() => {
                            setAddSub(false);
                            setSelContactPrin("");
                            setSelSubaccIdx("");
                            setDeleteType(DeleteContactTypeEnum.Enum.CONTACT);
                            let ttlSub = 0;
                            cntc.assets.map((asst) => {
                              ttlSub = ttlSub + asst.subaccounts.length;
                            });
                            setDeleteObject({
                              principal: cntc.principal,
                              name: cntc.name,
                              tokenSymbol: "",
                              symbol: "",
                              subaccIdx: "",
                              subaccName: "",
                              totalAssets: cntc.assets.length,
                              TotalSub: ttlSub,
                            });
                            setDeleteModal(true);
                          }}
                          className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-row justify-center items-start gap-2 w-full">
                      <ChevIcon
                        onClick={() => {
                          if (cntc.principal === openAssetsPrin) setOpenAssetsPrin("");
                          else {
                            if (cntc.assets.length > 0) {
                              setContactEdited(cntc);
                              setOpenAssetsPrin(cntc.principal);
                            }
                          }
                          if (cntc.principal !== selContactPrin) setSelContactPrin("");
                          setOpenSubaccToken("");
                          setSelSubaccIdx("");
                          setAddSub(false);
                        }}
                        className={`w-8 h-8 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor stroke-0  cursor-pointer ${
                          cntc.principal === openAssetsPrin ? "" : "rotate-90"
                        }`}
                      />
                    </div>
                  </td>
                </tr>
                {cntc.principal === openAssetsPrin && (
                  <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
                    <td colSpan={5} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
                      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
                        {cntc.assets.length > 0 && (
                          <thead className="text-PrimaryTextColor/70">
                            <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                              <th className="p-2 text-left w-[5.25%]"></th>
                              <th className="p-2 text-left w-[65%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                <p>{t("asset")}</p>
                              </th>
                              <th className="p-2 w-[15%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                <p>{t("sub-acc")}</p>
                              </th>
                              <th className="p-2 w-[11.75%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo"></th>
                              <th className="w-[3%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo"></th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {cntc.assets.map((asst, j) => {
                            return (
                              <Fragment key={j}>
                                <tr>
                                  <td className="h-full">
                                    <div className="relative flex flex-col justify-center items-center w-full h-full">
                                      <div className="w-1 h-1 bg-SelectRowColor"></div>
                                      {j !== cntc.assets.length - 1 && (
                                        <div
                                          style={{ height: dotH(asst) }}
                                          className="absolute top-0 w-1 ml-[-0.75px] left-1/2 border-l border-dotted border-SelectRowColor"
                                        ></div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                    <div className="flex flex-row justify-start items-center w-full px-2 gap-4">
                                      {getAssetIcon(IconTypeEnum.Enum.ASSET, asst.tokenSymbol, asst.logo)}
                                      <p>{asst.symbol}</p>
                                    </div>
                                  </td>
                                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                    <div className="flex flex-row justify-center items-center w-full">
                                      <div className="flex flex-row justify-between items-center w-28 h-8 rounded bg-black/10 dark:bg-white/10">
                                        <p className="ml-2">{`${asst.subaccounts.length} Subs`}</p>
                                        <button
                                          onClick={() => {
                                            setAddSub(true);
                                            setSelContactPrin("");
                                            if (!addSub) {
                                              setSubaccEdited({
                                                name: "",
                                                subaccount_index: "",
                                              });
                                              setSelSubaccIdx("");
                                              setSubaccEditedErr({
                                                name: false,
                                                subaccount_index: false,
                                              });
                                            }

                                            changeName("");
                                            changeSubIdx("");
                                            if (openSubaccToken !== asst.tokenSymbol)
                                              setOpenSubaccToken(asst.tokenSymbol);
                                          }}
                                          className="flex bg-AddSecondaryButton w-8 h-8 justify-center items-center rounded-r p-0"
                                        >
                                          <img src={PlusIcon} alt="plus-icon" className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                    <div className="flex flex-row justify-center items-start gap-4 w-full">
                                      <PencilIcon className="w-4 h-4 invisible" />
                                      <TrashIcon
                                        onClick={() => {
                                          setAddSub(false);
                                          setSelContactPrin("");
                                          setSelSubaccIdx("");
                                          setDeleteObject({
                                            principal: cntc.principal,
                                            name: cntc.name,
                                            tokenSymbol: asst.tokenSymbol,
                                            symbol: asst.symbol,
                                            subaccIdx: "",
                                            subaccName: "",
                                            totalAssets: 0,
                                            TotalSub: asst.subaccounts.length,
                                          });
                                          setDeleteModal(true);
                                          setDeleteType(DeleteContactTypeEnum.Enum.ASSET);
                                        }}
                                        className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo">
                                    <div className="flex flex-row justify-center items-start gap-2 w-full">
                                      {asst.subaccounts.length > 0 && (
                                        <ChevIcon
                                          onClick={() => {
                                            setAddSub(false);
                                            setSelSubaccIdx("");
                                            if (openSubaccToken === asst.tokenSymbol) setOpenSubaccToken("");
                                            else setOpenSubaccToken(asst.tokenSymbol);
                                          }}
                                          className={`w-8 h-8 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor stroke-0  cursor-pointer ${
                                            asst.tokenSymbol === openSubaccToken ? "" : "rotate-90"
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  {asst.tokenSymbol === openSubaccToken && (asst.subaccounts.length > 0 || addSub) && (
                                    <td
                                      colSpan={5}
                                      className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo"
                                    >
                                      <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
                                        {(asst.subaccounts.length > 0 || addSub) && (
                                          <thead className="text-PrimaryTextColor/70">
                                            <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                                              <th className="p-2 text-left w-[4.5%] "></th>
                                              <th className="p-2 text-left w-[5%] "></th>
                                              <th className="p-2 text-left w-[35%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
                                                <p>{t("name")}</p>
                                              </th>
                                              <th className="p-2 w-[10%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
                                                <p>{t("sub-acc")}</p>
                                              </th>
                                              <th className="p-2 w-[30%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
                                                <p>{t("account.indentifier")}</p>
                                              </th>
                                              <th className="p-2 w-[12.5%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
                                              <th className="w-[3%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
                                            </tr>
                                          </thead>
                                        )}
                                        <tbody>
                                          {asst.subaccounts.map((sa, l) => {
                                            const encodedAcc = encodeIcrcAccount({
                                              owner: Principal.fromText(cntc.principal || ""),
                                              subaccount: hexToUint8Array(`0x${sa.subaccount_index}`),
                                            });
                                            return (
                                              <tr key={l}>
                                                <td></td>
                                                <td className="h-full">
                                                  <div className="relative flex flex-col justify-center items-center w-full h-full">
                                                    <div className="w-1 h-1 bg-SelectRowColor"></div>
                                                    {l !== 0 && (
                                                      <div className="absolute bottom-0 w-1 ml-[-1px] left-1/2 border-l h-14 border-dotted border-SelectRowColor"></div>
                                                    )}
                                                  </div>
                                                </td>
                                                <td
                                                  className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                                                    sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                                                  }`}
                                                >
                                                  <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                                                    {sa.subaccount_index === selSubaccIdx ? (
                                                      <CustomInput
                                                        intent={"primary"}
                                                        border={subaccEditedErr.name ? "error" : "selected"}
                                                        sizeComp={"xLarge"}
                                                        sizeInput="small"
                                                        value={subaccEdited.name}
                                                        onChange={(e) => {
                                                          changeName(e.target.value);
                                                        }}
                                                      />
                                                    ) : (
                                                      <div className="flex flex-row justify-start items-center w-full gap-2">
                                                        <div
                                                          className={
                                                            "flex justify-center items-center w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-md bg-SelectRowColor"
                                                          }
                                                        >
                                                          <p className="text-PrimaryTextColor">
                                                            {getInitialFromName(sa.name, 1)}
                                                          </p>
                                                        </div>
                                                        <p className="opacity-70 break-all text-left">
                                                          {sa.name.length > 105
                                                            ? `${sa.name.slice(0, 105)}...`
                                                            : sa.name}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                                <td
                                                  className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                                                    sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                                                  }`}
                                                >
                                                  <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                                                    {sa.subaccount_index === selSubaccIdx ? (
                                                      <CustomInput
                                                        intent={"primary"}
                                                        border={subaccEditedErr.subaccount_index ? "error" : "selected"}
                                                        sizeComp={"xLarge"}
                                                        sizeInput="small"
                                                        inputClass="text-center"
                                                        value={subaccEdited.subaccount_index}
                                                        onChange={(e) => {
                                                          changeSubIdx(e.target.value);
                                                        }}
                                                        onKeyDown={(e) => {
                                                          if (!asciiHex.includes(e.key)) {
                                                            e.preventDefault();
                                                          }
                                                          if (
                                                            subaccEdited.subaccount_index.includes("0x") ||
                                                            subaccEdited.subaccount_index.includes("0X")
                                                          ) {
                                                            if (e.key === "X" || e.key == "x") {
                                                              e.preventDefault();
                                                            }
                                                          }
                                                        }}
                                                      />
                                                    ) : (
                                                      <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                                                        <p className=" whitespace-nowrap">
                                                          {`0x${sa.subaccount_index || "0"}`}
                                                        </p>
                                                        <CustomCopy
                                                          size={"xSmall"}
                                                          className="p-0"
                                                          copyText={sa.subaccount_index || "0"}
                                                        />
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                                <td
                                                  className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                                                    sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                                                  }`}
                                                >
                                                  <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                                                    <p>{shortAddress(encodedAcc, 12, 10)}</p>
                                                    <CustomCopy size={"xSmall"} className="p-0" copyText={encodedAcc} />
                                                  </div>
                                                </td>
                                                <td
                                                  className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                                                    sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                                                  }`}
                                                >
                                                  <div className="flex flex-row justify-center items-start gap-4 w-full">
                                                    {sa.subaccount_index === selSubaccIdx ? (
                                                      <CheckIcon
                                                        onClick={() => {
                                                          checkSubAcc(true, cntc, asst, sa);
                                                        }}
                                                        className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                                                      />
                                                    ) : (
                                                      <PencilIcon
                                                        onClick={() => {
                                                          setAddSub(false);
                                                          setSelContactPrin("");
                                                          setSelSubaccIdx(sa.subaccount_index);
                                                          setSubaccEdited(sa);
                                                          setSubaccEditedErr({
                                                            name: false,
                                                            subaccount_index: false,
                                                          });
                                                        }}
                                                        className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor opacity-50 cursor-pointer"
                                                      />
                                                    )}
                                                    {sa.subaccount_index === selSubaccIdx ? (
                                                      <CloseIcon
                                                        onClick={() => {
                                                          setSelSubaccIdx("");
                                                        }}
                                                        className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                                                      />
                                                    ) : (
                                                      <TrashIcon
                                                        onClick={() => {
                                                          setAddSub(false);
                                                          setSelContactPrin("");
                                                          setSelSubaccIdx("");
                                                          setDeleteType(DeleteContactTypeEnum.Enum.SUB);
                                                          setDeleteObject({
                                                            principal: cntc.principal,
                                                            name: cntc.name,
                                                            tokenSymbol: asst.tokenSymbol,
                                                            symbol: asst.symbol,
                                                            subaccIdx: sa.subaccount_index,
                                                            subaccName: sa.name,
                                                            totalAssets: 0,
                                                            TotalSub: 0,
                                                          });
                                                          setDeleteModal(true);
                                                        }}
                                                        className="w-4 h-4 fill-PrimaryTextColorLight dark:fill-PrimaryTextColor cursor-pointer"
                                                      />
                                                    )}
                                                  </div>
                                                </td>
                                                <td
                                                  className={`py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${
                                                    sa.subaccount_index === selSubaccIdx ? "bg-SelectRowColor/10" : ""
                                                  }`}
                                                >
                                                  <div className="flex flex-row justify-center items-start gap-2 w-full">
                                                    <ChevIcon className="invisible" />
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                          {addSub && (
                                            <tr>
                                              <td></td>
                                              <td className="h-full">
                                                <div className="relative flex flex-col justify-center items-center w-full h-full">
                                                  <div className="w-1 h-1 bg-SelectRowColor"></div>
                                                  <div className="absolute bottom-0 w-1 ml-[-1px] left-1/2 border-l h-14 border-dotted border-SelectRowColor"></div>
                                                </div>
                                              </td>
                                              <td
                                                className={
                                                  "py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"
                                                }
                                              >
                                                <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                                                  <CustomInput
                                                    intent={"primary"}
                                                    border={subaccEditedErr.name ? "error" : "selected"}
                                                    sizeComp={"xLarge"}
                                                    sizeInput="small"
                                                    value={subaccEdited.name}
                                                    onChange={(e) => {
                                                      changeName(e.target.value);
                                                    }}
                                                    autoFocus
                                                  />
                                                </div>
                                              </td>
                                              <td
                                                className={
                                                  "py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"
                                                }
                                              >
                                                <div className="relative flex flex-row justify-start items-center w-full h-10 gap-2 px-4">
                                                  <CustomInput
                                                    intent={"primary"}
                                                    border={subaccEditedErr.subaccount_index ? "error" : "selected"}
                                                    sizeComp={"xLarge"}
                                                    sizeInput="small"
                                                    inputClass="text-center"
                                                    value={subaccEdited.subaccount_index}
                                                    onChange={(e) => {
                                                      changeSubIdx(e.target.value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (!asciiHex.includes(e.key)) {
                                                        e.preventDefault();
                                                      }
                                                      if (
                                                        subaccEdited.subaccount_index.includes("0x") ||
                                                        subaccEdited.subaccount_index.includes("0X")
                                                      ) {
                                                        if (e.key === "X" || e.key == "x") {
                                                          e.preventDefault();
                                                        }
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td
                                                className={
                                                  "py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"
                                                }
                                              >
                                                <div className="flex flex-row justify-center items-center gap-2 opacity-70 px-2 w-full">
                                                  <p>{shortAddress(getSubAcc(cntc.principal), 12, 10)}</p>
                                                  <CustomCopy
                                                    size={"xSmall"}
                                                    className="p-0"
                                                    copyText={getSubAcc(cntc.principal)}
                                                  />
                                                </div>
                                              </td>
                                              <td
                                                className={
                                                  "py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"
                                                }
                                              >
                                                <div className="flex flex-row justify-center items-start gap-4 w-full">
                                                  <CheckIcon
                                                    onClick={() => {
                                                      checkSubAcc(false, cntc, asst);
                                                    }}
                                                    className="w-4 h-4 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                                                  />
                                                  <CloseIcon
                                                    onClick={() => {
                                                      setAddSub(false);
                                                      setSelSubaccIdx("");
                                                    }}
                                                    className="w-5 h-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor opacity-50 cursor-pointer"
                                                  />
                                                </div>
                                              </td>
                                              <td
                                                className={
                                                  "py-2 border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10"
                                                }
                                              >
                                                <div className="flex flex-row justify-center items-start gap-2 w-full">
                                                  <ChevIcon className="invisible" />
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </td>
                                  )}
                                </tr>
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <RemoveModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteType={deleteType}
        getDeleteMsg={getDeleteMsg}
        deleteObject={deleteObject}
      />
    </Fragment>
  );
};

export default ContactList;
