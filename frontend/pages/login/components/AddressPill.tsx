type AddressPillProps = {
  address?: string;
  className?: string;
};

export default function AddressPill({ address }: AddressPillProps) {
  if (!address) return null;
  return (
    <div className="px-3 py-1 rounded-full bg-GrayColor/50 w-36">
      <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
        {address?.slice(0, 6) + "..." + address?.slice(-4)}
      </div>
    </div>
  );
}
