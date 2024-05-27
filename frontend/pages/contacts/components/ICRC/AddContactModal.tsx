import { IconButton } from "@components/button";
import { BasicModal } from "@components/modal";
import { PlusIcon } from "@radix-ui/react-icons";
import { memo, useState } from "react";
import AddContact from "./AddContact";

function AddContactModal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <IconButton icon={<PlusIcon className="w-6 h-6" />} size="medium" onClick={() => setOpen(true)} />

      <BasicModal
        open={open}
        width="w-[48rem]"
        padding="py-5 px-8"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      >
        {open && <AddContact onClose={() => setOpen(false)} />}
      </BasicModal>
    </div>
  );
}

export default memo(AddContactModal);
