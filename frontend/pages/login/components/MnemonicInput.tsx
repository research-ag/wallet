import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { CustomInput } from "@components/Input";
import { handleMnemonicAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface MnemonicInputProps {
  phrase: string;
  setPhrase: Dispatch<SetStateAction<string>>;
}

export default function MnemonicInput({ phrase, setPhrase }: MnemonicInputProps) {
  const { t } = useTranslation();
  const [isError, setIsError] = useState(false);
  const isValid = useMemo(() => isPhraseValid(phrase), [phrase]);

  return (
    <CustomInput
      sizeInput={"medium"}
      intent={"secondary"}
      placeholder={t("login.mnemonic.expected")}
      value={phrase}
      onChange={onPhraseChange}
      autoFocus
      sufix={
        <div className="flex flex-row items-center justify-start gap-1">
          <CheckIcon onClick={onLoginWithPhase} className={getCheckIconStyles(!isError && isValid)} />
          <p className="text-sm min-w-[4rem] text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            Words {getSanitizedPhrase(phrase).length > 0 ? getSanitizedPhrase(phrase).split(" ").length : 0}
          </p>
        </div>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") onLoginWithPhase();
      }}
    />
  );

  function onLoginWithPhase() {
    try {
      setIsError(false);
      const sanitizedPhrase = getSanitizedPhrase(phrase);
      if (isValid) {
        handleMnemonicAuthenticated(sanitizedPhrase);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  }

  function onPhraseChange(e: ChangeEvent<HTMLInputElement>) {
    setPhrase(e.target.value);
  }

  function isPhraseValid(phrase: string) {
    const sanitizedPhrase = getSanitizedPhrase(phrase);
    if (!(sanitizedPhrase.length > 0) || phrase.length === 0) return false;
    return true;
  }
}

function getSanitizedPhrase(phrase: string) {
  const chunks = phrase.split(" ");
  const cleanedChunks = chunks.filter((chunk) => chunk.trim() !== "");
  return cleanedChunks.join(" ");
}

function getCheckIconStyles(isSuccess: boolean) {
  return clsx(
    "w-4 h-4 opacity-50 cursor-pointer",
    isSuccess ? "stroke-BorderSuccessColor" : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
