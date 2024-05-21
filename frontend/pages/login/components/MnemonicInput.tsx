import { clsx } from "clsx";
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { CustomInput } from "@components/input";
import { handleMnemonicAuthenticated } from "@redux/CheckAuth";
import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as bip39 from "bip39";
import logger from "@/common/utils/logger";

export default function MnemonicInput() {
  const [phrase, setPhrase] = useState("");

  const { t } = useTranslation();
  const [isError, setIsError] = useState(false);

  const wordList = useMemo(() => {
    let words: string[] = [];

    for (const key in bip39.wordlists) {
      words = words.concat(bip39.wordlists[key]);
    }

    return words;
  }, []);

  const isValid = useMemo(() => isPhraseValid(phrase), [phrase]);

  return (
    <CustomInput
      sizeInput={"medium"}
      intent={"secondary"}
      placeholder={t("login.mnemonic.expected")}
      value={phrase}
      onChange={onPhraseChange}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      sufix={
        <div className="flex flex-row items-center justify-start gap-1">
          <CheckIcon onClick={onLoginWithPhase} className={getCheckIconStyles(!isError && isValid)} />
          <p className="text-sm min-w-[4rem] text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            Words {getWords(phrase).length > 0 ? getWords(phrase).length : 0}
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
      const sanitizedPhrase = getWords(phrase);
      if (isValid) {
        handleMnemonicAuthenticated(sanitizedPhrase);
      }
    } catch (error) {
      logger.debug(error);
      setIsError(true);
    }
  }

  function onPhraseChange(e: ChangeEvent<HTMLInputElement>) {
    setPhrase(e.target.value);
  }

  function isPhraseValid(phrase: string) {
    const sanitizedPhrase = getWords(phrase);

    if (sanitizedPhrase.length === 0) return false;

    for (const word of sanitizedPhrase) {
      if (!wordList.includes(word)) {
        return false;
      }
    }

    return true;
  }
}

function getWords(phrase: string): string[] {
  const chunks = phrase.split(" ");
  return chunks.filter((chunk) => chunk.trim() !== "");
}

function getCheckIconStyles(isSuccess: boolean) {
  return clsx(
    "w-4 h-4 opacity-50 cursor-pointer",
    isSuccess ? "stroke-BorderSuccessColor" : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
  );
}
