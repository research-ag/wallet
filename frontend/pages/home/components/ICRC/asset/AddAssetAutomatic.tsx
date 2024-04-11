// svgs
import { AccountDefaultEnum, IconTypeEnum, TokenNetwork, TokenNetworkEnum } from "@/const";
import ChevIcon from "@assets/svg/files/chev-icon.svg";
//
import { CustomButton } from "@components/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { Asset } from "@redux/models/AccountModels";
import { getAssetIcon } from "@/utils/icons";

interface AddAssetAutomaticProps {
  setNetworkTOpen(value: boolean): void;
  networkTOpen: boolean;
  setNetwork(value: TokenNetwork): void;
  network: TokenNetwork;
  setNewAsset(value: Asset): void;
  newAsset: Asset;
  setAssetTOpen(value: boolean): void;
  addAssetToData(): void;
  assetTOpen: boolean;
  setValidToken(value: boolean): void;
  setErrToken(value: string): void;
  errToken: string;
  setManual(value: boolean): void;
  newAssetList: Asset[];
  assets: Asset[];
}

const AddAssetAutomatic = ({
  setNetworkTOpen,
  networkTOpen,
  setNetwork,
  network,
  setNewAsset,
  newAsset,
  setAssetTOpen,
  addAssetToData,
  assetTOpen,
  setValidToken,
  setErrToken,
  errToken,
  setManual,
  newAssetList,
  assets,
}: AddAssetAutomaticProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="flex flex-row items-center justify-start w-full gap-4">
        <div className="flex flex-col items-start justify-start w-1/2">
          <p className="w-full text-left opacity-60">{t("network")}</p>
          <DropdownMenu.Root
            onOpenChange={(e: boolean) => {
              setNetworkTOpen(e);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <div
                className={clsx(
                  networkBox,
                  "border-BorderColorLight dark:border-BorderColor",
                  "items-center",
                  "cursor-pointer",
                  "!w-full",
                  "pr-0",
                )}
              >
                <div>
                  <p>{network}</p>
                </div>
                <img
                  src={ChevIcon}
                  style={{ width: "2rem", height: "2rem" }}
                  alt="chevron-icon"
                  className={`${networkTOpen ? "rotate-90" : ""}`}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight w-[8rem] rounded-lg dark:bg-SecondaryColor z-[2000] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                sideOffset={2}
                align="end"
              >
                {TokenNetworkEnum.options.map((sa, idx) => {
                  return (
                    <DropdownMenu.Item
                      key={`net-${idx}`}
                      className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                        idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                      }`}
                      onSelect={() => {
                        onSelectNetwork(sa);
                      }}
                    >
                      <div className="flex flex-col items-start justify-center">
                        <p>{`${sa}`}</p>
                      </div>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div className="flex flex-col items-start justify-start w-full">
          <p className="w-full text-left opacity-60">{t("asset")}</p>
          <DropdownMenu.Root
            onOpenChange={(e: boolean) => {
              setAssetTOpen(e);
            }}
          >
            <DropdownMenu.Trigger asChild>
              <div
                className={clsx(
                  networkBox,
                  "border-BorderColorLight dark:border-BorderColor",
                  "items-center",
                  "cursor-pointer",
                  "!w-full",
                  "pr-0",
                )}
              >
                {newAsset.tokenSymbol != "" ? (
                  <div className="flex flex-row items-center justify-start">
                    {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.symbol, newAsset.logo)}
                    <p className="ml-3">{`${newAsset.tokenName}`}</p>
                  </div>
                ) : (
                  <p className="opacity-70">{t("adding.select")}</p>
                )}
                <img
                  src={ChevIcon}
                  style={{ width: "2rem", height: "2rem" }}
                  alt="chevron-icon"
                  className={`${assetTOpen ? "rotate-90" : ""}`}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight w-[16rem] max-h-96 overflow-auto rounded-lg dark:bg-SecondaryColor z-[2000] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                sideOffset={2}
                align="end"
              >
                {newAssetList.map((newAsset, idx) => {
                  const tokenFounded = assets.find((asst) => asst.tokenSymbol === newAsset.tokenSymbol);
                  if (!tokenFounded)
                    return (
                      <DropdownMenu.Item
                        key={`net-${idx}`}
                        className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                          idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                        }`}
                        onSelect={() => {
                          onSelectToken(newAsset);
                        }}
                      >
                        <div className="flex flex-row items-center justify-start">
                          {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.tokenSymbol, newAsset.logo)}
                          <p className="ml-3">{`${newAsset.tokenSymbol}`}</p>
                        </div>
                      </DropdownMenu.Item>
                    );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      {errToken !== "" && <p className="w-full text-sm text-right text-LockColor">{errToken}</p>}
      <div className="flex flex-row items-center justify-between w-full mt-2 mb-4">
        <CustomButton intent={"noBG"} className="!font-light !p-0 mt-3" onClick={onAddAssetManually}>
          {t("add.asset.manually")}
        </CustomButton>
        <CustomButton className="min-w-[5rem]" onClick={onAdd}>
          <p>{t("add")}</p>
        </CustomButton>
      </div>
    </div>
  );

  function onSelectNetwork(sa: TokenNetwork) {
    setNetwork(sa);
    if (sa !== network)
      setNewAsset({
        address: "",
        symbol: "",
        name: "",
        tokenName: "",
        tokenSymbol: "",
        decimal: "",
        shortDecimal: "",
        subAccounts: [
          {
            sub_account_id: "0x0",
            name: AccountDefaultEnum.Values.Default,
            amount: "0",
            currency_amount: "0",
            address: "",
            decimal: 0,
            symbol: "",
            transaction_fee: "",
          },
        ],
        index: "",
        sortIndex: 999,
        supportedStandards: [],
      });
  }

  function onSelectToken(newAsset: Asset) {
    setNewAsset(newAsset);
    setErrToken("");
    setValidToken(true);
  }

  function onAddAssetManually() {
    setManual(true);
    setNewAsset({
      address: "",
      symbol: "",
      name: "",
      tokenName: "",
      tokenSymbol: "",
      decimal: "",
      shortDecimal: "",
      subAccounts: [
        {
          sub_account_id: "0x0",
          name: AccountDefaultEnum.Values.Default,
          amount: "0",
          currency_amount: "0",
          address: "",
          decimal: 0,
          symbol: "",
          transaction_fee: "",
        },
      ],
      index: "",
      sortIndex: 999,
      supportedStandards: [],
    });
  }
  async function onAdd() {
    newAsset.address.trim() !== "" && addAssetToData();
  }
};

// Tailwind CSS constants
const networkBox = clsx(
  "flex",
  "flex-row",
  "w-full",
  "justify-between",
  "items-start",
  "rounded",
  "border border-slate-color-info",
  "px-3",
  "py-1",
);

export default AddAssetAutomatic;
