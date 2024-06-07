import { Contact } from "@redux/models/ContactsModels";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import DeleteContactModal from "./DeleteContactModal";

interface ContactActionProps {
  contact: Contact;
}

export default function ContactAction(props: ContactActionProps) {
  return (
    <div className="grid w-full place-content-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <DotsHorizontalIcon className="w-5 h-5 mr-[1.5rem] opacity-50 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor cursor-pointer" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="flex flex-col p-1 rounded-md dark:bg-level-1-color bg-secondary-color-2-light">
            <DeleteContactModal contact={props.contact} />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
