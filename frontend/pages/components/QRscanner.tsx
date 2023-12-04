import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
interface QRscannerProps {
  qrView: boolean;
  onSuccess(value: string): void;
  setQRview(value: boolean): void;
}

const QRscanner = ({ qrView, onSuccess, setQRview }: QRscannerProps) => {
  const { t } = useTranslation();
  const [myScanner, setScanner] = useState<Html5QrcodeScanner>();
  const [myScannerErr, setScannerErr] = useState("");
  useEffect(() => {
    if (qrView) {
      const scanner = new Html5QrcodeScanner(
        "scanner",
        {
          fps: 10,
        },
        true,
      );
      scanner.render(
        (value: string) => {
          scanner.clear().then(() => {
            onSuccess(value);
            setScannerErr("");
          });
        },
        () => {
          if (scanner.getState() === 1) setScannerErr(t("err.qr.img"));
          else if (scanner.getState() === 2) setScannerErr("");
        },
      );
      setScanner(scanner);
    } else {
      if (myScanner) {
        myScanner.pause();
        myScanner.clear();
      }
    }
  }, [qrView]);

  return (
    <div className="flex flex-col justify-between items-start w-full h-full text-PrimaryTextColorLight dark:text-PrimaryTextColor">
      <div className="flex flex-col justify-center items-center w-full gap-2">
        {myScannerErr !== "" && myScanner?.getState() === 1 && (
          <div className="flex flex-col justify-center items-center w-full py-1 bg-TextErrorColor">
            <p className=" text-PrimaryTextColor">{myScannerErr}</p>
          </div>
        )}
        <div className="relative flex flex-col w-full justify-center items-center">
          <div id="scanner" className="!w-full text-md"></div>

          <div className="absolute top-0 left-0 w-full h-[18.8rem] border-black/25 border-y-[2rem] border-x-[4rem] rounded-2xl">
            <div className="w-full h-full relative">
              <div className="absolute w-14 h-14 border-l-4 border-t-4 border-SelectRowColor top-0 left-0"></div>
              <div className="absolute w-14 h-14 border-r-4 border-t-4 border-SelectRowColor top-0 right-0"></div>
              <div className="absolute w-14 h-14 border-l-4 border-b-4 border-SelectRowColor bottom-0 left-0"></div>
              <div className="absolute w-14 h-14 border-r-4 border-b-4 border-SelectRowColor bottom-0 right-0"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-end items-center mb-16">
        <CustomButton intent="deny" className="mr-3 min-w-[5rem]" onClick={handleBackButton}>
          <p>{t("back")}</p>
        </CustomButton>
      </div>
    </div>
  );
  function handleBackButton() {
    myScanner?.clear();
    setQRview(false);
  }
};
export default QRscanner;
