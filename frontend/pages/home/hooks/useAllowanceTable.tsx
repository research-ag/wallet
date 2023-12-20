import { Allowance } from "@/@types/allowance";
import { momentDateTime } from "@/utils/formatTime";
import { middleTruncation, toTitleCase } from "@/utils/strings";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { useState } from "react";

// TODO: add icons
// import { ReactComponent as TrashDarkIcon } from "@/assets/svg/files/trash-icon.svg";
// import { ReactComponent as PencilIcon } from "@/assets/svg/files/pencil.svg";
// import { ReactComponent as MoreDotsIcon } from "@assets/svg/files/more-alt.svg";

interface TDoubleCell {
  id: string;
  name: string;
}

const ActionCard = () => {
  const [open, setOpen] = useState(false);

  const editRow = () => {
    console.log("edit");
  };
  const deleteRow = () => {
    console.log("delete");
  };

  const containerStyles = clsx("relative w-full");

  const cardStyles = clsx(
    "flex",
    "flex-col",
    "w-32",
    "rounded-md",
    "absolute",
    "top-8",
    "right-6",
    !open ? "hidden" : "",
    "z-50",
  );

  const editButtonStyles = clsx("bg-[#332f60] py-2 rounded-t-md text-[#b1afcd]");
  const deleteButtonStyles = clsx("bg-[#211349] py-2 rounded-b-md border-2 border-[#2b2759] text-[#b0736f]");

  return (
    <div className={containerStyles}>
      <button className="w-full p-0 m-0 text-xl font-bold text-center border-0" onClick={() => setOpen(!open)}>
        ...
        {/* <MoreDotsIcon /> */}
      </button>

      <div className={cardStyles}>
        <button className={editButtonStyles} onClick={deleteRow}>
          {/* <PencilIcon /> */}
          Edit
        </button>
        <button className={deleteButtonStyles} onClick={editRow}>
          {/* <TrashDarkIcon /> */}
          Delete
        </button>
      </div>
    </div>
  );
};

export const useAllowanceTable = () => {
  const columnHelper = createColumnHelper<Allowance>();

  function renderDoubleCellItem<T extends TDoubleCell>(item: CellContext<Allowance, T | undefined>) {
    return (
      <div>
        <p>{item.getValue()?.name || "-"}</p>
        <p>{item.getValue()?.id || "-"}</p>
      </div>
    );
  }

  function renderDoubleCellItemTruncated<T extends TDoubleCell>(item: CellContext<Allowance, T | undefined>) {
    return (
      <div>
        <p>{item.getValue()?.name || "-"}</p>
        <p>{middleTruncation(item.getValue()?.id, 3, 3) || "-"}</p>
      </div>
    );
  }

  const columns = [
    columnHelper.accessor("subaccount", {
      cell: (info) => renderDoubleCellItem<TDoubleCell>(info),
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor("spender", {
      cell: (info) => renderDoubleCellItemTruncated<TDoubleCell>(info),
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor("amount", {
      cell: (info) => toTitleCase(info.getValue()),
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor("expiration", {
      cell: (info) => momentDateTime(info.getValue()),
      header: ({ header }) => toTitleCase(header.id),
    }),
    columnHelper.accessor("action", {
      cell: (info) => <ActionCard />,
      header: ({ header }) => toTitleCase(header.id),
    }),
  ];

  return { columns };
};
