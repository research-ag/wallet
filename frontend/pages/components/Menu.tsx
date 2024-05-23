import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import history from "@pages/history";
import { CONTACTS, HOME, SERVICES } from "@pages/paths";
import { useAppSelector } from "@redux/Store";

interface MenuProps {
  noMargin?: boolean;
  compClass?: string;
}

const Menu = (props: MenuProps) => {
  const { noMargin, compClass } = props;
  const { contacts } = useAppSelector((state) => state.contacts);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { services } = useAppSelector((state) => state.services);
  const { allowances } = useAppSelector((state) => state.allowance.list);
  const { t } = useTranslation();

  const menuList = [
    {
      name: "Assets",
      path: HOME,
      label: `${assets?.length !== 1 ? t("assets") : t("asset")} (${assets?.length})`,
    },
    {
      name: "Allowances",
      path: "/allowances",
      label: `${allowances?.length !== 1 ? t("allowance.allowances") : t("allowance.allowances")} (${
        allowances?.length
      })`,
    },
    {
      name: "Contacts",
      path: CONTACTS,
      label: `${assets?.length !== 1 ? t("contacts") : t("contact")} (${contacts?.length})`,
    },
    {
      name: "Services",
      path: SERVICES,
      // TODO: get from the state
      label: `${services?.length !== 1 ? t("services") : t("services")} (${services.length})`,
    },
  ];

  return (
    <Fragment>
      <div className={`flex flex-row items-center justify-start gap-3 ${compClass ? compClass : ""}`}>
        {menuList.map((menu, k) => (
          <CustomButton
            key={k}
            size={"small"}
            intent={"noBG"}
            border={"underline"}
            className={`flex flex-row items-center justify-start ${noMargin ? "" : "mb-4"}`}
            onClick={() => {
              handleMenuClic(menu.path);
            }}
          >
            <p
              className={`!font-normal  mr-2 ${
                window.location.pathname !== menu.path
                  ? " text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60"
                  : "border-b border-SelectRowColor"
              }`}
            >
              {menu.label}
            </p>
          </CustomButton>
        ))}
        {isAppDataFreshing && (
          <div className=" mt-[-1rem] inline-block w-4 h-4 after:block after:w-4 after:h-4 after:rounded-[50%] after:border-[0.2rem] after:border-t-SelectRowColor after:border-b-SelectRowColor after:border-r-transparent after:border-l-transparent lds-dual-ring"></div>
        )}
      </div>
    </Fragment>
  );

  function handleMenuClic(path: string) {
    if (window.location.pathname !== path) {
      history.push(path);
    }
  }
};

export default Menu;
