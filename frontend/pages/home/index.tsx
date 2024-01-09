// svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
//
import { Fragment } from "react";
import AssetsList from "./components/AssetsList";
import "./style.scss";
import DetailList from "./components/DetailList";
import Modal from "@components/Modal";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { CustomButton } from "@components/Button";
import { setDisclaimer } from "@redux/auth/AuthReducer";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { disclaimer } = useAppSelector((state) => state.auth);

  return (
    <Fragment>
      <div className="flex flex-row w-full h-full">
        <AssetsList></AssetsList>
        <DetailList></DetailList>
      </div>
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
    </Fragment>
  );
};

export default Home;
