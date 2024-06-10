import { IconButton } from "@components/button";
import { BasicModal } from "@components/modal";
import { PlusIcon } from "@radix-ui/react-icons";
import { memo, useState } from "react";
import AddContact from "@/pages/contacts/components/ICRC/AddContact";
import ContactErrorProvider from "@pages/contacts/contexts/ContactErrorProvider";
import ContactProvider from "@pages/contacts/contexts/ContactProvider";

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
        {open && (
          <ContactProvider>
            <ContactErrorProvider>
              <AddContact onClose={() => setOpen(false)} />
            </ContactErrorProvider>
          </ContactProvider>
        )}
      </BasicModal>
    </div>
  );
}

export default memo(AddContactModal);
