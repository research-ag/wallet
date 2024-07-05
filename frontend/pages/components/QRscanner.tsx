import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CustomButton } from "@components/button";
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
    <div className="flex flex-col items-start justify-between w-full h-full text-PrimaryTextColorLight dark:text-PrimaryTextColor">
      <div className="flex flex-col items-center justify-center w-full gap-2">
        {myScannerErr !== "" && myScanner?.getState() === 1 && (
          <div className="flex flex-col items-center justify-center w-full py-1 bg-TextErrorColor">
            <p className=" text-PrimaryTextColor">{myScannerErr}</p>
          </div>
        )}
        <div className="relative flex flex-col items-center justify-center w-full">
          <div id="scanner" className="!w-full text-md"></div>

          <div className="absolute top-0 left-0 w-full h-[18.8rem] border-black/25 border-y-[2rem] border-x-[4rem] rounded-2xl">
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 border-t-4 border-l-4 w-14 h-14 border-SelectRowColor"></div>
              <div className="absolute top-0 right-0 border-t-4 border-r-4 w-14 h-14 border-SelectRowColor"></div>
              <div className="absolute bottom-0 left-0 border-b-4 border-l-4 w-14 h-14 border-SelectRowColor"></div>
              <div className="absolute bottom-0 right-0 border-b-4 border-r-4 w-14 h-14 border-SelectRowColor"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end w-full mb-16">
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
