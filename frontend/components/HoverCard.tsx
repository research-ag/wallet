import * as HoverCard from "@radix-ui/react-hover-card";

interface CustomHoverCardProps {
  trigger: any;
  children: any;
  arrowFill?: string;
  // arrowFill -> "fill-|tailwind-color or [#FFFFFF]|"
  side?: "top" | "right" | "bottom" | "left";
}

const CustomHoverCard = ({ trigger, children, arrowFill, side = "top" }: CustomHoverCardProps) => {
  return (
    <HoverCard.Root openDelay={200} closeDelay={50}>
      <HoverCard.Trigger>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content side={side} sideOffset={5} className="!z-[2000]">
          {children}
          {arrowFill && <HoverCard.Arrow className={arrowFill} />}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default CustomHoverCard;
