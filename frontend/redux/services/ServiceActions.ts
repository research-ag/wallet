import { Actor, HttpAgent } from "@dfinity/agent";
import store from "@redux/Store";
import { _SERVICE as IcrcxActor } from "@candid/icrcx/service.did";
import { idlFactory as IcrcxIDLFactory } from "@candid/icrcx/candid.did";
import { ServiceAsset, ServiceData } from "@redux/models/ServiceModels";

export const getServicesData = async (myAgent: HttpAgent, principal: string) => {
  const myAssets = store.getState().asset.list.assets;

  const serviceData = (JSON.parse(localStorage.getItem(`services-${principal}`) || "null") as ServiceData[]) || [];

  const services = await Promise.all(
    serviceData.map(async (srv) => {
      const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
        agent: myAgent,
        canisterId: srv.principal,
      });

      const supportedAssets = await serviceActor.icrcXSupportedTokens();
      const credits = await serviceActor.icrcXAllCredits();

      const serviceAssets = await Promise.all(
        supportedAssets.map(async (ast) => {
          const tokenInfo = await serviceActor.icrcXTokenInfo(ast);
          const asset = myAssets.find((myAst) => myAst.address === ast.toText());
          const credit = credits.find((crd) => crd[0] === ast);

          const serviceAsset: ServiceAsset = {
            tokenSymbol: "",
            balance: "",
            credit: credit ? credit[1].toString() : "",
            minDeposit: tokenInfo.minDeposit.toString(),
            minWithdraw: tokenInfo.minWithdraw.toString(),
            depositFee: tokenInfo.depositFee.toString(),
            withdrawFee: tokenInfo.withdrawFee.toString(),
          };
          if (asset) {
            const balance = await serviceActor.icrcXTrackedDeposit(ast);
            serviceAsset.tokenSymbol = asset.tokenSymbol;
            serviceAsset.balance = balance.Ok.toString();
          }

          return serviceAsset;
        }),
      );

      return {
        name: srv.name,
        principal: srv.principal,
        assets: serviceAssets,
      };
    }),
  );

  return { services, serviceData };
};
