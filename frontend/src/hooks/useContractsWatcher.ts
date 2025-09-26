import { type Abi } from "viem";
import { useReadContracts, useWatchBlockNumber } from "wagmi";

interface ContractToWatch {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: any[];
}

export const useContractsWatcher = (contracts: ContractToWatch[]) => {
  const { data, refetch, ...rest } = useReadContracts({
    contracts,
    query: {
      refetchOnWindowFocus: true,
    },
  });

  // Watch for new blocks and refetch data when a new block is mined
  useWatchBlockNumber({
    onBlockNumber: (_blockNumber, prevBlockNumber) => {
      // Refetch if it's a new block
      void refetch();
    },
  });

  return { data, refetch, ...rest };
};
