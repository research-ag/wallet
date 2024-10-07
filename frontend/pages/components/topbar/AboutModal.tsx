// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import generatedGitInfo from "../../../generatedGitInfo.json";
import { CustomCopy } from "@components/tooltip";

interface AboutModalProps {
  setOpen(value: boolean): void;
}

const AboutModal = ({ setOpen }: AboutModalProps) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="flex flex-row items-center justify-between w-full mb-2 top-modal">
        <p className="font-bold text-[1.15rem]">{t("About")}</p>
        <CloseIcon
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor mt-[-0.5rem]"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <div className="flex flex-col justify-start items-start w-full gap-3 text-md">
        <div className="flex flex-row justify-start items-start w-full">
          <p className="w-[4rem]">{t("version")}:</p>
          <div className="flex flex-row justify-between items-center w-[12.5rem]">
            <p className="break-words w-[12rem]">{generatedGitInfo.gitCommitHash}</p>
            <CustomCopy size={"small"} copyText={generatedGitInfo.gitCommitHash} />
          </div>
        </div>
        <div className="flex flex-row justify-start items-start">
          <p className="w-[4rem]">Build:</p>
          <p>
            {generatedGitInfo.dateString} {generatedGitInfo.hourString}
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default AboutModal;
