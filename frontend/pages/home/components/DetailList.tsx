import { Fragment } from "react";

import DetailsBalance from "./DetailBalance";
import DetailsTable from "./DetailTable";
import clsx from "clsx";

export default function DetailList() {
  return (
    <Fragment>
      <div className={rootStyles}>
        <DetailsBalance />
        <DetailsTable />
      </div>
    </Fragment>
  );
}

const rootStyles = clsx(
  "relative",
  "flex",
  "flex-col",
  "justify-start",
  "items-center",
  "bg-SecondaryColorLight",
  "dark:bg-SecondaryColor",
  "w-full",
  "pt-6",
  "pr-9",
  "pl-7",
  "gap-2",
  "h-fit",
  "min-h-full",
);
