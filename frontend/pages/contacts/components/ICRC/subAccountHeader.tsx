import { AssetContact } from "@redux/models/ContactsModels";
import { useTranslation } from "react-i18next";

interface SubAccountHeaderProps {
  asst: AssetContact;
  addSub: boolean;
}

export default function SubAccountHeader(props: SubAccountHeaderProps) {
  const { t } = useTranslation();
  const { asst, addSub } = props;
  return (
    <>
      {asst && (asst?.subaccounts?.length > 0 || addSub) && (
        <thead className="text-PrimaryTextColor/70">
          <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
            <th className="p-2 text-left w-[4.5%] "></th>
            <th className="p-2 text-left w-[5%] "></th>
            <th className="p-2 text-left w-[35%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("name")}</p>
            </th>
            <th className="p-2 w-[10%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("sub-acc")}</p>
            </th>
            <th className="p-2 w-[30%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo ">
              <p>{t("account.indentifier")}</p>
            </th>
            <th className="p-2 w-[12.5%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
            <th className="w-[3%] border-b border-BorderColorTwoLight dark:border-BorderColorTwo "></th>
          </tr>
        </thead>
      )}
    </>
  );
}
