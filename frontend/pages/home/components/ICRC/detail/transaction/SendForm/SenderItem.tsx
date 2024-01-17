import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import {
  SenderInitialState,
  SenderOption,
  SetSenderAllowanceContact,
  SetSenderNewAllowanceContact,
  SetSenderSubAccount,
} from "@/@types/transactions";
import { useState } from "react";
import SenderAllowanceContact from "./SenderAllowanceContact";

export interface SenderItemProps {
  sender: SenderInitialState;
  setSenderSubAccount: SetSenderSubAccount;
  setSenderAllowanceContact: SetSenderAllowanceContact;
  setSenderNewAllowanceContact: SetSenderNewAllowanceContact;
}

export default function SenderItem(props: SenderItemProps) {
  const [senderOption, setSenderOption] = useState<SenderOption>(SenderOption.own);
  const { sender, setSenderSubAccount, setSenderAllowanceContact, setSenderNewAllowanceContact } = props;

  return (
    <div className="w-full mt-4 rounded-md bg-ToBoxColor">
      <div className="w-full py-2 border-b border-BorderColor">
        <SenderType senderOption={senderOption} setSenderOption={setSenderOption} />
      </div>
      <div className="p-4">
        {senderOption === SenderOption.own && (
          <SenderSubAccount sender={sender} setSenderSubAccount={setSenderSubAccount} />
        )}
        {senderOption === SenderOption.allowance && (
          <SenderAllowanceContact
            setSenderAllowanceContact={setSenderAllowanceContact}
            sender={sender}
            setSenderNewAllowanceContact={setSenderNewAllowanceContact}
          />
        )}
      </div>
    </div>
  );
}
