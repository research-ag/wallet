// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { ReactComponent as PencilIcon } from "@assets/svg/files/pencil.svg";
import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { ReactComponent as ChevIcon } from "@assets/svg/files/chev-icon.svg";
//
import { useTranslation } from "react-i18next";
import {
  AssetContact,
  Contact,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { DeleteContactTypeEnum, IconTypeEnum } from "@/const";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { Fragment } from "react";
import TableSubAccounts from "./tableSubAccounts";

interface TableAssetsProps {
  cntc: Contact;
  openSubaccToken: string;
  setOpenSubaccToken(value: string): void;
  setSelSubaccIdx(value: string): void;
  changeName(value: string): void;
  addSub: boolean;
  setAddSub(value: boolean): void;
  setDeleteType(value: DeleteContactTypeEnum): void;
  setDeleteObject(value: NewContactSubAccount): void;
  setSelContactPrin(value: string): void;
  setSubaccEdited(value: SubAccountContact): void;
  setSubaccEditedErr(value: SubAccountContactErr): void;
  changeSubIdx(value: string): void;
  setDeleteModal(value: boolean): void;
  selSubaccIdx: string;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
}

const TableAssets = ({
  cntc,
  openSubaccToken,
  setOpenSubaccToken,
  setSelSubaccIdx,
  changeName,
  addSub,
  setAddSub,
  setDeleteType,
  setDeleteObject,
  setSelContactPrin,
  setSubaccEdited,
  setSubaccEditedErr,
  changeSubIdx,
  setDeleteModal,
  selSubaccIdx,
  subaccEdited,
  subaccEditedErr,
}: TableAssetsProps) => {
  const { t } = useTranslation();

  const { getAssetIcon } = GeneralHook();

  const dotH = (asst: AssetContact) => {
    let height = "0";
    if (asst.tokenSymbol === openSubaccToken && (asst.subaccounts.length > 0 || addSub))
      height = (5.7 + asst.subaccounts.length * 3.55 + (addSub ? 3.55 : 0)).toString();
    else height = "3.25";
    return `${height}rem`;
  };

  return (
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
                          if (openSubaccToken !== asst.tokenSymbol) setOpenSubaccToken(asst.tokenSymbol);
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
                  <td colSpan={5} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
                    <TableSubAccounts
                      asst={asst}
                      addSub={addSub}
                      selSubaccIdx={selSubaccIdx}
                      subaccEdited={subaccEdited}
                      subaccEditedErr={subaccEditedErr}
                      cntc={cntc}
                      setSubaccEdited={setSubaccEdited}
                      changeSubIdx={changeSubIdx}
                      changeName={changeName}
                      setAddSub={setAddSub}
                      setSelSubaccIdx={setSelSubaccIdx}
                      setSelContactPrin={setSelContactPrin}
                      setDeleteModal={setDeleteModal}
                      setDeleteType={setDeleteType}
                      setSubaccEditedErr={setSubaccEditedErr}
                      setDeleteObject={setDeleteObject}
                    ></TableSubAccounts>
                  </td>
                )}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableAssets;
