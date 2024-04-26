import { Fragment } from "react";
import ICRCSubaccountAction from "./ICRC/detail/SubaccountAction";
import ICRCTransactionsTable from "./ICRC/detail/transaction/TransactionsTable";
import SendReceiveDrawer from "./ICRC/detail/transaction/SendReceiveDrawer";
import TransactionInspectDrawer from "./ICRC/detail/transaction/TransactionInpectDrawer";

const DetailList = () => {
  return (
    <Fragment>
      <div
        className={
          "relative flex flex-col justify-start items-center bg-SecondaryColorLight dark:bg-SecondaryColor w-full pt-6 pr-9 pl-7 gap-2 h-fit min-h-full"
        }
      >
        <ICRCSubaccountAction />
        <ICRCTransactionsTable />
      </div>
      <SendReceiveDrawer />
      <TransactionInspectDrawer />
    </Fragment>
  );
};

export default DetailList;
