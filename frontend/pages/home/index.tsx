import "./style.scss";
import AssetsList from "./components/ICRC/asset";
import DetailList from "./components/ICRC/transaction";

const Home = () => {
  return (
    <div className="flex flex-row w-full h-full">
      <AssetsList />
      <DetailList />
    </div>
  );
};

export default Home;
