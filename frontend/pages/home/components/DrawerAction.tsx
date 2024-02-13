import { DrawerOption, DrawerOptionEnum } from "@/const";

// svgs
import CloseIcon from "@assets/svg/files/close.svg?react";
import { CustomButton } from "@components/Button";
//
import { Fragment } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

interface DrawerActionProps {
  drawerOption: DrawerOption;
  setDrawerOption(value: DrawerOption): void;
  setDrawerOpen(value: boolean): void;
  children: any;
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
      <div className="flex flex'row justify-between items-center w-full">
        <div className="flex flex-row w-full justify-start items-center gap-4">
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
