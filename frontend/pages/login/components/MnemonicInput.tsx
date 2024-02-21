import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { CustomInput } from "@components/Input";
import { handleMnemonicAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface MnemonicInputProps {
  phrase: string;
  setPhrase: Dispatch<SetStateAction<string>>;
}

export default function MnemonicInput({ phrase, setPhrase }: MnemonicInputProps) {
  const { t } = useTranslation();
  return (
    <CustomInput
      sizeInput={"medium"}
      intent={"secondary"}
      compOutClass=""
      placeholder={t("login.mnemonic.expected")}
      value={phrase}
      onChange={onPhraseChange}
      autoFocus
      sufix={
        <div className="flex flex-row items-center justify-start gap-2">
          <CheckIcon
            onClick={() => {
              handleMnemonicAuthenticated(phrase);
            }}
            className={getCheckIconStyles(phrase)}
          />
          <p className="text-sm w-fit min-w-[4rem] text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            Words {phrase.split(" ").length}
          </p>
        </div>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") handleMnemonicAuthenticated(phrase);
      }}
    />
  );
  function onPhraseChange(e: ChangeEvent<HTMLInputElement>) {
    const fullPhrase = e.target.value;

    // INFO: remove leading, ending and double spaces
    const sanitizedPhrase = fullPhrase
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");

    if (sanitizedPhrase.length < 12 || sanitizedPhrase.length > 24) {
      // TODO: Set error state and message
      console.log("phrase is less than 12 or more than 24");
    }

    const hasExcessivelyLongWord = sanitizedPhrase.some((word) => word.length > 100);
    if (hasExcessivelyLongWord) {
      console.warn("phrase has too long words");
      // TODO: set error "Individual words in the phrase cannot exceed 100 characters.");
    }

    // TODO: check if is it possible to use less 12 and more 24, what is it recommended

    console.log("final phrase: ", sanitizedPhrase.join(" "));
    setPhrase(sanitizedPhrase.join(" "));
  }
}

function getCheckIconStyles(phrase: string) {
  return clsx(
    "w-4 h-4 opacity-50 cursor-pointer",
    phrase.length > 0 ? "stroke-BorderSuccessColor" : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
