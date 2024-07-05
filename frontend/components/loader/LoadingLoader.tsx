import "./style.scss";

interface LoadingLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  color?: string;
}

export default function LoadingLoader({
  width = "w-4",
  height = "h-4",
  className = "",
  color = "border-secondary-color-2 dark:border-secondary-color-1-light",
}: LoadingLoaderProps) {
  return (
    <span
      className={`loader-button ${width} ${height} ${className} ${color} !border-b-transparent !border-[4px]`}
    ></span>
  );
}
