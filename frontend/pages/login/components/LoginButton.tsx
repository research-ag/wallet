import { useAccount, useNetwork } from "wagmi";

import { CustomButton } from "../../../components/Button";
import { isChainIdSupported } from "../../../wagmi.config";
import { useSiweIdentity } from "../../../siwe";

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
