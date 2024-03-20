import { getIconSrc } from "@/utils/icons";
import { AvatarEmpty } from "@components/avatar";

interface OwnSubAccountCardProps {
  subAccountName: string;
  balance: string;
  assetLogo: string;
  assetSymbol: string;
}

export default function OwnSubAccountCard(props: OwnSubAccountCardProps) {
  const { subAccountName, balance, assetLogo, assetSymbol } = props;
  return (
    <div className="flex justify-start w-full p-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light">
      <div className="flex items-center justify-center">
        <AvatarEmpty title={subAccountName} className="mr-2" size="large" />
      </div>
      <div className="text-start text-black-color dark:text-secondary-color-1-light">
        <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{subAccountName}</p>
        <div className="flex">
          <img src={getIconSrc(assetLogo, assetSymbol)} className="w-4 h-4 mr-2" alt="" />
          <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {balance} {assetSymbol}
          </p>
        </div>
      </div>
    </div>
  );
}
