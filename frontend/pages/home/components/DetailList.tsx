import { Fragment, useState } from "react";
import DrawerSend from "./ICRC/drawer/DrawerSend";
import DrawerReceive from "./ICRC/drawer/DrawerReceive";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { DrawerHook } from "../hooks/drawerHook";
import { DrawerOption, DrawerOptionEnum, ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import ICRCSubaccountAction from "./ICRC/detail/SubaccountAction";
import ICRCTransactionsTable from "./ICRC/detail/transaction/TransactionsTable";
import ICRCSubInfo from "./ICRC/detail/subaccountTableInfo";
import AllowanceList from "./ICRC/allowance/AllowanceList";
import AddAllowanceDrawer from "./ICRC/allowance/AddAllowanceDrawer";
import { resetSendStateAction } from "@redux/transaction/TransactionActions";
import { CustomButton } from "@components/button";
import { BasicDrawer } from "@components/drawer";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const DetailList = () => {
  const { drawerOption, setDrawerOption, drawerOpen, setDrawerOpen } = DrawerHook();
  const selectedButton = "border-AccpetButtonColor";
  const unselectedButton = "text-PrimaryTextColorLight dark:text-PrimaryTextColor";
  const [subInfoType, setSubInfoType] = useState<ICRCSubaccountInfo>(ICRCSubaccountInfoEnum.Enum.TRANSACTIONS);

  const { t } = useTranslation();

  const drawerOptions = [
    { name: "transfer", style: customSend(), type: DrawerOptionEnum.Enum.SEND },
    { name: "deposit", style: customReceive(), type: DrawerOptionEnum.Enum.RECEIVE },
  ];

  console.log(subInfoType);

  return (
    <Fragment>
      <div
        className={
          "relative flex flex-col justify-start items-center bg-SecondaryColorLight dark:bg-SecondaryColor w-full pt-6 pr-9 pl-7 gap-2 h-fit min-h-full"
        }
      >
        <div className="flex flex-row justify-between items-center w-full h-[4.75rem] bg-TransactionHeaderColorLight dark:bg-TransactionHeaderColor rounded-md">
          <ICRCSubaccountAction onActionClick={handleActionClick} />
        </div>
        <ICRCSubInfo subInfoType={subInfoType} setSubInfoType={setSubInfoType}>
          {subInfoType === ICRCSubaccountInfoEnum.Enum.TRANSACTIONS && (
            <ICRCTransactionsTable setDrawerOpen={setDrawerOpen} />
          )}
          {subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES && (
            <>
              <AddAllowanceDrawer />
              <AllowanceList />
            </>
          )}
        </ICRCSubInfo>
      </div>

      <BasicDrawer isDrawerOpen={drawerOpen}>
        <div className="flex items-center justify-between w-full row">
          <div className="flex flex-row items-center justify-start w-full gap-4">
            {drawerOptions.map((dOpt, k) => {
              return (
                <CustomButton
                  key={k}
                  intent={"noBG"}
                  border={"underline"}
                  className={`!font-light ${dOpt.style}`}
                  onClick={() => {
                    console.log(dOpt);
                    setDrawerOption(dOpt.type);
                  }}
                >
                  <p>{t(dOpt.name)}</p>
                </CustomButton>
              );
            })}
          </div>

          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setDrawerOpen(false);
              resetSendStateAction();
            }}
          />
        </div>

        {drawerOption === DrawerOptionEnum.Enum.SEND && (
          <DrawerSend drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        )}

        {drawerOption === DrawerOptionEnum.Enum.RECEIVE && <DrawerReceive />}
      </BasicDrawer>
    </Fragment>
  );

  function handleActionClick(drawer: DrawerOption) {
    setDrawerOption(drawer);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 150);
  }

  function chechEqId(option: DrawerOption) {
    return drawerOption === option;
  }

  function customSend() {
    return clsx(chechEqId(DrawerOptionEnum.Enum.SEND) ? selectedButton : unselectedButton);
  }

  function customReceive() {
    return clsx(chechEqId(DrawerOptionEnum.Enum.RECEIVE) ? selectedButton : unselectedButton);
  }
};

export default DetailList;
