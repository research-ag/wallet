export default function Pill({ text, start, end, icon }: { text: string; start: number; end: number; icon?: string }) {
  return (
    <div className="px-3 py-1 rounded-full bg-GrayColor/50">
      <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
        <img src={icon} alt="icon" className="w-5" />
        {text?.slice(0, start) + "..." + text?.slice(-end)}
      </div>
    </div>
  );
}
