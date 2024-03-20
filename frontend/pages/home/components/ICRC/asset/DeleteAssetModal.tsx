// svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import {Modal} from "@components/modal";
import { AccountHook } from "@pages/hooks/accountHook";
import { useTranslation } from "react-i18next";
import { Token } from "@redux/models/TokenModels";
import { CustomButton } from "@components/button";
import { AssetHook } from "@pages/home/hooks/assetHook";

interface DeleteAssetModalPropr {
  open: boolean;
  setOpen(value: boolean): void;
  asset: any;
}

const DeleteAssetModal = ({ open, setOpen, asset }: DeleteAssetModalPropr) => {
  const { t } = useTranslation();
  const { authClient } = AccountHook();
  const { tokens, deleteAsset } = AssetHook();
  const { name, symbol, address } = asset;

  return (
    <Modal
      width="w-[18rem]"
      padding="py-5"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={open}
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 text-md">
        <div className="flex flex-row items-center justify-between w-full px-8">
          <WarningIcon className="w-6 h-6" />
          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full px-8">
          <p className="font-light text-left">
            {`${t("delete.asset.msg")}`}
            <span className="ml-1 font-semibold break-all">{name}</span>?
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end w-full px-8 mt-4">
        <CustomButton className="min-w-[5rem]" onClick={handleConfirmButton} size={"small"}>
          <p>{t("confirm")}</p>
        </CustomButton>
      </div>
    </Modal>
  );

  function handleConfirmButton() {
    const auxTokens = tokens.filter((tkn) => tkn.symbol !== symbol);
    saveInLocalStorage(auxTokens);
    deleteAsset(symbol, address);
    setOpen(false);
  }

  function saveInLocalStorage(tokens: Token[]) {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: tokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  }
};

export default DeleteAssetModal;
