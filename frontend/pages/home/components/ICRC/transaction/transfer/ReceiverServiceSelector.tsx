import { BasicSelect } from "@components/select";
import { useMemo, useState } from "react";
import { ServiceSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { useAppSelector } from "@redux/Store";
import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { Asset } from "@redux/models/AccountModels";
import logger from "@/common/utils/logger";

export default function ServiceBookReceiver() {
  const { transferState, setTransferState } = useTransfer();
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { authClient } = useAppSelector((state) => state.auth);
  const { services } = useAppSelector((state) => state.services);
  const assets = useAppSelector((state) => state.asset.list.assets);

  const filteredServices: ServiceSubAccount[] = useMemo(() => {
    if (!services || !services.length) return [];
    const auxServices: ServiceSubAccount[] = [];
    const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol) as Asset;

    for (let serviceIndex = 0; serviceIndex < services.length; serviceIndex++) {
      const currentService = services[serviceIndex];

      const currentServiceAsset = currentService?.assets?.find((asset) => asset.principal === currentAsset.address);

      const princBytes = Principal.fromText(authClient).toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

      if (currentServiceAsset)
        auxServices.push({
          serviceName: currentService.name,
          servicePrincipal: currentService.principal,
          assetLogo: currentAsset.logo,
          assetSymbol: currentAsset.symbol,
          assetTokenSymbol: currentAsset.tokenSymbol,
          assetAddress: currentAsset.address,
          assetDecimal: currentAsset.decimal,
          assetShortDecimal: currentAsset.shortDecimal,
          assetName: currentAsset.name,
          subAccountId: princSubId,
          minDeposit: currentServiceAsset.minDeposit,
          minWithdraw: currentServiceAsset.minWithdraw,
          depositFee: currentServiceAsset.depositFee,
          withdrawFee: currentServiceAsset.withdrawFee,
        });
    }
    return auxServices;
  }, [transferState, services]);

  const formattedServices = useMemo(() => {
    if (!searchSubAccountValue) return filteredServices.map(formatService);
    return filteredServices
      .filter((srv) => {
        return srv.serviceName.toLocaleLowerCase().includes(searchSubAccountValue);
      })
      .map(formatService);
  }, [filteredServices, searchSubAccountValue]);

  console.log(formattedServices);

  return (
    <div className="mx-4">
      <BasicSelect
        onSelect={onSelect}
        options={formattedServices}
        initialValue={transferState.toPrincipal}
        currentValue={transferState.toPrincipal}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
    </div>
  );

  function formatService(srv: ServiceSubAccount) {
    return {
      value: srv.servicePrincipal,
      label: `${srv.serviceName}`,
      subLabel: srv.servicePrincipal,
      icon: <AvatarEmpty title={srv.serviceName} size="medium" className="mr-4" />,
    };
  }

  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);

    const fullService = filteredServices?.find((srv) => srv.servicePrincipal === option.value);

    if (!fullService) {
      logger.debug("ReceiverServiceSelector: onSelect: fullService is null");
      return;
    }

    const princBytes = Principal.fromText(authClient).toUint8Array();
    const toSubaccount = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

    setTransferState((prevState) => ({
      ...prevState,
      toPrincipal: fullService.servicePrincipal,
      toSubaccount,
    }));
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
