import { useAppSelector } from "@/redux/Store";

export const IdentityHook = () => {
  const { userAgent } = useAppSelector((state) => state.auth);

  return { userAgent };
};
