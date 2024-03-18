import { clsx } from "clsx";

interface TabProps {
  tabs: { tabName: string; content: JSX.Element; disabled?: boolean }[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export default function Tab({ tabs, activeTab, onTabChange }: TabProps) {
  return (
    <div className="flex">
      {tabs
        .filter((tab) => !tab?.disabled)
        .map((tab) => {
          function onChangeTab() {
            onTabChange(tab.tabName);
          }

          return (
            <button className={getSelectedStyles(tab.tabName === activeTab)} key={tab.tabName} onClick={onChangeTab}>
              {tab.content}
            </button>
          );
        })}
    </div>
  );
}

function getSelectedStyles(isActive: boolean) {
  return clsx("p-0 border-b-2 cursor-pointer", isActive ? "border-b-primary-color" : "border-b-gray-color-3");
}
