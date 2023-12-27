import { Fragment } from "react";
import AssetsList from "./components/asset/AssetsList";
import DetailList from "./components/DetailList";

import "./style.scss";

const Home = () => {
  return (
    <Fragment>
      <div className="flex flex-row w-full h-full">
        <AssetsList />
        <DetailList />
      </div>
      {/* <DisclaimerModal /> */}
    </Fragment>
  );
};

export default Home;
