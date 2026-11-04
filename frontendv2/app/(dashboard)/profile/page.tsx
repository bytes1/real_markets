// app/profile/page.tsx (or any other path)
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription, // Added
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Star,
  CircleDollarSign,
  Trophy,
  Search,
  Loader2,
  Wallet,
} from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

// --- TODO: ADD YOUR MUSD TOKEN ADDRESS ---
const MUSD_TOKEN_ADDRESS = "0xE73559ce9FD6dde324210A4D250610F41728029d";

// Helper to truncate address
const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// A small sub-component for the stat cards
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// --- NEW: Component to show when wallet is not connected ---
function ConnectWalletPrompt() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Page</CardTitle>
          <CardDescription>
            Please connect your wallet to view your profile and portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>Use the Connect Wallet button in the header.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);
  // --- END HYDRATION FIX ---

  // --- WAGMI HOOKS ---
  const { address, isConnected } = useAccount();
  const { data: musdBalance, isLoading: isBalanceLoading } = useBalance({
    address: address,
    token: MUSD_TOKEN_ADDRESS,
    query: {
      enabled: isConnected && !!address, // Only fetch if connected
    },
  });
  // --- END WAGMI HOOKS ---

  // Format balance
  const balanceString = musdBalance
    ? `$${parseFloat(formatEther(musdBalance.value)).toFixed(2)}`
    : "$0";

  // --- NEW RENDER LOGIC ---

  // 1. Show a full-page loader on server and initial hydration
  if (!isClient) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-4 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 2. Show the "Connect Wallet" prompt if not connected
  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  // 3. Render the full profile page (we are connected and client-side)
  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* === TOP HEADER SECTION === */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/path-to-your-avatar.png" alt="User" />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-purple-500 to-blue-500">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {truncateAddress(address!)}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground font-mono">
                  {truncateAddress(address!)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => navigator.clipboard.writeText(address!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            <StatCard
              title="Points"
              subtitle="Profit/Loss"
              value="0 pts"
              icon={Star}
            />
            <StatCard
              title="MUSD"
              subtitle="Profit/Loss"
              value={balanceString}
              icon={CircleDollarSign}
              isLoading={isBalanceLoading}
            />
            <StatCard
              title="Rank"
              subtitle="Current Rank"
              value="89,992"
              icon={Trophy}
            />
          </div>
        </header>

        {/* === MAIN CONTENT TABS === */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="portfolio" className="w-full">
              {/* Tab Triggers */}
              <TabsList className="mb-4">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="referral-points">
                  Referral Points
                </TabsTrigger>
              </TabsList>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search predictions"
                      className="pl-10 w-full md:w-80"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All Topics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Newest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Market</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Invested</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Current value</TableHead>
                        <TableHead>PNL</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-48 text-center text-muted-foreground"
                        >
                          No markets found. Try changing the filters.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Other Tabs (Empty) */}
              <TabsContent value="history">
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  History content goes here.
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Activity content goes here.
                </div>
              </TabsContent>
              <TabsContent value="referral-points">
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Referral Points content goes here.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
