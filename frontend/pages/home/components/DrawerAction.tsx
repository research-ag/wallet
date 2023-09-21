// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { clsx } from "clsx";
import { DrawerOption, DrawerOptionEnum } from "@/const";

interface DrawerActionProps {
  drawerOption: DrawerOption;
  setDrawerOption(value: DrawerOption): void;
  setDrawerOpen(value: boolean): void;
  children: any;
}

const DrawerAction = ({ drawerOption, setDrawerOption, setDrawerOpen, children }: DrawerActionProps) => {
  const { t } = useTranslation();

  const chechEqId = (option: DrawerOption) => {
    return drawerOption === option;
  };

  const selectedButton = "border-AccpetButtonColor";
  const unselectedButton = "text-PrimaryTextColorLight dark:text-PrimaryTextColor";

  const customSend = clsx(chechEqId(DrawerOptionEnum.Enum.SEND) ? selectedButton : unselectedButton);
  const customReceive = clsx(chechEqId(DrawerOptionEnum.Enum.RECEIVE) ? selectedButton : unselectedButton);
  // const customWrap = clsx(chechEqId(DrawerOptionEnum.Enum.WRAP) ? selectedButton : unselectedButton);

  const drawerOptions = [
    { name: "send", style: customSend, type: DrawerOptionEnum.Enum.SEND },
    { name: "receive", style: customReceive, type: DrawerOptionEnum.Enum.RECEIVE },
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
};

export default DrawerAction;
