import { Fragment } from "react";
import ICRCSubaccountAction from "@/pages/home/components/ICRC/transaction/TransactionActionBanner";
// import ICRCTransactionsTable from "@/pages/home/components/ICRC/transaction/TransactionsTable";
import SendReceiveDrawer from "@/pages/home/components/ICRC/transaction/SendReceiveDrawer";
import TransactionInspectDrawer from "@/pages/home/components/ICRC/transaction/TransactionInpectDrawer";
// import TransactionsWrapper from "./TransactionsWrapper";

const DetailList = () => {
  return (
    <Fragment>
      <div className="relative flex flex-col items-center justify-start w-full min-h-full gap-2 pt-6 bg-SecondaryColorLight dark:bg-SecondaryColor pr-9 pl-7 h-fit">
        <ICRCSubaccountAction />
        {/* <TransactionsWrapper>
          <ICRCTransactionsTable />
        </TransactionsWrapper> */}
      </div>
      <SendReceiveDrawer />
      <TransactionInspectDrawer />
    </Fragment>
  );
};

export default DetailList;
