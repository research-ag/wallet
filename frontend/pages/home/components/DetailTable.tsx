import { useState } from "react";
import DetailTab from "./DetailTab";
import TransactionList from "./transaction/TransactionList";
import AllowanceList from "./allowance/AllowanceList";
import { DetailsTabs, DetailsTabsEnum } from "@/@types/common";

export default function DetailsTable() {
  const [activeTab, setActiveTab] = useState<DetailsTabs>(DetailsTabsEnum.Values.TRANSACTIONS);

  return (
    <>
      <DetailTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === DetailsTabsEnum.Values.ALLOWANCES ? <AllowanceList /> : <TransactionList />}
    </>
  );
}
