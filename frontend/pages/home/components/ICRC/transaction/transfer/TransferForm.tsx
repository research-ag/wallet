import { ReactComponent as DownAmountIcon } from "@assets/svg/files/down-blue-arrow.svg";
//
import Receiver from "./Receiver";
import Sender from "./Sender";
import TransferAssetSelector from "./TransferAssetSelector";
import { useTranslation } from "react-i18next";
import { LoadingLoader } from "@components/loader";
import { BasicButton } from "@components/button";
import { useState } from "react";
import {
  isAllowanceGreaterThanFree,
  isAmountGreaterThanFee,
  isPrincipalValid,
  isSubAccountIdValid,
} from "@pages/home/helpers/validators";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";
import { useAppSelector } from "@redux/Store";
import logger from "@/common/utils/logger";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { TransactionDrawer } from "@/@types/transactions";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";

export default function TransferForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { transferState } = useTransfer();
  const { setView } = useTransferView();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [errorMessage, setErrorMessage] = useState<string>("no error");
  const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol);

  return (
    <div className="px-[1rem] pt-[1rem] space-y-[1rem]">
      <TransferAssetSelector />
      <Sender />
      <DownAmountIcon className="w-full mt-4" />
      <Receiver />

      <div className="flex items-center justify-end mt-6">
        <p className="mr-4 text-sm text-slate-color-error">{errorMessage}</p>
        {isLoading && <LoadingLoader className="mr-4" />}
        <BasicButton className="min-w-[5rem] mr-2 font-bold bg-secondary-color-2 text-md" onClick={onCancel}>
          {t("cancel")}
        </BasicButton>
        <BasicButton className="min-w-[5rem] font-bold bg-primary-color text-md" onClick={onNext}>
          {t("next")}
        </BasicButton>
      </div>
    </div>
  );

  async function onNext() {
    try {
      setIsLoading(false);
      setErrorMessage("");

      // const isAllowanceContact = transferState.fromType === TransferFromTypeEnum.allowanceContactBook;
      // const isAllowanceManual = transferState.fromType === TransferFromTypeEnum.allowanceManual;

      // commonValidations();
      // if (transferState.fromType === TransferFromTypeEnum.own) fromOwnSubaccountValidations();
      // if (isAllowanceContact || isAllowanceManual) await fromAllowanceValidations();
      // if (transferState.fromType === TransferFromTypeEnum.service) fromServiceValidations();

      setView(TransferView.CONFIRM_DETAIL);
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsLoading(false);
    }
  }

  function onCancel() {
    setTransactionDrawerAction(TransactionDrawer.NONE);
    // TODO: reset state of transfer form
  }

  function commonValidations() {
    if (!transferState.tokenSymbol) {
      setErrorMessage("Asset must be selected");
      throw new Error("Token symbol must be selected");
    }

    if (!isPrincipalValid(transferState.fromPrincipal)) {
      setErrorMessage("Invalid FROM details");
      throw new Error("isPrincipalValid: from principal must be valid and no empty");
    }

    if (!isPrincipalValid(transferState.toPrincipal)) {
      setErrorMessage("Invalid TO details");
      throw new Error("isPrincipalValid: to principal must be valid and no empty");
    }

    if (!isSubAccountIdValid(transferState.fromSubAccount)) {
      setErrorMessage("Invalid FROM details");
      throw new Error("isSubAccountIdValid: from sub account must be valid and no empty");
    }

    if (!isSubAccountIdValid(transferState.toSubAccount)) {
      setErrorMessage("Invalid TO details");
      throw new Error("isSubAccountIdValid: to sub account must be valid and no empty");
    }
  }

  function fromOwnSubaccountValidations() {
    if (!currentAsset) {
      setErrorMessage("Invalid asset selected");
      throw new Error("TransferForm: asset not found");
    }

    if (!isAmountGreaterThanFee(currentAsset, transferState.fromSubAccount)) {
      setErrorMessage("Subaccount does not cover the fee");
      throw new Error("isAmountGreaterThanFee: subaccount amount must be greater than fee");
    }

    // --------------- OWN TO OWN SUB ACCOUNT ---------------
    if (transferState.toType === TransferToTypeEnum.own) {
      if (transferState.fromSubAccount === transferState.toSubAccount) {
        setErrorMessage("Subaccounts must be different");
        throw new Error("fromOwnSubaccountValidations: sub accounts must be differents");
      }

      if (transferState.fromPrincipal !== transferState.toPrincipal) {
        setErrorMessage("From and To principals must be the same");
        throw new Error("fromOwnSubaccountValidations: principals must be same");
      }

      if (transferState.fromPrincipal !== userPrincipal.toString()) {
        setErrorMessage("From principal must be the session principal");
        throw new Error("fromOwnSubaccountValidations: from principal must be the session principal");
      }
    }

    // --------------- OWN TO MANUAL / ICRC / SCANNER ---------------
    const isToManual = transferState.toType === TransferToTypeEnum.manual;
    const isToIcrc = transferState.toType === TransferToTypeEnum.thirdPartyICRC;
    const isToScanner = transferState.toType === TransferToTypeEnum.thidPartyScanner;

    if (isToManual || isToIcrc || isToScanner) {
      if (transferState.toPrincipal === userPrincipal.toString()) {
        if (transferState.fromSubAccount === transferState.toSubAccount) {
          setErrorMessage("Subaccounts must be different");
          throw new Error("fromOwnSubaccountValidations: sub accounts must be differents");
        }
      }
    }

    // -------------- OWN TO THIRD SERVICE ---------------
  }

  async function fromAllowanceValidations() {
    if (!currentAsset) {
      setErrorMessage("Invalid asset selected");
      throw new Error("TransferForm: asset not found");
    }

    // case 1: from principal must be different to the session principal
    if (transferState.fromPrincipal === userPrincipal.toString()) {
      setErrorMessage("Self allowance not allowed");
      throw new Error("fromAllowanceValidations: from principal must be different to session principal");
    }

    // case 2: allowance balance must be greater than the transaction fee
    const isAllowanceGreater = await isAllowanceGreaterThanFree(currentAsset, {
      allocatorPrincipal: transferState.fromPrincipal,
      allocatorSubaccount: transferState.fromSubAccount,
      assetAddress: currentAsset.address,
      assetDecimal: currentAsset.decimal,
      spenderPrincipal: userPrincipal.toString(),
    });

    if (!isAllowanceGreater) {
      setErrorMessage("Allowance does not cover the fee");
      throw new Error("isAllowanceGreaterThanFree: allowance amount must be greater than fee");
    }

    // -------------- ALLOWANCE TO MANUAL / ICRC / SCANNER / CONTACT ---------------
    const isToManual = transferState.toType === TransferToTypeEnum.manual;
    const isToIcrc = transferState.toType === TransferToTypeEnum.thirdPartyICRC;
    const isToScanner = transferState.toType === TransferToTypeEnum.thidPartyScanner;
    const isToContact = transferState.toType === TransferToTypeEnum.thirdPartyContact;

    if (isToManual || isToIcrc || isToScanner || isToContact) {
      // case 1: fromPrincipal must be different to toPrincipal
      if (transferState.fromPrincipal === transferState.toPrincipal) {
        if (transferState.fromSubAccount === transferState.toSubAccount) {
          setErrorMessage("FROM subaccount and TO subaccount must be different");
          throw new Error("fromAllowanceValidations: sub accounts must be differents");
        }
      }
    }

    // -------------- ALLOWANCE TO THIRD SERVICE ---------------
  }

  function fromServiceValidations() {
    // -------------- SERVICE COMMON VALIDATIONS ---------------
    //
    // case 1: service account balance must be greater than the transaction fee
    // -------------- SERVICE TO OWN ---------------
    //
    // above validations are enough
    // No manual allowed
    // No third icrc allowed
    // No third scanner allowed
    // No third contact allowed
    // No third service allowed
  }
}
