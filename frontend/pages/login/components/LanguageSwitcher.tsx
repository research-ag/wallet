// svgs
import { ReactComponent as ChevIcon } from "@/assets/svg/files/chev-icon.svg";
//
import FlagSelector from "@/pages/login/components/flagSelector";
import { useState } from "react";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute flex flex-row items-center justify-center right-8 top-6 bg-none">
      <FlagSelector open={open} handleOpenChange={handleOpenChange}></FlagSelector>
      <div
        className={`p-1 cursor-pointer ${open ? "" : "rotate-90"}`}
        onClick={() => {
          handleOpenChange(!open);
        }}
      >
        <ChevIcon className="w-8 h-8 " />
      </div>
    </div>
  );

  function handleOpenChange(value: boolean) {
    setOpen(value);
  }
}
