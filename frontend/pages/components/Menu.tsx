import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import history from "@pages/history";
import { CONTACTS, HOME } from "@pages/paths";
import { AssetHook } from "@pages/home/hooks/assetHook";
import { useContacts } from "@pages/contacts/hooks/contactsHook";

const Menu = () => {
  const { t } = useTranslation();

  const { assets, assetLoading } = AssetHook();
  const { contacts } = useContacts();

  const menuList = [
    {
      name: "Assets",
      path: HOME,
      label: `${assets?.length !== 1 ? t("assets") : t("asset")} (${assets?.length})`,
    },
    {
      name: "Contacts",
      path: CONTACTS,
      label: `${assets?.length !== 1 ? t("contacts") : t("contact")} (${contacts?.length})`,
    },
  ];

  return (
    <Fragment>
      <div className="flex flex-row gap-3 justify-start items-center w-full">
        {menuList.map((menu, k) => (
          <CustomButton
            key={k}
            size={"small"}
            intent={"noBG"}
            border={"underline"}
            className="flex flex-row justify-start items-center mb-4"
            onClick={() => {
              if (window.location.pathname !== menu.path) {
                history.push(menu.path);
              }
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
        {assetLoading && (
          <div className=" mt-[-1rem] inline-block w-4 h-4 after:block after:w-4 after:h-4 after:rounded-[50%] after:border-[0.2rem] after:border-t-SelectRowColor after:border-b-SelectRowColor after:border-r-transparent after:border-l-transparent lds-dual-ring"></div>
        )}
      </div>
    </Fragment>
  );
};

export default Menu;
