import { Fragment, useState } from "react";
import { ICRCSubaccountInfo, ICRCSubaccountInfoEnum } from "@/const";
import ICRCSubaccountAction from "./ICRC/detail/SubaccountAction";
import ICRCTransactionsTable from "./ICRC/detail/transaction/TransactionsTable";
import ICRCSubInfo from "./ICRC/detail/subaccountTableInfo";
import AllowanceList from "./ICRC/allowance/AllowanceList";
import AddAllowanceDrawer from "./ICRC/allowance/AddAllowanceDrawer";
import SendReceiveDrawer from "./ICRC/detail/transaction/SendReceiveDrawer";
import TransactionInspectDrawer from "./ICRC/detail/transaction/TransactionInpectDrawer";

const DetailList = () => {
  const [subInfoType, setSubInfoType] = useState<ICRCSubaccountInfo>(ICRCSubaccountInfoEnum.Enum.TRANSACTIONS);

  return (
    <Fragment>
      <div
        className={
          "relative flex flex-col justify-start items-center bg-SecondaryColorLight dark:bg-SecondaryColor w-full pt-6 pr-9 pl-7 gap-2 h-fit min-h-full"
        }
      >
        <ICRCSubaccountAction />
        <ICRCSubInfo subInfoType={subInfoType} setSubInfoType={setSubInfoType}>
          {subInfoType === ICRCSubaccountInfoEnum.Enum.TRANSACTIONS && <ICRCTransactionsTable />}

          {subInfoType === ICRCSubaccountInfoEnum.Enum.ALLOWANCES && (
            <>
              <AddAllowanceDrawer />
              <AllowanceList />
            </>
          )}
        </ICRCSubInfo>
      </div>

      <SendReceiveDrawer />
      <TransactionInspectDrawer />
    </Fragment>
  );
};

export default DetailList;
