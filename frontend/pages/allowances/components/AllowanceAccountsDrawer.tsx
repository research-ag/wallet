import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { Principal } from "@dfinity/principal";
import QRCode from "react-qr-code";
import { CustomCopy } from "@components/tooltip";
import { AccountHook } from "@pages/hooks/accountHook";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { useTranslation } from "react-i18next";
import { TAllowance } from "@/@types/allowance";
import { BasicDrawer } from "@components/drawer";

interface DrawerAllowanceAccountProps {
  allowance: TAllowance;
  isDrawerOpen: boolean;
  setDrawerOpen(value: boolean): void;
}

const DrawerAllowanceAccount = (props: DrawerAllowanceAccountProps) => {
  const { allowance, isDrawerOpen, setDrawerOpen } = props;
  const { t } = useTranslation();
  const { authClient } = AccountHook();

  const allowanceSource = getIcrcAccount(authClient, allowance.subAccountId);
  const allowanceSpender = getIcrcAccount(allowance.spender, allowance.spenderSubaccount);

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className="flex flex-row items-center justify-end w-full px-6 pt-4">
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setDrawerOpen(false);
          }}
        />
      </div>

      <div className="px-8 overflow-y-auto">
        <div className="flex flex-col justify-start items-center w-full h-full gap-4 pt-[20%]">
          <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("Source")}</p>
          <div className="flex justify-center items-center w-[60%] border-4 border-SelectRowColor bg-white rounded-lg p-3">
            <QRCode
              style={{ height: "auto", maxWidth: "100%", width: "100%", borderRadius: "0.5rem" }}
              value={allowanceSource}
            />
          </div>
          <div className="flex flex-row items-center justify-center p-2 border rounded border-BorderColorLight dark:border-BorderColor bg-SecondaryColorLight dark:bg-SecondaryColor">
            <p className="mr-2 break-all text-PrimaryTextColorLight dark:text-PrimaryTextColor">{allowanceSource}</p>
            <CustomCopy
              background="default"
              copyStroke="fill-PrimaryTextColor"
              size={"small"}
              boxSize={"small"}
              copyText={allowanceSource}
            />
          </div>
          <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor mt-6">{t("spender")}</p>
          <div className="flex flex-row items-center justify-center p-2 border rounded border-BorderColorLight dark:border-BorderColor bg-SecondaryColorLight dark:bg-SecondaryColor">
            <div className="flex flex-col justify-center items-center w-full">
              <p className="mr-2 break-all text-PrimaryTextColorLight dark:text-PrimaryTextColor">{allowanceSpender}</p>
            </div>
            <CustomCopy
              background="default"
              copyStroke="fill-PrimaryTextColor"
              size={"small"}
              boxSize={"small"}
              copyText={allowanceSpender}
            />
          </div>
        </div>
      </div>
    </BasicDrawer>
  );

  function getIcrcAccount(principal: string, subAccountId?: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(principal),
      subaccount: hexToUint8Array(subAccountId || "0x0"),
    });
  }
};

export default DrawerAllowanceAccount;
