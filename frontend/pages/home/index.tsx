import "./style.scss";
import { Fragment } from "react";
import AssetsList from "./components/ICRC/asset";
import DetailList from "./components/ICRC/transaction";

const Home = () => {
  return (
    <Fragment>
      <div className="flex flex-row w-full h-full">
        <AssetsList />
        <DetailList />
      </div>
    </Fragment>
  );
};

export default Home;
