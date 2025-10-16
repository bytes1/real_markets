import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WalletBalanceCard from "./WalletBalanceCard";

export function WalletPopover() {
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useBalance({ address });

  const displayBalance =
    isConnected && nativeBalance
      ? `${parseFloat(formatEther(nativeBalance.value)).toFixed(2)} ${
          nativeBalance.symbol
        }`
      : "0.00 USD";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full font-semibold text-sm px-4 h-9"
        >
          {displayBalance}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-lg rounded-2xl">
        <WalletBalanceCard />
      </PopoverContent>
    </Popover>
  );
}
