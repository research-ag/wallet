
interface UseServices {
  serviceSearchKey?: string;
  assetFilter?: string[];
};

// TODO: implement filtering
export default function useServices(args: UseServices) {
  console.log("useServices", args);
  return { services: [], }
};
