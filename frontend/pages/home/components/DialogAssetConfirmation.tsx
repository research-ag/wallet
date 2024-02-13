import { AddingAssets, AddingAssetsEnum, IconTypeEnum, TokenNetwork, TokenNetworkEnum } from "@/const";

// svgs
import CloseIcon from "@assets/svg/files/close.svg?react";
import { GeneralHook } from "../hooks/generalHook";
//
import Modal from "@components/Modal";
import { Token } from "@redux/models/TokenModels";
import { useTranslation } from "react-i18next";

interface DialogAssetConfirmationProps {
  modal: boolean;
  showModal(value: boolean): void;
  setAssetOpen(value: boolean): void;
  newToken: Token;
  setNewToken(value: Token): void;
  setNetwork(value: TokenNetwork): void;
  addStatus: AddingAssets;
  setManual(value: boolean): void;
}

const DialogAssetConfirmation = ({
  modal,
  showModal,
  setAssetOpen,
  newToken,
  setNewToken,
  setNetwork,
  addStatus,
  setManual,
}: DialogAssetConfirmationProps) => {
  const { t } = useTranslation();
  const { getAssetIcon } = GeneralHook();

  return (
    <Modal
      open={modal}
      width="w-[18rem]"
      padding="py-3 px-1"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="reative flex flex-col justify-start items-center w-full">
        <CloseIcon
          className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <div className="flex flex-col justify-start items-center w-full py-2">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, newToken?.symbol, newToken.logo)}
          <p
            className={`text-lg font-semibold mt-3 ${
              addStatus === AddingAssetsEnum.Enum.done ? "text-TextReceiveColor" : "text-TextSendColor"
            }`}
          >
            {getMessage(addStatus).top}
          </p>
          <p className="text-lg font-semibold mt-3">{getMessage(addStatus).botton}</p>
        </div>
      </div>
    </Modal>
  );

  function onClose() {
    showModal(false);
    setAssetOpen(false);
    setNetwork(TokenNetworkEnum.enum["ICRC-1"]);
    setNewToken({
      address: "",
      symbol: "",
      decimal: "",
      shortDecimal: "",
      name: "",
      tokenSymbol: "",
      tokenName: "",
      fee: "",
      subAccounts: [{ numb: "0x0", name: "Default", amount: "0", currency_amount: "0" }],
      index: "",
      id_number: 999,
    });
    setManual(false);
  }

  function getMessage(status: string) {
    switch (status) {
      case AddingAssetsEnum.Enum.adding:
        return { top: "", botton: t("adding.asset") };
      case AddingAssetsEnum.Enum.done:
        return { top: t("congrats"), botton: t("adding.asset.successful") };
      case AddingAssetsEnum.Enum.error:
        return { top: t("error"), botton: t("adding.asset.failed") };

      default:
        return { top: t("adding.asset"), botton: "" };
    }
  }
};

export default DialogAssetConfirmation;
