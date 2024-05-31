import { Contact } from "@/@types/contacts";
// import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";
// import { IconTypeEnum } from "@common/const";
// import { getAssetIcon } from "@common/utils/icons";
// import { shortAddress } from "@common/utils/icrc";
// import { AvatarEmpty } from "@components/avatar";
// import Avatar from "@components/avatar/BasicAvatar";
// import { CustomCopy } from "@components/tooltip";
// import { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { shortAddress } from "@common/utils/icrc";
import { AvatarEmpty } from "@components/avatar";
import { CustomCopy } from "@components/tooltip";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import logger from "@common/utils/logger";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  // const { t } = useTranslation();
  // const [newAsset, setNewAsset] = useState<Asset | null>(null);
  const assets = useAppSelector((state) => state.asset.list.assets);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
        <table className="w-full font-light text-left">
          <thead className="h-[2.8rem]">
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[19%]">Asset</th>
              <th className="w-[19%]">Name</th>
              <th className="w-[10%]">Sub-account</th>
              <th className="w-[37%]">Account Identifier</th>
              <th className="w-[13%]"></th>
            </tr>
          </thead>
          <tbody>
            {contact?.accounts.map((currentAccount, index) => {
              const currentAsset = assets.find((asset) => asset.tokenSymbol === currentAccount.tokenSymbol);

              if (!currentAsset) {
                logger.debug("SubAccountTable: required asset not found ", currentAccount.tokenSymbol);
                return null;
              }

              return (
                <tr key={index} className="h-[2.8rem]">
                  <td className="h-full w-[5%]">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="w-1.5 h-1.5 bg-primary-color"></div>
                      {index !== 0 && (
                        <div className="absolute bottom-0 w-1 h-12 border-l border-dotted left-1/2 border-primary-color" />
                      )}
                    </div>
                  </td>

                  <th className="w-[19%] flex items-center">
                    {getAssetIcon(IconTypeEnum.Values.ASSET, currentAsset.tokenSymbol, currentAsset.logo)}
                    <span className="ml-2">{currentAsset.symbol}</span>
                  </th>

                  <th className="w-[19%]">
                    <div className="flex items-center">
                      <AvatarEmpty title={currentAccount.name} />
                      <span className="ml-2">{currentAccount.name}</span>
                    </div>
                  </th>

                  <th className="w-[10%]">
                    <div className="flex items-center">
                      <p className="mr-2">0x22</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={contact.principal} />
                    </div>
                  </th>

                  <th className="w-[36%]">
                    <div className="flex items-center w-full px-2">
                      <p className="mr-2">{shortAddress(getSubAccount(contact.principal), 12, 10)}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={getSubAccount(contact.principal)} />
                    </div>
                  </th>

                  <th className="w-[14%]">
                    <div className="flex items-center">
                      <DotsHorizontalIcon
                        className="w-5 h-5 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                        onClick={onContactAction}
                      />
                    </div>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </td>
    </tr>
  );

  function getSubAccount(princ: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(princ || ""),
      subaccount: hexToUint8Array("0x22" || "0"),
    });
  }

  function onContactAction() {
    console.log("Contact action");
  }
}
