// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { clsx } from "clsx";
import { DrawerOption, DrawerOptionEnum } from "@/const";
import { resetSendStateAction } from "@redux/transaction/TransactionActions";

interface Option {
  name: string;
  type: DrawerOption;
  disabled?: boolean;
}
interface DrawerActionProps extends PropsWithChildren {
  drawerOption: DrawerOption;
  setDrawerOption(value: DrawerOption): void;
  setDrawerOpen(value: boolean): void;
  options?: Array<Option>;
}

const DrawerAction = ({ drawerOption, setDrawerOption, setDrawerOpen, children }: DrawerActionProps) => {
  const { t } = useTranslation();

  const selectedButton = "border-AccpetButtonColor";
  const unselectedButton = "text-PrimaryTextColorLight dark:text-PrimaryTextColor";
  const drawerOptions = [
    { name: "send", style: customSend(), type: DrawerOptionEnum.Enum.SEND },
    { name: "receive", style: customReceive(), type: DrawerOptionEnum.Enum.RECEIVE },
    // { name: "wrap", style: customWrap, type: DrawerOptionEnum.Enum.WRAP },
  ];

  return (
    <Fragment>
      <div className="flex items-center justify-between w-full row">
        <div className="flex flex-row items-center justify-start w-full gap-4">
          {drawerOptions.map((dOpt, k) => {
            return (
              <CustomButton
                key={k}
                intent={"noBG"}
                border={"underline"}
                className={`!font-light ${dOpt.style}`}
                onClick={() => {
                  setDrawerOption(dOpt.type);
                }}
              >
                <p>{t(dOpt.name)}</p>
              </CustomButton>
            );
          })}
        </div>
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setDrawerOpen(false);
            resetSendStateAction();
          }}
        />
      </div>

      {children}
    </Fragment>
  );

  function chechEqId(option: DrawerOption) {
    return drawerOption === option;
  }

  function customSend() {
    return clsx(chechEqId(DrawerOptionEnum.Enum.SEND) ? selectedButton : unselectedButton);
  }
  function customReceive() {
    return clsx(chechEqId(DrawerOptionEnum.Enum.RECEIVE) ? selectedButton : unselectedButton);
  }
};

export default DrawerAction;
