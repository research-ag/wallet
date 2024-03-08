import { useSiweIdentity } from "@/siwe";
import { isChainIdSupported } from "@/config/wagmi.config";
import { CustomButton } from "@components/Button";
import { useAccount, useNetwork } from "wagmi";

export default function LoginButton() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { login, isLoggingIn, isPrepareLoginSuccess, isPreparingLogin } = useSiweIdentity();

  function buttonText() {
    if (isLoggingIn) {
      return "Signing in";
    }
    if (isPreparingLogin) {
      return "Preparing login";
    }
    return "Sign in";
  }

  const disabled = !isChainIdSupported(chain?.id) || isLoggingIn || !isConnected || !isPrepareLoginSuccess;

  return (
    <CustomButton disabled={disabled} className="disabled:opacity-50 w-36" onClick={login}>
      {buttonText()}
    </CustomButton>
  );
}
