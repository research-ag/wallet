export default function Table() {
  return (
    <div className="w-full columns-1">
      <div className="w-full border-b border-BorderColorTwoLight   columns-5 py-2">
        <p className="text-md font-medium ThirdTextColor">Subaccount</p>
        <p className="text-md font-medium ThirdTextColor">Spender</p>
        <p className="text-md font-medium ThirdTextColor">Amount</p>
        <p className="text-md font-medium ThirdTextColor">Expiration</p>
        <p className="text-md font-medium ThirdTextColor">Action</p>
      </div>
    </div>
  );
}
