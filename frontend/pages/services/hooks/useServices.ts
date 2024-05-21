interface UseServices {
  serviceSearchkey?: string;
  assetFilter?: string[];
}

// TODO: implement filtering
export default function useServices(args: UseServices) {
  return { services: [] };
}
