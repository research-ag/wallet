import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";

export default function SenderTypeSelect() {
  const [senderOption, setSenderOption] = useState("Own");

  const onValueChange = (selected: string) => {
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
              senderOption === "Own" ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
            }`}
            value="Own"
            id="r-light"
          >
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
          </RadioGroup.Item>
          <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">Own</p>
        </div>
        <div className="flex flex-row items-center p-1">
          <RadioGroup.Item
            className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
              senderOption === "Allowance" ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
            }`}
            value="Allowance"
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
