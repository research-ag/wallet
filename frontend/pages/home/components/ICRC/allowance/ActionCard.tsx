import { TAllowance } from "@/@types/allowance";

interface ActionCardProps {
  allowance: TAllowance;
  refetchAllowances: () => void;
}

export default function ActionCard(props: ActionCardProps) {
  return <p>Hello</p>;
}
