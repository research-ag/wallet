// svgs
import { ReactComponent as FlagSpain } from "@/assets/svg/files/españa.svg";
import { ReactComponent as FlagUSA } from "@/assets/svg/files/usa.svg";
import { ReactComponent as FlagItaly } from "@/assets/svg/files/italia.svg";
import { ReactComponent as BrazilFlag } from "@/assets/svg/files/brazil.svg";
//
import { LanguageHook } from "@hooks/languageHook";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface FlagSelectorProps {
  open: boolean;
  handleOpenChange: (value: boolean) => void;
}

const FlagSelector = ({ open, handleOpenChange }: FlagSelectorProps) => {
  const { onLanguageChange, languageOptionTemplate, languageMenu } = LanguageHook();

  const languageOpts = [
    { name: "en", flag: <FlagUSA /> },
    { name: "es", flag: <FlagSpain /> },
    { name: "it", flag: <FlagItaly /> },
    { name: "pt", flag: <BrazilFlag /> },
  ];

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger
        asChild
        className={`border ${
          open ? "border-b-0 rounded-t-md" : "rounded-md"
        } border-BorderColorLight dark:border-BorderColor p-1 cursor-pointer`}
      >
        {languageOptionTemplate()}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="p-1 pb-0 border border-t-0 border-BorderColor light:border-BorderColorLight rounded-b-md">
          {languageOpts.map((lOpts, k) => {
            if (languageMenu.code !== lOpts.name)
              return (
                <DropdownMenu.Item
                  key={k}
                  className="mb-1 outline-none cursor-pointer"
                  onClick={() => {
                    onLanguageChange(lOpts.name);
                  }}
                >
                  {lOpts.flag}
                </DropdownMenu.Item>
              );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default FlagSelector;
