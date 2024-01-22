import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import { SenderOption } from "@/@types/transactions";
import { useState } from "react";
import SenderAllowanceContact from "./SenderAllowanceContact";

export default function SenderItem() {
  const [senderOption, setSenderOption] = useState<SenderOption>(SenderOption.own);

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderType senderOption={senderOption} setSenderOption={setSenderOption} />
      </div>
      <div className="p-4">
        {senderOption === SenderOption.own && <SenderSubAccount />}
        {senderOption === SenderOption.allowance && <SenderAllowanceContact />}
      </div>
    </div>
  );
}
