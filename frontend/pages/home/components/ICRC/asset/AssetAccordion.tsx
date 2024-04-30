import { useAppSelector } from "@redux/Store";
import * as Accordion from "@radix-ui/react-accordion";
import { Asset } from "@redux/models/AccountModels";

interface AssetAccordion {
  searchKey: string;
};

export default function AssetAccordion(props: AssetAccordion) {
  const { searchKey } = props;
  const { assets } = useAppSelector((state) => state.asset);

  return (
    <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light">
      <Accordion.Root type="multiple" defaultValue={[]}>
        {assets.map((currentAsset: Asset) => {

          const cleanSearchKey = searchKey.toLocaleLowerCase().trim();

          return <p key={currentAsset.tokenSymbol}>Hello world</p>
        })}
      </Accordion.Root>
    </div>
  );
};
