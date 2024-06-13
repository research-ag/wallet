import { BasicButton } from "@components/button";
import { LoadingLoader } from "@components/loader";
import { TransferFromTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logger from "@/common/utils/logger";
import SenderDetails from "./SenderDetail";
import ReceiverDetails from "./ReceiverDetails";

export default function TransferDetailsConfirmation() {
  const { t } = useTranslation();
  const { transferState } = useTransfer();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <SenderDetails />
      <ReceiverDetails />

      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-md text-slate-color-error">{errorMessage}</p>
        {isLoading && <LoadingLoader color="dark:border-secondary-color-1-light border-black-color mr-2" />}
        <BasicButton className="w-1/6 mr-2 font-bold bg-secondary-color-2" onClick={onBack}>
          {t("back")}
        </BasicButton>
        <BasicButton className="w-1/6 font-bold bg-primary-color" onClick={onTransfer}>
          {t("submit")}
        </BasicButton>
      </div>
    </div>
  );

  function onBack() {
    // clear the details amout errors
    // return to the TransferForm
  }

  function onTransfer() {
    // validate amout was filled
    // validate amout is more than 0

    // case 1: if fromType is allowance
    if (transferState.fromType === TransferFromTypeEnum.allowance) {
      transferFromAllowance();
    }

    // case 2: if fromType is own
    if (transferState.fromType === TransferFromTypeEnum.own) {
      transferFromOwn();
    }

    // case 3: if fromType is service
    if (transferState.fromType === TransferFromTypeEnum.service) {
      transferFromService();
    }
  }

  async function validateAllowanceAmount() {
    // allowance account balance
    // allowance amount assigned
    // free
    // user input amount
    // case 1: allowance amount assigned === 0
    // case 2: user input amount + fee <= allowance account assigned
    // case 3: user input amount + free <= allowance account balance
    // CASE SERVICE
    // case 1: if receiver is service, verify cover the minimun amount deposit
  }

  async function transferFromAllowance() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      validateAllowanceAmount();
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function validateOwnAmount() {
    // case 1: input user amount + fee <= own subaccount balance
    // CASE SERVICE
    // case 3 if (receiver is service) verify cover the minimun amount deposit
  }

  async function transferFromOwn() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      validateOwnAmount();
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function validateServiceAmount() {
    // case 1: input user amount + fee <= own subaccount balance
    // CASE SERVICE
    // case 1 if (sender is service) verify cover the minimun amount deposit
  }

  async function transferFromService() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      validateServiceAmount();
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsLoading(false);
    }
  }
}
