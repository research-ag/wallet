// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { ThemeHook } from "@pages/hooks/themeHook";
import { DbLocationHook } from "@pages/hooks/dbLocationHook";
import { setCustomDbCanisterId } from "@/redux/auth/AuthReducer";
import { CustomInput } from "@components/input";
import { ThemesEnum } from "@/common/const";
import { db, DB_Type } from "@/database/db";
import store from "@/redux/Store";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";

interface DbLocationModalProps {
  setOpen(value: boolean): void;
}

const DbLocationModal = ({ setOpen }: DbLocationModalProps) => {
  const { t } = useTranslation();

  const { theme } = ThemeHook();
  const { changeDbLocation, dbLocation } = DbLocationHook();
  const [canisterId, setCanisterId] = useState(db().getCustomDbCanisterId() || "");
  const [canisterIdErr, setCanisterIdErrErr] = useState(false);

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between w-full mb-2 top-modal">
        <p className="font-bold text-[1.15rem]">{t("database.location")}</p>
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <p className="mb-2 font-light">{t("database.modal.msg")}</p>
      <div
        className={clsx(themeBox, "bg-ThemeColorSelectorLight", "border-BorderColor")}
        onClick={() => {
          handleChange(DB_Type.LOCAL);
        }}
      >
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
        >
          <RadioGroup.Root
            value={dbLocation}
            onChange={() => {
              handleChange(DB_Type.LOCAL);
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.light ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
                }`}
                value={DB_Type.LOCAL}
                id="r-local"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t("database.localStorage")}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
      </div>
      <div className={clsx(themeBox, "bg-ThemeColorSelector", "border-BorderColor")}>
        <div
          className={clsx(option, optionBottom, "border-BorderColor", "bg-PrimaryColorLight", "dark:bg-PrimaryColor")}
          onClick={() => {
            handleChange(DB_Type.CANISTER);
          }}
        >
          <RadioGroup.Root
            value={dbLocation}
            onChange={() => {
              handleChange(DB_Type.CANISTER);
            }}
          >
            <div className="flex flex-row items-center p-3">
              <RadioGroup.Item
                className={`w-5 h-5 rounded-full border-2  outline-none p-0 ${
                  theme === ThemesEnum.enum.light ? "border-RadioCheckColor" : "border-RadioNoCheckColorLight"
                }`}
                value={DB_Type.CANISTER}
                id="r-rxdb"
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-3 after:h-3 after:rounded-full after:bg-RadioCheckColor" />
              </RadioGroup.Item>
              <p className="ml-4 opacity-50 text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                {t("database.canister")}
              </p>
            </div>
          </RadioGroup.Root>
        </div>
        {dbLocation === DB_Type.CANISTER && (
          <CustomInput
            intent={"primary"}
            placeholder="Canister ID (optional)"
            value={canisterId}
            onKeyUp={onKeyUp}
            onChange={onChangeCanisterId}
            border={(canisterIdErr && "error") || undefined}
          />
        )}
      </div>
    </Fragment>
  );

  function handleChange(location: DB_Type) {
    changeDbLocation(location);
    db().setDbLocation(location);
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!canisterIdErr && e.nativeEvent.key === "Enter") {
      db().setCustomDbCanisterId(canisterId);
      store.dispatch(setCustomDbCanisterId(canisterId));
      setOpen(false);
    }
  }

  function onChangeCanisterId({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setCanisterId(value);
    try {
      !!value && decodeIcrcAccount(value);
      setCanisterIdErrErr(false);
    } catch {
      setCanisterIdErrErr(true);
    }
  }
};

export default DbLocationModal;

// Tailwind CSS constants
const themeBox = clsx("flex", "flex-col", "w-full", "border", "rounded-lg", "mb-4", "p-0", "overflow-hidden");
const option = clsx("w-full", "flex", "flex-row", "justify-start", "items-center", "p-4");
const optionBottom = clsx("py-0", "border-t");
