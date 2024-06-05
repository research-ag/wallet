import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { shortAddress } from "@common/utils/icrc";
import { AvatarEmpty } from "@components/avatar";
import { CustomCopy } from "@components/tooltip";
import ContactAccountAction from "./ICRC/ContactAccountAction";
import { Contact, ContactAccount } from "@/@types/contacts";
import { Asset } from "@redux/models/AccountModels";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";

interface DisplayContactAccountRowProps {
  index: number;
  currentAccount: ContactAccount;
  currentAsset: Asset;
  contact: Contact;
}

export default function DisplayContactAccountRow(props: DisplayContactAccountRowProps) {
  return (
    <tr key={props.index} className="h-[2.8rem]">
      <td className="h-full w-[5%]">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="w-1.5 h-1.5 bg-primary-color"></div>
          {props.index !== 0 && (
            <div className="absolute bottom-0 w-1 h-12 border-l border-dotted left-1/2 border-primary-color" />
          )}
        </div>
      </td>

      <td className="w-[15%]">
        <div className="flex items-center">
          {getAssetIcon(IconTypeEnum.Values.ASSET, props.currentAsset.tokenSymbol, props.currentAsset.logo)}
          <span className="ml-2">{props.currentAsset.symbol}</span>
        </div>
      </td>

      <td className="w-[20%]">
        <div className="flex items-center">
          <AvatarEmpty title={props.currentAccount.name} />
          <span className="ml-2">{props.currentAccount.name}</span>
        </div>
      </td>

      <td className="w-[20%]">
        <div className="flex items-center">
          <p className="mr-2">{props.currentAccount.subaccountId}</p>
          <CustomCopy size={"xSmall"} className="p-0" copyText={props.currentAccount.subaccountId} />
        </div>
      </td>

      <td className="w-[20%]">
        <div className="flex items-center w-full px-2">
          <p className="mr-2">
            {shortAddress(getSubAccount(props.contact.principal, props.currentAccount.subaccountId), 14, 14)}
          </p>
          <CustomCopy
            size={"xSmall"}
            className="p-0"
            copyText={getSubAccount(props.contact.principal, props.currentAccount.subaccountId)}
          />
        </div>
      </td>

      <td className="w-[20%]">
        <ContactAccountAction account={props.currentAccount} contact={props.contact} />
      </td>
    </tr>
  );

  function getSubAccount(principal: string, subaccount?: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(principal),
      subaccount: hexToUint8Array(subaccount || "0x0"),
    });
  }
}
