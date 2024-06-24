import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setRoutingPath } from "@redux/auth/AuthReducer";
import { RoutingPathEnum } from "@common/const";

interface MenuProps {
  noMargin?: boolean;
  compClass?: string;
}

const Menu = (props: MenuProps) => {
  const { noMargin, compClass } = props;
  const dispatch = useAppDispatch();
  const { route } = useAppSelector((state) => state.auth);
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { services } = useAppSelector((state) => state.services);
  const { allowances } = useAppSelector((state) => state.allowance.list);
  const { t } = useTranslation();

  const menuList = [
    {
      name: "Assets",
      path: RoutingPathEnum.Enum.HOME,
      label: `${assets?.length !== 1 ? t("assets") : t("asset")} (${assets?.length})`,
    },
    {
      name: "Allowances",
      path: RoutingPathEnum.Enum.ALLOWANCES,
      label: `${allowances?.length !== 1 ? t("allowance.allowances") : t("allowance.allowances")} (${
        allowances?.length
      })`,
    },
    {
      name: "Contacts",
      path: RoutingPathEnum.Enum.CONTACTS,
      label: `${assets?.length !== 1 ? t("contacts") : t("contact")} (${contacts?.length})`,
    },
    {
      name: "Services",
      path: RoutingPathEnum.Enum.SERVICES,
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
                route !== menu.path
                  ? " text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60"
                  : "border-b border-SelectRowColor"
              }`}
            >
              {menu.label}
            </p>
          </CustomButton>
        ))}
      </div>
    </Fragment>
  );

  function handleMenuClic(path: string) {
    dispatch(setRoutingPath(path));
  }
};

export default Menu;
