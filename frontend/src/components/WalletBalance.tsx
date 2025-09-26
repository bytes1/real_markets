import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { SPECIFIED_TOKEN_ADDRESS } from "../utils/constants";
import { cn } from "../utils/cn";
import { CopyButton } from "./CopyButton";

export default function WalletBalance() {
  const { address, chainId } = useAccount();

  const { data: nativeBalance } = useBalance({
    address,
  });

  const { data: tokenBalance } = useBalance({
    address,
    token: SPECIFIED_TOKEN_ADDRESS(chainId!),
  });

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div
      className={cn("flex items-center space-x-4 p-4 rounded-lg bg-gray-100")}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">Native Balance</p>
        <p className="text-lg font-semibold text-gray-900">
          {nativeBalance
            ? `${formatEther(nativeBalance.value)} ${nativeBalance.symbol}`
            : "Loading..."}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Token Balance</p>
        <p className="text-lg font-semibold text-gray-900">
          {tokenBalance
            ? `${formatEther(tokenBalance.value)} ${tokenBalance.symbol}`
            : "Loading..."}
        </p>
      </div>
      {address && (
        <div className="flex items-center space-x-2">
          <p className="text-sm font-mono text-gray-600">{truncatedAddress}</p>
          <CopyButton text={address} />
        </div>
      )}
    </div>
  );
}
