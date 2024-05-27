import { IconTypeEnum } from "@common/const";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getAssetIcon } from "@common/utils/icons";
import { shortAddress } from "@common/utils/icrc";
import { AvatarEmpty } from "@components/avatar";
import Avatar from "@components/avatar/BasicAvatar";
import { CustomCopy } from "@components/tooltip";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
import { Asset } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  const { t } = useTranslation();
  const [newAsset, setNewAsset] = useState<Asset | null>(null);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">

        <table className="w-full text-left">
          <thead className="h-[2.8rem]">
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[5%]"></th>
              <th className="w-[20%]">Asset</th>
              <th className="w-[20%]">Name</th>
              <th className="w-[25%]">Sub-account</th>
              <th className="w-[20%]">Account Identifier</th>
              <th className="w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {contact?.assets.map((currentAsset, index) => {

              return (
                <tr key={index} className="h-[2.8rem]">
                  <td></td>
                  <td className="h-full">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="w-1.5 h-1.5 bg-primary-color"></div>
                      {index !== 0 && <div className="absolute bottom-0 w-1 h-12 border-l border-dotted left-1/2 border-primary-color" />}
                    </div>
                  </td>
                  <th className="w-[20%] flex items-center">
                    {getAssetIcon(IconTypeEnum.Values.ASSET, "ICP", "")} <span className="ml-2">ICP</span>
                  </th>
                  <th className="w-[20%]">
                    <div className="flex items-center">
                      <AvatarEmpty title="Sub-1" />
                      <span className="ml-2">Sub-1</span>
                      {/* TODO: add allowance tooltip */}
                    </div>
                  </th>
                  <th className="w-[25%]">
                    <div className="flex items-center">
                      <p className="mr-2">0x22</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={contact.principal} />
                    </div>
                  </th>
                  <th className="w-[20%]">
                    <div className="flex items-center w-full px-2">
                      <p className="mr-2">{shortAddress(getSubAccount(contact.principal), 12, 10)}</p>
                      <CustomCopy size={"xSmall"} className="p-0" copyText={getSubAccount(contact.principal)} />
                    </div>
                  </th>
                  <th className="w-[5%]"></th>
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

}
