import { useState } from "react";
import DetailTab from "./DetailTab";
import TransactionList from "./transaction/TransactionList";
import { DetailsTabs } from "@/const";
import AllowanceList from "./allowance/AllowanceList";

export default function DetailsTable() {
  const [activeTab, setActiveTab] = useState<DetailsTabs>(DetailsTabs.transactions);

  return (
    <>
      <DetailTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === DetailsTabs.allowances ? <AllowanceList /> : <TransactionList />}
    </>
  );
}
