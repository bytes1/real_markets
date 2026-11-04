"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatEther } from "viem";
import { LogOut, Settings, User, Wallet, Loader2 } from "lucide-react";
import Link from "next/link";
// --- SHADCN UI COMPONENTS ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// --- END OF SHADCN UI IMPORTS ---

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function WalletButton() {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // This is the fix. We are telling ESLint to ignore this line
    // because we are intentionally causing a second render to fix hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  const { address, isConnected, isConnecting } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: 5151, // Make sure this is your correct chainId
  });
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- RENDER LOGIC ---

  // 1. On the server, and during initial client render (before useEffect),
  //    render a static, disabled button. This prevents the mismatch.
  if (!isClient) {
    return (
      <Button disabled>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  // 2. Loading state (Client-side only)
  if (isConnecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // 3. Connected state (Client-side only)
  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                {address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="text-xs text-muted-foreground">Address</span>
              <span className="font-mono">{truncateAddress(address)}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="text-xs text-muted-foreground">
                Moca Balance
              </span>
              <span className="font-mono">
                {balance
                  ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${
                      balance.symbol
                    }`
                  : "Loading..."}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 4. Disconnected state (Client-side only)
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setIsModalOpen(false);
              }}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {connector.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
