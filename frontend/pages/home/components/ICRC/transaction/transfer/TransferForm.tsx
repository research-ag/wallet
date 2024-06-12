import TransferAssetSelector from "./TransferAssetSelector";

interface TransferFormProps {}

export default function TransferForm(props: TransferFormProps) {
  return (
    <div className="px-[1rem] pt-[1rem]">
      <TransferAssetSelector />
    </div>
  );
}
