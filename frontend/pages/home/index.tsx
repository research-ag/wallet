import "./style.scss";
// svgs
// import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
//
import { Fragment } from "react";
import AssetsList from "./components/AssetsList";
// import DetailList from "./components/DetailList";
// import { BasicModal } from "@components/modal";
// import { useTranslation } from "react-i18next";
// import { useAppDispatch, useAppSelector } from "@redux/Store";
// import { CustomButton } from "@components/button";
// import { setDisclaimer } from "@redux/auth/AuthReducer";

const Home = () => {
  // const { t } = useTranslation();
  // const dispatch = useAppDispatch();
  // const { disclaimer } = useAppSelector((state) => state.auth);

  return (
    <Fragment>
      <div className="flex flex-row w-full h-full">
        <AssetsList></AssetsList>
        {/* <DetailList></DetailList> */}
      </div>
      {/* <BasicModal open={disclaimer} width="w-[30rem]">
        <div className="flex flex-col items-start justify-start w-full gap-4">
          <div className="flex items-center justify-start gap-4 fle-row">
            <WarningIcon className="w-6 h-6" />
            <p className="font-semibold">{t("disclaimer.title")}</p>
          </div>
          <p className="text-justify ">{t("disclaimer.msg")}</p>
          <div className="flex flex-row items-start justify-end w-full ">
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
      </BasicModal> */}
    </Fragment>
  );
};

export default Home;
