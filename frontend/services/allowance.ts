import { Allowance } from "@/@types/allowance";

export function listAllowances(): Promise<Allowance[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAllowances);
    }, 2000);
  });
}

export const mockAllowances: Allowance[] = [
  {
    subaccount: {
      id: "0x0",
      name: "Savings Account",
    },
    spender: {
      id: "0xa5debe6wd4ba",
      name: "John Doe",
    },
    amount: "100.00",
    expiration: "2023-12-18T19:42:03.669Z",
  },
  {
    subaccount: {
      id: "0x1",
      name: "School",
    },
    spender: {
      id: "0xa5debe6wd4bb",
      name: "George",
    },
    amount: "100.00",
    expiration: "2023-12-18T19:42:03.669Z",
  },
  {
    subaccount: {
      id: "0x3",
      name: "Holidays",
    },
    spender: {
      id: "0xa5debe6wd4bc",
      name: "Noah",
    },
    amount: "100.00",
    expiration: "2023-12-18T19:42:03.669Z",
  },
  {
    subaccount: {
      id: "0x4",
      name: "Harry Jackson",
    },
    spender: {
      id: "0xa5debe6wd4bd",
      name: "Sports",
    },
    amount: "100.00",
    expiration: "2023-12-18T19:42:03.669Z",
  },
];
