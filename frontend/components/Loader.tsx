import "./style.scss";

interface LoadingLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

const LoadingLoader = ({ width = "w-4", height = "h-4", className = "" }: LoadingLoaderProps) => {
  return <span className={`loader-button ${width} ${height} ${className}`}></span>;
};

export default LoadingLoader;
