import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";

interface AddContactProps {
  setAddOpen(value: boolean): void;
}

// TODO: Add contact from here
export default function AddContact({ setAddOpen }: AddContactProps) {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-4 reative text-md">
      <CloseIcon
        className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        onClick={() => {
          setAddOpen(false);
        }}
      />
    </div>
  );
}
