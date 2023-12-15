import { useState } from "react";
import DetailTab from "./DetailTab";
import TransactionList from "./TransactionList";
import { DetailsTabs } from "@/const";
import AllowanceList from "./AllowanceList";

export default function DetailsTable() {
  const [activeTab, setActiveTab] = useState<DetailsTabs>(DetailsTabs.allowances);

  return (
    <>
      <DetailTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === DetailsTabs.allowances ? <AllowanceList /> : <TransactionList />}
    </>
  );
}
