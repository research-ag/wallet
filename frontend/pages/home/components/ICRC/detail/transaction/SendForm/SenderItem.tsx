import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import { SenderOption } from "@/@types/transactions";
import { useEffect, useState } from "react";
import SenderAllowanceContact from "./SenderAllowanceContact";
import { useAppSelector } from "@redux/Store";
import { setSenderAssetAction, setSenderSubAccountAction } from "@redux/transaction/TransactionActions";
import { isObjectValid } from "@/utils/checkers";

export default function SenderItem() {
  const [senderOption, setSenderOption] = useState<SenderOption>(SenderOption.own);

  return (
    <SenderInitializer>
      <div className="w-full mt-4 rounded-md bg-ToBoxColor">
        <div className="w-full py-2 border-b border-BorderColor">
          <SenderType senderOption={senderOption} setSenderOption={setSenderOption} />
        </div>
        <div className="p-4">
          {senderOption === SenderOption.own && <SenderSubAccount />}
          {senderOption === SenderOption.allowance && <SenderAllowanceContact />}
        </div>
      </div>
    </SenderInitializer>
  );
}

function SenderInitializer({ children }: { children: JSX.Element }) {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const { sender } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (selectedAsset && selectedAsset?.tokenName !== sender?.asset?.tokenName) {
      setSenderAssetAction(selectedAsset);
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAccount) {
      if (
        !isObjectValid(sender.newAllowanceContact) &&
        !isObjectValid(sender.allowanceContactSubAccount) &&
        !sender.scannerContact
      ) {
        setSenderSubAccountAction(selectedAccount);
      }
    }
  }, [selectedAccount]);

  return children;
}
