import { Fragment, useState } from "react";
import DrawerSend from "./ICRC/drawer/DrawerSend";
import DrawerReceive from "./ICRC/drawer/DrawerReceive";
import DrawerAction from "./ICRC/drawer/DrawerAction";
import { DrawerHook } from "../hooks/drawerHook";
import { UseTransaction } from "../hooks/useTransaction";
import { DrawerOption, DrawerOptionEnum, ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import ICRCSubaccountAction from "./ICRC/detail/SubaccountAction";
import ICRCTransactionsTable from "./ICRC/detail/transaction/TransactionsTable";
import DrawerTransaction from "./ICRC/detail/transaction/Transaction";
import ICRCSubInfo from "./ICRC/detail/subaccountTableInfo";
import AllowanceList from "./ICRC/allowance/AllowanceList";
import AddAllowanceDrawer from "./ICRC/allowance/AddAllowanceDrawer";

const icrc1DrawerOptions = [
  { name: "send", type: DrawerOptionEnum.Enum.SEND },
  { name: "receive", type: DrawerOptionEnum.Enum.RECEIVE },
];

const DetailList = () => {
  const { drawerOption, setDrawerOption, drawerOpen, setDrawerOpen } = DrawerHook();

  const { selectedTransaction } = UseTransaction();
  const [subInfoType, setSubInfoType] = useState<ICRCSubaccountInfo>(ICRCSubaccountInfoEnum.Enum.TRANSACTIONS);

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

      <div
        id="right-drower"
        className={`h-full fixed z-[999] top-0 w-[28rem] overflow-x-hidden transition-{right} duration-500 ${
          drawerOpen ? "!right-0" : "right-[-30rem]"
        }`}
      >
        {getDrawers()}
      </div>
    </Fragment>
  );

  function handleActionClick(drawer: DrawerOption) {
    setDrawerOption(drawer);
    setTimeout(() => {
      setDrawerOpen(true);
    }, 150);
  }

  function getDrawers() {
    return selectedTransaction ? (
      <DrawerTransaction setDrawerOpen={setDrawerOpen} />
    ) : (
      <div className="flex flex-col items-center justify-start w-full h-full gap-5 px-6 pt-8 bg-PrimaryColorLight dark:bg-PrimaryColor">
        <DrawerAction
          options={icrc1DrawerOptions}
          drawerOption={drawerOption}
          setDrawerOption={setDrawerOption}
          setDrawerOpen={setDrawerOpen}
        >
          {drawerOption === DrawerOptionEnum.Enum.SEND && (
            <DrawerSend drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          )}
          {drawerOption === DrawerOptionEnum.Enum.RECEIVE && <DrawerReceive />}
        </DrawerAction>
      </div>
    );
  }
};

export default DetailList;
