import { Fragment } from "react";

import DisclaimerModal from "@pages/home/components/DisclaimerModal";

import AssetsList from "./components/AssetsList";
import DetailList from "./components/DetailList";

import "./style.scss";

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
