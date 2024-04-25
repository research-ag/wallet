import { shortAddress } from "@/utils";

interface PillProps {
  text: string;
  start: number;
  end: number;
  icon?: string;
}

export default function Pill({ text, start, end, icon }: PillProps) {
  return (
    <div className="relative w-[16rem]">
      <div className="px-3 py-1 rounded-full bg-GrayColor/50">
        <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap">
          <img src={icon} alt="icon" className="w-5" />
          {shortAddress(text, start, end)}
        </div>
      </div>
    </div>
  );
}
