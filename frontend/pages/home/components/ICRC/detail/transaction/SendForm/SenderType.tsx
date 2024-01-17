import { SenderOption } from "@/@types/transactions";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Dispatch, SetStateAction } from "react";

interface SenderTypeProps {
  senderOption: SenderOption;
  setSenderOption: Dispatch<SetStateAction<SenderOption>>;
}

export default function SenderType(props: SenderTypeProps) {
  const { senderOption, setSenderOption } = props;

  const onValueChange = (selected: SenderOption) => {
    setSenderOption(selected);
    console.log(selected);
  };

  return (
    <div className="flex items-center justify-between w-full px-4">
      <p className="opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">from</p>

      <RadioGroup.Root value={senderOption} onValueChange={onValueChange} className="flex">
        <div className="flex flex-row items-center p-1">
          <RadioGroup.Item
            className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
              senderOption === SenderOption.own ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
            }`}
            value={SenderOption.own}
            id="r-light"
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
          </RadioGroup.Item>
          <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">Own</p>
        </div>
        <div className="flex flex-row items-center p-1">
          <RadioGroup.Item
            className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
              senderOption === SenderOption.allowance ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
            }`}
            value={SenderOption.allowance}
            id="r-light"
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
          </RadioGroup.Item>
          <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">Allowance</p>
        </div>
      </RadioGroup.Root>
    </div>
  );
}
