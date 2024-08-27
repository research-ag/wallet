import { useSiweIdentity } from "ic-use-siwe-identity";
import { CustomButton } from "@components/button";
import { useAccount } from "wagmi";

export default function LoginButton() {
  const { isConnected } = useAccount();
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

  const disabled = isLoggingIn || !isConnected || !isPrepareLoginSuccess;

  return (
    <>
      <CustomButton disabled={disabled} className="disabled:opacity-50 w-36" onClick={login}>
        {buttonText()}
      </CustomButton>
    </>
  );
}
