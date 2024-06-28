import { TransactionDrawer } from "@/@types/transactions";
import { CustomButton } from "@components/button";
import { BasicDrawer } from "@components/drawer";
import { useAppSelector } from "@redux/Store";
import { setTransactionDrawerAction } from "@redux/transaction/TransactionActions";
import { useTranslation } from "react-i18next";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { DrawerOptionEnum } from "@/common/const";
import DrawerReceive from "@/pages/home/components/ICRC/transaction/DrawerReceive";
// eslint-disable-next-line
import clsx from "clsx";
import { useMemo } from "react";
import Transfer from "@/pages/home/components/ICRC/transaction/transfer";
import { TransferFromTypeEnum, TransferToTypeEnum, useTransfer } from "@pages/home/contexts/TransferProvider";

const selectedButton = "border-AccpetButtonColor";
const unselectedButton = "text-PrimaryTextColorLight dark:text-PrimaryTextColor";

export default function SendReceiveDrawer() {
  const { setTransferState } = useTransfer();
  const { transactionDrawer } = useAppSelector((state) => state.transaction);
  const { watchOnlyMode } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const isDrawerOpen = useMemo(() => {
    return Boolean(transactionDrawer === TransactionDrawer.SEND || transactionDrawer === TransactionDrawer.RECEIVE);
  }, [transactionDrawer]);

  return (
    <BasicDrawer isDrawerOpen={isDrawerOpen}>
      <div className="relative flex items-center justify-between w-full px-6 mt-8 row">
        <div className="flex flex-row items-center justify-start w-full gap-4">
          {!watchOnlyMode && (
            <CustomButton
              intent={"noBG"}
              border={"underline"}
              className={`!font-light ${customSend()}`}
              onClick={() => setTransactionDrawerAction(TransactionDrawer.SEND)}
            >
              <p>{t("transfer")}</p>
            </CustomButton>
          )}

          <CustomButton
            intent={"noBG"}
            border={"underline"}
            className={`!font-light ${customReceive()}`}
            onClick={() => setTransactionDrawerAction(TransactionDrawer.RECEIVE)}
          >
            <p>{t("deposit")}</p>
          </CustomButton>
        </div>

        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setTransferState({
              tokenSymbol: "",
              fromType: TransferFromTypeEnum.own,
              fromPrincipal: "",
              fromSubAccount: "",
              toType: TransferToTypeEnum.thirdPartyICRC,
              toPrincipal: "",
              toSubAccount: "",
              amount: "",
              usdAmount: "",
              duration: "",
            });
            setTransactionDrawerAction(TransactionDrawer.NONE);
          }}
        />
      </div>

      {transactionDrawer === DrawerOptionEnum.Enum.SEND && <Transfer />}
      {transactionDrawer === DrawerOptionEnum.Enum.RECEIVE && <DrawerReceive />}
    </BasicDrawer>
  );

  function customSend() {
    return clsx(chechEqId(TransactionDrawer.SEND) ? selectedButton : unselectedButton);
  }

  function customReceive() {
    return clsx(chechEqId(TransactionDrawer.RECEIVE) ? selectedButton : unselectedButton);
  }

  function chechEqId(option: TransactionDrawer) {
    return transactionDrawer === option;
  }
}
