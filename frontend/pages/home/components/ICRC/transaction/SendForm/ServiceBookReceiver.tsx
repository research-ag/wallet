import { BasicSelect } from "@components/select";
import { useMemo, useState } from "react";
import { ServiceSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { setReceiverServiceAction } from "@redux/transaction/TransactionActions";
import { useAppSelector } from "@redux/Store";
import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";

export default function ServiceBookReceiver() {
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { sender, receiver } = useAppSelector((state) => state.transaction);
  const { authClient } = useAppSelector((state) => state.auth);
  const { services } = useAppSelector((state) => state.services);

  const filteredServices: ServiceSubAccount[] = useMemo(() => {
    if (!services || !services.length) return [];
    const auxServices: ServiceSubAccount[] = [];

    for (let serviceIndex = 0; serviceIndex < services.length; serviceIndex++) {
      const currentService = services[serviceIndex];

      const currentContactAsset = currentService?.assets?.find((asset) => asset?.principal === sender?.asset?.address);
      const princBytes = Principal.fromText(authClient).toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
      if (currentContactAsset)
        auxServices.push({
          serviceName: currentService.name,
          servicePrincipal: currentService.principal,
          assetLogo: sender.asset.logo,
          assetSymbol: sender.asset.symbol,
          assetTokenSymbol: sender.asset.tokenSymbol,
          assetAddress: sender.asset.address,
          assetDecimal: sender.asset.decimal,
          assetShortDecimal: sender.asset.shortDecimal,
          assetName: sender.asset.name,
          subAccountId: princSubId,
          minDeposit: currentContactAsset.minDeposit,
          minWithdraw: currentContactAsset.minWithdraw,
          depositFee: currentContactAsset.depositFee,
          withdrawFee: currentContactAsset.withdrawFee,
        });
    }
    return auxServices;
  }, [sender, services]);

  const formattedContacts = useMemo(() => {
    if (!searchSubAccountValue) return filteredServices.map(formatService);
    return filteredServices
      .filter((srv) => {
        return srv.serviceName.toLocaleLowerCase().includes(searchSubAccountValue);
      })
      .map(formatService);
  }, [filteredServices, searchSubAccountValue]);

  return (
    <div className="mx-4">
      <BasicSelect
        onSelect={onSelect}
        options={formattedContacts}
        initialValue={receiver?.serviceSubAccount?.servicePrincipal}
        currentValue={receiver?.serviceSubAccount?.servicePrincipal}
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
    if (fullService) setReceiverServiceAction(fullService);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
}
