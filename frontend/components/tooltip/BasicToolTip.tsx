import * as Tooltip from "@radix-ui/react-tooltip";

interface ToolTipProps {
  trigger: JSX.Element;
  children: React.ReactNode;
}

export default function BasicToolTip(props: ToolTipProps) {
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
              className="border-2 rounded-md border-RadioCheckColor bg-secondary-color-1-light dark:bg-level-1-color z-[2000]"
              sideOffset={5}
            >
              <div className="p-4 ThemeColorBackLight dark:bg-TooltipBackground">{children}</div>
              <Tooltip.Arrow className="fill-RadioCheckColor" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
