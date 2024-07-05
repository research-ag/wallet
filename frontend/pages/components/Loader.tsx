import { FunctionComponent } from "react";

interface LoaderProps {
  height?: string;
  width?: string;
  bg?: string;
}
const Loader: FunctionComponent<LoaderProps> = ({
  height = "min-h-screen",
  width = "min-w-screen",
  bg = "bg-PrimaryColorLight dark:bg-PrimaryColor",
}: LoaderProps) => (
  <div className={`loader flex justify-center items-center ${bg} ${height} ${width}`}>
    <div className="one bg-PrimaryTextColorLight dark:bg-PrimaryTextColor "></div>
    <div className="two bg-SecondaryTextColorLight dark:bg-SecondaryTextColor"></div>
    <div className="three bg-slate-color-info dark:bg-slate-color-info"></div>
    <div className="four bg-AccpetButtonColor dark:bg-AccpetButtonColor"></div>
  </div>
);
export default Loader;
