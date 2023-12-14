import { useTranslation } from "react-i18next";

import Modal from "@components/Modal";
import { CustomButton } from "@components/Button";
import { setDisclaimer } from "@redux/auth/AuthReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";

export default function DisclaimerModal() {
  const { disclaimer } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Modal open={disclaimer} width="w-[30rem]">
      <div className="flex flex-col w-full justify-start items-start gap-4">
        <div className="flex fle-row justify-start items-center gap-4">
          <WarningIcon className="w-6 h-6" />
          <p className="font-semibold">{t("disclaimer.title")}</p>
        </div>
        <p className=" text-justify">{t("disclaimer.msg")}</p>
        <div className="flex flex-row justify-end items-start w-full ">
          <CustomButton
            className="min-w-[5rem]"
            onClick={() => {
              dispatch(setDisclaimer(false));
            }}
            size={"small"}
          >
            <p>{t("agree")}</p>
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
