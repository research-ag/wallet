import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AvatarEmpty } from "@components/avatar";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { getIconSrc } from "@/utils/icons";
import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";

interface AllowanceContactBookTriggerProps {
  isOpen: boolean;
}

export default function AllowanceContactBookTrigger({ isOpen }: AllowanceContactBookTriggerProps) {
  const { t } = useTranslation();
  const { sender } = useAppSelector((state) => state.transaction);
  return (
    <DropdownMenu.Trigger
      asChild
      className="flex items-center justify-between p-2 px-4 mt-2 border rounded-md cursor-pointer bg-ThemeColorSelectorLight dark:bg-SecondaryColor h-14"
    >
      <div className="flex items-center justify-center">
        <div className="mr-2">
          {sender?.allowanceContactSubAccount?.assetName && (
            <div className="flex items-center justify-between ">
              <AvatarEmpty title="H" size="large" />
              <div className="ml-2">
                <p className="text-left text-md">
                  {sender?.allowanceContactSubAccount?.contactName}{" "}
                  {`[${sender?.allowanceContactSubAccount?.subAccountName}]`}
                </p>
                <span className="flex">
                  <img
                    className="w-5 h-5 mr-2"
                    src={getIconSrc(
                      sender?.allowanceContactSubAccount?.assetLogo,
                      sender?.allowanceContactSubAccount?.assetSymbol,
                    )}
                    alt={sender?.allowanceContactSubAccount?.assetSymbol}
                  />
                  <p className="text-md">
                    {sender?.allowanceContactSubAccount?.subAccountAllowance?.allowance}{" "}
                    {sender?.allowanceContactSubAccount?.assetSymbol}
                  </p>
                </span>
              </div>
            </div>
          )}
          {!sender?.allowanceContactSubAccount?.assetName && <p className="text-md">{t("select.option")}</p>}
        </div>
        <DropIcon className={`fill-gray-color-4 ${isOpen ? "-rotate-90" : ""}`} />
      </div>
    </DropdownMenu.Trigger>
  );
}
