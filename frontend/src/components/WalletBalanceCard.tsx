import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { SPECIFIED_TOKEN_ADDRESS } from "../utils/constants";
import { CopyButton } from "./CopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "lucide-react";

export default function WalletBalanceCard() {
  const { address, chainId } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  const { data: tokenBalance } = useBalance({
    address,
    token: SPECIFIED_TOKEN_ADDRESS(chainId!),
  });

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const formatBalance = (value: bigint, decimals: number = 4) => {
    return parseFloat(formatEther(value)).toFixed(decimals);
  };

  return (
    <Card className="w-full max-w-xs shadow-lg rounded-2xl border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-md font-semibold">
            <Wallet className="w-5 h-5 text-muted-foreground" />
            <span>Wallet</span>
          </CardTitle>
          {address && (
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-secondary">
              <span className="text-xs font-mono text-secondary-foreground">
                {truncatedAddress}
              </span>
              <CopyButton text={address} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-muted-foreground">Native Balance</p>
          <p className="text-lg font-semibold text-right">
            {nativeBalance
              ? `${formatBalance(nativeBalance.value)} ${nativeBalance.symbol}`
              : "..."}
          </p>
        </div>
        <Separator />
        <div className="flex justify-between items-baseline">
          <p className="text-sm text-muted-foreground">Token Balance</p>
          <p className="text-lg font-semibold text-right">
            {tokenBalance
              ? `${formatBalance(tokenBalance.value, 2)} ${tokenBalance.symbol}`
              : "..."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
