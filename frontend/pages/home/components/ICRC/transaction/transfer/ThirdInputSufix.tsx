// svg
import { ReactComponent as ServiceIcon } from "@assets/svg/files/down-amount-icon.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
import { ReactComponent as QRScanIcon } from "@assets/svg/files/qr.svg";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useSend from "@pages/home/hooks/useSend";
import { useAppSelector } from "@redux/Store";
import { ContactSubAccount } from "@/@types/transactions";
import { middleTruncation } from "@common/utils/strings";
import { AvatarEmpty } from "@components/avatar";
import { Asset } from "@redux/models/AccountModels";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { Service } from "@redux/models/ServiceModels";
import { TransferView, useTransferView } from "@pages/home/contexts/TransferViewProvider";
// import { Principal } from "@dfinity/principal";

export default function ThidInputSufix() {
  return (
    <div className="relative flex items-center justify-center gap-2">
      <InputSufixServiceBook />
      <InputSufixContactBook />
      <InputSufixScanner />
    </div>
  );
}

function InputSufixContactBook() {
  const { setTransferState } = useTransfer();
  const { senderPrincipal, senderSubAccount, isSenderAllowance } = useSend();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { sender } = useAppSelector((state) => state.transaction);
  const { contacts } = useAppSelector((state) => state.contacts);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <SendUserIcon className="cursor-pointer" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] -right-12 mt-4 scroll-y-light rounded-lg  shadow-sm ">
          {getContactOptions().map((contact, index) => {
            const { contactName, subAccountName } = contact;
            return (
              <DropdownMenu.Item
                className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color"
                key={`${contact.contactPrincipal}-${index}`}
                onSelect={() => onSelectContact(contact)}
              >
                <div className="flex items-center justify-between mr-2">
                  <AvatarEmpty title={contactName} size="large" />
                  <div className="ml-2">
                    <p className="text-left text-md text-black-color dark:text-white">
                      {contactName} {`[${subAccountName}]`}
                    </p>
                    <p className="text-left opacity-50 text-md text-black-color dark:text-white">
                      {contact.subAccountId.length > 20
                        ? middleTruncation(contact.subAccountId, 10, 10)
                        : contact.subAccountId}
                    </p>
                  </div>
                </div>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function getContactOptions() {
    if (!contacts || !contacts.length) return [];
    const allowanceContacts: ContactSubAccount[] = [];

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
      const currentContact = contacts[contactIndex];

      const contactSubAccounts: (ContactSubAccount | null)[] = currentContact.accounts.map((account) => {
        const sameSenderAndReceiver =
          senderPrincipal === currentContact.principal && senderSubAccount === account?.subaccountId;
        const currentAsset = assets.find((asset) => asset.tokenSymbol === sender?.asset?.tokenSymbol) as Asset;

        const data: ContactSubAccount = {
          contactName: currentContact.name,
          contactPrincipal: currentContact.principal,
          contactAccountIdentifier: currentContact.accountIdentifier,
          assetLogo: currentAsset?.logo,
          assetSymbol: currentAsset?.symbol,
          assetTokenSymbol: currentAsset?.tokenSymbol,
          assetAddress: currentAsset?.address,
          assetDecimal: currentAsset?.decimal,
          assetShortDecimal: currentAsset?.shortDecimal,
          assetName: currentAsset?.symbol,
          subAccountIndex: account.subaccount,
          subAccountId: account.subaccountId,
          subAccountAllowance: account.allowance,
          subAccountName: account.name,
        };

        if (isSenderAllowance()) {
          if (!sameSenderAndReceiver) return data;
        } else {
          return data;
        }

        return null;
      });

      const noNullSubAccounts = contactSubAccounts.filter((subAccount) => subAccount !== null) as ContactSubAccount[];
      allowanceContacts.push(...noNullSubAccounts);
    }

    return allowanceContacts;
  }

  function onSelectContact(contact: ContactSubAccount) {
    setTransferState((prev) => ({
      ...prev,
      toPrincipal: contact.contactPrincipal,
      toSubAccount: contact.subAccountId,
    }));
  }
}

function InputSufixServiceBook() {
  // TODO: implement after full details ReceiverServiceSelector
  const { services } = useAppSelector((state) => state.services);
  const { sender } = useAppSelector((state) => state.transaction);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <ServiceIcon className="cursor-pointer !fill-SelectRowColor" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] -right-12 mt-4 scroll-y-light rounded-lg  shadow-sm ">
          {services
            .filter((srv) => {
              return !!srv.assets.find((ast) => ast.principal === sender.asset.address);
            })
            .map((srv, index) => {
              const { name, principal } = srv;
              return (
                <DropdownMenu.Item
                  className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color"
                  key={`${principal}-${index}`}
                  onSelect={() => onSelectService(srv)}
                >
                  <div className="flex items-center justify-between mr-2">
                    <AvatarEmpty title={name} size="large" />
                    <div className="ml-2">
                      <p className="text-left text-md text-black-color dark:text-white">{name}</p>
                      <p className="text-left opacity-50 text-md text-black-color dark:text-white">{srv.principal}</p>
                    </div>
                  </div>
                </DropdownMenu.Item>
              );
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function onSelectService(srv: Service) {
    // const princBytes = Principal.fromText(authClient).toUint8Array();
    // const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    const asst = srv.assets.find((ast) => ast.principal === sender.asset.address);

    if (asst) {
      // TODO: set toPrincipal and to toSubaccount
      // setReceiverServiceAction({
      //   serviceName: srv.name,
      //   servicePrincipal: srv.principal,
      //   assetLogo: sender.asset.logo,
      //   assetSymbol: sender.asset.symbol,
      //   assetTokenSymbol: sender.asset.tokenSymbol,
      //   assetAddress: sender.asset.address,
      //   assetDecimal: sender.asset.decimal,
      //   assetShortDecimal: sender.asset.shortDecimal,
      //   assetName: sender.asset.name,
      //   subAccountId: princSubId,
      //   minDeposit: asst.minDeposit,
      //   minWithdraw: asst.minWithdraw,
      //   depositFee: asst.depositFee,
      //   withdrawFee: asst.withdrawFee,
      // });
    }
  }
}

function InputSufixScanner() {
  const { setView } = useTransferView();
  const { setTransferState } = useTransfer();

  return <QRScanIcon onClick={onSenderScannerShow} className="cursor-pointer" />;
  function onSenderScannerShow() {
    setView(TransferView.RECEIVER_QR_SCANNER);
    setTransferState((prev) => ({ ...prev, toPrincipal: "", toSubAccount: "" }));
  }
}
