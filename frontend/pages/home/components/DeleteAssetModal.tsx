// svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import Modal from "@components/Modal";
import { AccountHook } from "@pages/hooks/accountHook";
import { useTranslation } from "react-i18next";
import { Token } from "@redux/models/TokenModels";
import { CustomButton } from "@components/Button";
import { AssetHook } from "@pages/home/hooks/assetHook";

interface DeleteAssetModalPropr {
  open: boolean;
  setOpen(value: boolean): void;
  symbol: string;
  name: string;
}

const DeleteAssetModal = ({ open, setOpen, symbol, name }: DeleteAssetModalPropr) => {
  const { t } = useTranslation();
  const { authClient } = AccountHook();
  const { tokens, deleteAsset } = AssetHook();
  return (
    <Modal
      width="w-[18rem]"
      padding="py-5"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={open}
    >
      <div className="flex flex-col justify-start items-start w-full gap-4 text-md">
        <div className="flex flex-row justify-between items-center w-full px-8">
          <WarningIcon className="w-6 h-6" />
          <CloseIcon
            className="stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
        <div className="flex flex-col justify-start items-start w-full px-8">
          <p className="text-left font-light">
            {`${t("delete.asset.msg")}`}
            <span className="font-semibold ml-1 break-all">{name}</span>?
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-end items-center w-full px-8 mt-4">
        <CustomButton className="min-w-[5rem]" onClick={handleConfirmButton} size={"small"}>
          <p>{t("confirm")}</p>
        </CustomButton>
      </div>
    </Modal>
  );

  function handleConfirmButton() {
    const auxTokens = tokens.filter((tkn) => tkn.symbol !== symbol);
    saveInLocalStorage(auxTokens);
    deleteAsset(symbol);
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
