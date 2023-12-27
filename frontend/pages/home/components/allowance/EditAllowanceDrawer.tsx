import { ReactComponent as BitcoinIcon } from "@assets/svg/files/bitcoin-icon.svg";
import { Chip } from "@components/core/chip";
import { Drawer } from "@components/core/drawer";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

export default function EditAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { isDrawerOpen, onClose } = props;
  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title="Edit Allowance">
      <form className="flex flex-col text-left">
        <div className="w-full bg-[#141331] rounded-md p-4">
          <h1 className="text-lg font-bold">Subaccount</h1>
          <div className="mt-4">
            <div className="flex flex-col items-start justify-center">
              <BitcoinIcon className="w-8 h-8" />
              <p className="mt-2">BTC</p>
            </div>
            <div>
              <Chip size="medium" text="0x1" />
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
