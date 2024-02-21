import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { CustomInput } from "@components/Input";
import { handleMnemonicAuthenticated } from "@redux/CheckAuth";
import clsx from "clsx";
import { ChangeEvent, Dispatch, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface MnemonicInputProps {
  phrase: string;
  setPhrase: Dispatch<SetStateAction<string>>;
}

export default function MnemonicInput({ phrase, setPhrase }: MnemonicInputProps) {
  const { t } = useTranslation();

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
        <div className="flex flex-row items-center justify-start gap-2">
          <CheckIcon onClick={onLoginWithPhase} className={getCheckIconStyles(phrase)} />
          <p className="text-sm w-fit text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            Words {phrase.split(" ").length}
          </p>
        </div>
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") onLoginWithPhase();
      }}
    />
  );

  function onLoginWithPhase() {
    const sanitizedPhrase = getSanitizedPhrase(phrase);
    const fullPhrase = sanitizedPhrase.join(" ");
    console.log("isValid: ", isValid);
    if (isValid) {
      console.log("Login with phrase: ", fullPhrase);
      return;
      // handleMnemonicAuthenticated(fullPhrase);
    }
    console.log("phrase is not valid for login");
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
  return phrase
    .trim()
    .replace(/\s{2, }/g, " ")
    .split(" ");
}

function getCheckIconStyles(phrase: string) {
  return clsx(
    "w-4 h-4 opacity-50 cursor-pointer",
    phrase.length > 0 ? "stroke-BorderSuccessColor" : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
