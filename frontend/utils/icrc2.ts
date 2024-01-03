import { ApproveParams, IcrcLedgerCanister } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import store from "@redux/Store";
import { Buffer } from "buffer";

export async function ICRC2Approve() {
  try {
    const myAgent = store.getState().auth.userAgent;
    const canisterId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
    const canister = IcrcLedgerCanister.create({ agent: myAgent, canisterId });

    const subaccountID = "0x0";
    const subaccountUint8Array = new Uint8Array(Buffer.from(subaccountID, "hex"));

    const params: ApproveParams = {
      spender: {
        owner: Principal.fromText("jwknm-7iukh-d4j3k-k4773-rr5i7-mnco3-snicl-cukeh-24so7-lwj2i-zqe"),
        subaccount: [subaccountUint8Array],
      },
      amount: BigInt(1000),
    };

    const result = await canister.approve(params);

    console.log(result);
  } catch (e) {
    console.log(e);
  }
}
