import { Fragment } from "react";
import ICRCSubaccountAction from "@/pages/home/components/ICRC/transaction/TransactionActionBanner";
import SendReceiveDrawer from "@/pages/home/components/ICRC/transaction/SendReceiveDrawer";
import TransactionInspectDrawer from "@/pages/home/components/ICRC/transaction/TransactionInpectDrawer";
import TransactionsFiltering from "./TransactionsFiltering";
import TransactionsScroll from "@/pages/home/components/ICRC/transaction/TransactionsScroll";

const DetailList = () => {
  return (
    <Fragment>
      <div className="relative flex flex-col items-center justify-start w-full min-h-full gap-2 pt-6 bg-SecondaryColorLight dark:bg-SecondaryColor pr-9 pl-7 h-fit">
        <ICRCSubaccountAction />
        <TransactionsFiltering>
          <TransactionsScroll />
        </TransactionsFiltering>
      </div>
      <SendReceiveDrawer />
      <TransactionInspectDrawer />
    </Fragment>
  );
};

export default DetailList;