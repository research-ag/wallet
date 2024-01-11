import * as Tooltip from "@radix-ui/react-tooltip";

interface ToolTipProps {
  trigger: JSX.Element;
  children: React.ReactNode;
}

export default function ToolTip(props: ToolTipProps) {
  const { trigger, children } = props;
  return (
    <div className="w-fit">
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div>
              <p>{trigger}</p>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="p-4 border rounded-md shadow-md bg-ThemeColorBackLight dark:bg-tooltip-background border-RadioCheckColor"
              sideOffset={5}
            >
              {children}
              <Tooltip.Arrow className="fill-RadioCheckColor" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
