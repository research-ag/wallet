import { useSiweIdentity } from "ic-use-siwe-identity";
import { CustomButton } from "@components/button";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export default function LoginButton() {
  const { isConnected } = useAccount();
  const { login, isLoggingIn, isPrepareLoginSuccess, isPrepareLoginError, isPreparingLogin, prepareLoginError } =
    useSiweIdentity();

  function buttonText() {
    if (isLoggingIn) {
      return "Signing in";
    }
    if (isPreparingLogin) {
      return "Preparing login";
    }
    return "Sign in";
  }

  useEffect(() => {
    prepareLoginError && console.log("prepareLoginError", prepareLoginError);
  }, [prepareLoginError]);

  const disabled = isLoggingIn || !isConnected || isPreparingLogin || isPrepareLoginError || !isPrepareLoginSuccess;

  return (
    <>
      <CustomButton disabled={disabled} className="disabled:opacity-50 w-36" onClick={login}>
        {buttonText()}
      </CustomButton>
    </>
  );
}
