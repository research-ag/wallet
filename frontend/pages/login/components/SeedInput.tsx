import { ChangeEvent, useState } from "react";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { CustomInput } from "@components/input";
import { handleSeedAuthenticated } from "@redux/CheckAuth";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

export default function SeedInput() {
  const [seed, setSeed] = useState("");
  const { t } = useTranslation();

  return (
    <CustomInput
      sizeInput={"medium"}
      intent={"secondary"}
      compOutClass=""
      value={seed}
      onChange={onSeedChange}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      sufix={
        <div className="flex flex-row items-center justify-start gap-2">
          <CheckIcon
            onClick={() => {
              handleSeedAuthenticated(seed);
            }}
            className={getCheckIconStyles(seed)}
          />
          <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("max")} 32</p>
        </div>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSeedAuthenticated(seed);
      }}
    />
  );

  function onSeedChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 32) setSeed(e.target.value);
  }
}

function getCheckIconStyles(seed: string) {
  return clsx(
    "w-4 h-4 opacity-50 cursor-pointer",
    seed.length >= 0 ? "stroke-BorderSuccessColor" : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
