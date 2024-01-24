import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import SubAccountContactBook from "./SubAccountContactBook";
import NewSender from "./NewSender";

export default function SenderDetail() {
  const { sender } = useAppSelector((state) => state.transaction);

  const isSubAccountOrContactBook = useMemo(() => {
    return true;
  }, [sender]);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">From</p>
      {isSubAccountOrContactBook ? <SubAccountContactBook /> : <NewSender />}
    </>
  );
}
