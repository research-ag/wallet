import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import { middleTruncation } from "@common/utils/strings";
import { AvatarEmpty } from "@components/avatar";
import { getIconSrc } from "@common/utils/icons";
import { Asset } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";
import { getAllowanceDetails } from "@common/libs/icrcledger/icrcAllowance";

export default function SenderDetails() {
  const { t } = useTranslation();
  const { transferState } = useTransfer();
  const services = useAppSelector((state) => state.services.services);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);

  const isSenderService = transferState.fromType === TransferFromTypeEnum.service;
  const isSenderAllowance = transferState.fromType === TransferFromTypeEnum.allowance;

  //
  const assets = useAppSelector((state) => state.asset.list.assets);
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);
  const [balance, setBalance] = useState("");

  //
  useEffect(() => {
    getAllowanceAmount();
  }, []);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {`${t("from")} ${isSenderService ? t("service") : ""}`}
      </p>

      {isSenderService && (
        <div className="flex flex-col items-center justify-start w-full gap-1 px-4 py-2 rounded-md dark:bg-secondary-color-2 bg-secondary-color-1-light text-start text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70 text-md">
          <div className="flex flex-row items-center justify-between w-full">
            <p>{t("name")}</p>
            <p>{getServiceName()}</p>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <p>{t("principal")}</p>
            <p>{transferState.fromPrincipal}</p>
          </div>
          <div className="flex flex-row items-center justify-between w-full">
            <p>{t("subaccount")}</p>
            <p>{middleTruncation(transferState.fromSubAccount, 7, 5)}</p>
          </div>
        </div>
      )}

      {!isSenderService && isSenderAllowance && (
        <div className="flex justify-start w-full p-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light">
          <div className="flex items-center justify-center">
            <AvatarEmpty title={getSubaccountName()} className="mr-2" size="large" />
          </div>
          <div className="text-start text-black-color dark:text-secondary-color-1-light">
            <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{getSubaccountName()}</p>
            <div className="flex">
              <img src={getIconSrc(getAsset().logo, getAsset().symbol)} className="w-4 h-4 mr-2" alt="" />
              <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {balance} {getAsset().symbol}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isSenderService && !isSenderAllowance && (
        <div className="px-4 py-2 border rounded-md border-gray-color-2 dark:bg-secondary-color-2 bg-secondary-color-1-light text-start">
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            {middleTruncation(transferState.fromPrincipal, 15, 15)} {transferState.fromSubAccount}
          </p>
          <div className="flex items-center justify-start">
            <img src={getIconSrc(getAsset().logo, getAsset().tokenSymbol)} className="w-4 h-4 mr-2" alt="" />
            <p className="opacity-50 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {balance} {getAsset().symbol}
            </p>
          </div>
        </div>
      )}
    </>
  );

  function getServiceName() {
    const service = services.find((service) => service.principal === transferState.fromPrincipal);
    if (!service) logger.debug("Service not found in services list.");
    return service?.name;
  }

  // --

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

  function getSubaccountName() {
    const contact = contacts.find((contact) => contact.principal === transferState.fromPrincipal);

    if (!contact) {
      logger.debug("Contact not found in contacts list.");
      return "";
    }

    const subaccount = contact.accounts.find(
      (account) =>
        account.subaccountId === transferState.fromSubAccount && account.tokenSymbol === transferState.tokenSymbol,
    );

    if (!subaccount) {
      logger.debug("Subaccount not found in contact accounts list.");
      return "";
    }

    return subaccount.name;
  }

  async function getAllowanceAmount() {
    try {
      if (!currentAsset) {
        logger.debug("Asset not found in assets list.");
        setBalance("0");
        return;
      }

      const allowance = await getAllowanceDetails({
        allocatorPrincipal: transferState.fromPrincipal,
        allocatorSubaccount: transferState.fromSubAccount,
        assetAddress: currentAsset.address,
        assetDecimal: currentAsset.decimal,
        spenderPrincipal: userPrincipal.toString(),
      });

      setBalance(allowance.amount || "0");
    } catch (error) {
      logger.debug(error);
      setBalance("0");
    }
  }
}
