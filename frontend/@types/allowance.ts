export interface Allowance {
  subaccount: {
    id: string;
    name: string;
  };
  spender: {
    id: string;
    name: string;
  };
  amount: string;
  expiration: string;
  action?: string;
}
