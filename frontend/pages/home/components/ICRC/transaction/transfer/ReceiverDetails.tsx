import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as CheckIcon } from "@assets/svg/files/check.svg";
//
import { middleTruncation } from "@/common/utils/strings";
import { TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import { AvatarEmpty } from "@components/avatar";
import { getIconSrc } from "@common/utils/icons";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { defaultSubAccount } from "@common/defaultTokens";

export default function ReceiverDetails() {
  const { t } = useTranslation();
  const { transferState } = useTransfer();
  const isReceiverService = transferState.toType === TransferToTypeEnum.thirdPartyService;
  const isReceiverContactBook = transferState.toType === TransferToTypeEnum.thirdPartyContact;
  const isReceiverOwnAccount = transferState.toType === TransferToTypeEnum.own;

  const isManual = transferState.toType === TransferToTypeEnum.manual;
  const isScanner = transferState.toType === TransferToTypeEnum.thidPartyScanner;
  const isICRC = transferState.toType === TransferToTypeEnum.thirdPartyICRC;
  const isReceiverManual = isManual || isScanner || isICRC;

  console.log({
    isReceiverService,
    isReceiverContactBook,
    isReceiverOwnAccount,
    isReceiverManual,
  });

  return (
    <div className="max-w-[23rem] mx-auto space-y-[0.5rem]">
      <p className="font-bold opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {`${t("to")} ${isReceiverService ? t("service") : ""}`}
      </p>
      {isReceiverService && <ToServiceDisplay />}
      {isReceiverManual && <ToManualDisplay />}
      {isReceiverContactBook && <ToContactDisplay />}
      {isReceiverOwnAccount && <ToOwnDisplay />}
    </div>
  );
}

function ToServiceDisplay() {
  const { t } = useTranslation();
  const { transferState } = useTransfer();
  const services = useAppSelector((state) => state.services.services);

  return (
    <div className="flex flex-col items-center justify-start w-full gap-1 px-4 py-2 rounded-md dark:bg-secondary-color-2 bg-secondary-color-1-light text-start text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70 text-md">
      <div className="flex flex-row items-center justify-between w-full">
        <p>{t("name")}</p>
        <p>{getServiceName()}</p>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <p>{t("principal")}</p>
        <p>{transferState.toPrincipal}</p>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <p>{t("subaccount")}</p>
        <p>{middleTruncation(transferState.toSubAccount, 7, 5)}</p>
      </div>
    </div>
  );

  function getServiceName() {
    const service = services.find((service) => service.principal === transferState.toPrincipal);
    if (!service) logger.debug("Service not found in services list.");
    return service?.name;
  }
}

function ToManualDisplay() {
  const { transferState } = useTransfer();

  return (
    <div className="relative flex px-3 py-2 border rounded-md text-black-color dark:text-secondary-color-1-light border-slate-color-success dark:bg-secondary-color-2 bg-secondary-color-1-light">
      <CloseIcon
        className="absolute top-0 right-0 mt-1 mr-1 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={onRemoveReceiver}
      />
      <div className="mr-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-color-success">
          <CheckIcon className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="text-start">
        <p className="text-md">
          {transferState.toSubAccount.length > 20
            ? middleTruncation(transferState.toSubAccount, 10, 10)
            : transferState.toSubAccount}
        </p>
        <p className="opacity-50 text-md">{middleTruncation(transferState.toPrincipal, 20, 20)}</p>
      </div>
    </div>
  );

  function onRemoveReceiver() {
    // TODO: clear receiver details and return to the TransferForm
    // clearReceiverAction();
    // setIsInspectDetailAction(false);
  }
}

function ToContactDisplay() {
  const { transferState } = useTransfer();
  const contacts = useAppSelector((state) => state.contacts.contacts);

  return (
    <div className="relative flex px-3 py-2 border rounded-md text-black-color dark:text-secondary-color-1-light border-slate-color-success dark:bg-secondary-color-2 bg-secondary-color-1-light">
      <CloseIcon
        className="absolute top-0 right-0 mt-1 mr-1 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={onRemoveReceiver}
      />
      <div className="mr-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-color-success">
          <CheckIcon className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="text-start">
        <p className="text-md">
          {getContact()?.name} [{transferState.toSubAccount}]
        </p>
        <p className="opacity-50 text-md">{middleTruncation(transferState.toPrincipal, 20, 20)}</p>
      </div>
    </div>
  );

  function getContact() {
    const contact = contacts.find((contact) => contact.principal === transferState.toPrincipal);
    if (!contact) logger.debug("Contact not found in contacts list.");
    return contact;
  }

  function onRemoveReceiver() {
    // TODO: clear receiver details and return to the TransferForm
  }
}

function ToOwnDisplay() {
  const { transferState } = useTransfer();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  return (
    <div className="flex justify-start w-full p-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light">
      <div className="flex items-center justify-center">
        <AvatarEmpty title={getSubaccount().name} className="mr-2" size="large" />
      </div>
      <div className="text-start text-black-color dark:text-secondary-color-1-light">
        <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{getSubaccount().name}</p>
        <div className="flex">
          <img src={getIconSrc(getAsset().logo, getAsset().symbol)} className="w-4 h-4 mr-2" alt="" />
          <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {getSubaccount().amount} {getAsset().symbol}
          </p>
        </div>
      </div>
    </div>
  );

  function getAsset(): Asset {
    if (!currentAsset) {
      logger.debug("Asset not found in assets list.");

      return {
        logo: "",
        tokenSymbol: "",
        address: "",
        decimal: "",
        name: "",
        symbol: "",
        shortDecimal: "",
        sortIndex: 0,
        subAccounts: [],
        supportedStandards: [],
        tokenName: "",
        index: "",
      };
    }

    return currentAsset;
  }

  function getSubaccount(): SubAccount {
    if (!currentAsset) {
      logger.debug("ReceiverDetails: asset not found in assets list.");
      return defaultSubAccount;
    }

    const subAccount = currentAsset.subAccounts.find(
      (subAccount) => subAccount.sub_account_id === transferState.toSubAccount,
    );

    if (!subAccount) {
      logger.debug("ReceiverDetails: subAccount not found in asset subAccounts list.");
      return defaultSubAccount;
    }

    return subAccount;
  }
}
