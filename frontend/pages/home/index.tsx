import { Fragment } from "react";
import AssetsList from "./components/AssetsList";
import "./style.scss";
import DetailList from "./components/DetailList";
import DisclaimerModal from "@pages/components/DisclaimerModal";

const Home = () => {
  return (
    <Fragment>
      <div className="flex flex-row w-full h-full">
        <AssetsList />
        <DetailList />
      </div>
      <DisclaimerModal />
    </Fragment>
  );
};

export default Home;
