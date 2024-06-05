import { ContactAccount, Contact } from "@/@types/contacts";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface ComponentProps {
  contact: Contact;
  account: ContactAccount;
}

export default function ContactAccountAction(props: ComponentProps) {
  console.log(props);

  return (
    <div className="grid w-full place-content-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <DotsHorizontalIcon
            className="w-5 h-5 mr-[1.5rem] opacity-50 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor cursor-pointer"
            onClick={console.log}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="flex flex-col bg-red-200 rounded-md">
            <DropdownMenu.Item>
              <button className="p-0" onClick={onDeleteContactAccount}>
                <p>Delete</p>
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );

  function onDeleteContactAccount() {
    console.log("Delete contact account");
  }
}
