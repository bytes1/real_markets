import { useState, useEffect, type FormEvent } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Layout } from "@/components/layouts/Layout";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/CopyButton";
import { SPECIFIED_TOKEN_ADDRESS } from "@/utils/constants";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const API_URL = "http://localhost:3000/api/user"; // This is the API route

// Define the shape of the email preferences
interface EmailPreferences {
  dailyDigest: boolean;
  newMarketAlerts: boolean;
  tradeUpdates: boolean;
}

// +++ THIS IS THE FIX (Part 1) +++
// We provide a default object to useState.
const defaultPreferences: EmailPreferences = {
  dailyDigest: false,
  newMarketAlerts: false,
  tradeUpdates: false,
};

export function ProfilePage() {
  const { address, chainId, isConnected } = useAccount();

  // --- Wallet Balances State ---
  const { data: nativeBalance } = useBalance({ address });

  const { data: specifiedTokenBalance } = useBalance({
    address,
    token: SPECIFIED_TOKEN_ADDRESS(chainId!),
  });

  // --- Profile Form State ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // +++ THIS IS THE FIX (Part 1) +++
  // Initialize the state with the default object.
  const [preferences, setPreferences] =
    useState<EmailPreferences>(defaultPreferences);

  // --- API/Loading State ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // --- Fetch User Profile ---
  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true);
      fetch(`${API_URL}?walletAddress=${address}`)
        .then((res) => res.json())
        .then((data) => {
          // data is now FLAT. We must un-flatten it for the form state.
          setUsername(data.username || "");
          setEmail(data.email || "");
          setPreferences({
            dailyDigest: data.emailPref_dailyDigest || false,
            newMarketAlerts: data.emailPref_newMarketAlerts || false,
            tradeUpdates: data.emailPref_tradeUpdates || false,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          setStatusMessage("Error: Could not load profile.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isConnected, address]);

  // --- Handle Form Submit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsSaving(true);
    setStatusMessage("Saving...");

    try {
      // The data we send to the API remains nested.
      // The API is responsible for flattening it.
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          username,
          email,
          emailPreferences: preferences, // Send the nested state
        }),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const updatedUser = await response.json(); // This is the new flat user object

      // Resync state by un-flattening the response
      setUsername(updatedUser.username || "");
      setEmail(updatedUser.email || "");
      setPreferences({
        dailyDigest: updatedUser.emailPref_dailyDigest || false,
        newMarketAlerts: updatedUser.emailPref_newMarketAlerts || false,
        tradeUpdates: updatedUser.emailPref_tradeUpdates || false,
      });

      setStatusMessage("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setStatusMessage("Error: Could not save profile.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  // --- Helper functions ---
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const formatBalance = (value: bigint, decimals: number = 4) => {
    if (!value) return (0.0).toFixed(decimals);
    return parseFloat(formatEther(value)).toFixed(decimals);
  };

  // --- Checkbox change handler ---
  const handlePreferenceChange = (key: keyof EmailPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header />
      <Layout>
        <div className="container mx-auto p-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Profile & Settings */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your public profile and email notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Public Profile Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">Public Profile</h4>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Your display name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSaving || isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSaving || isLoading}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Email Preferences Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">
                      Email Notifications
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dailyDigest"
                        // +++ THIS IS THE FIX (Part 2) +++
                        // Add optional chaining (?.) as a safety net.
                        checked={preferences?.dailyDigest}
                        onCheckedChange={() =>
                          handlePreferenceChange("dailyDigest")
                        }
                        disabled={isSaving || isLoading}
                      />
                      <Label htmlFor="dailyDigest" className="font-normal">
                        Daily digest of market activity
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newMarketAlerts"
                        // +++ THIS IS THE FIX (Part 2) +++
                        checked={preferences?.newMarketAlerts}
                        onCheckedChange={() =>
                          handlePreferenceChange("newMarketAlerts")
                        }
                        disabled={isSaving || isLoading}
                      />
                      <Label htmlFor="newMarketAlerts" className="font-normal">
                        Alerts for new markets
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tradeUpdates"
                        // +++ THIS IS THE FIX (Part 2) +++
                        checked={preferences?.tradeUpdates}
                        onCheckedChange={() =>
                          handlePreferenceChange("tradeUpdates")
                        }
                        disabled={isSaving || isLoading}
                      />
                      <Label htmlFor="tradeUpdates" className="font-normal">
                        Updates on your trades and positions
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {statusMessage}
                  </span>
                  <Button
                    type="submit"
                    disabled={isSaving || isLoading || !isConnected}
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          {/* Column 2: Wallet & Balances (This part is fine) */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>My Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Wallet Address Display */}
                {isConnected && address ? (
                  <div>
                    <h3 className="text-md font-semibold mb-2">My Address</h3>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-secondary">
                      <span className="text-sm font-mono text-secondary-foreground">
                        {truncatedAddress}
                      </span>
                      <CopyButton text={address} />
                    </div>
                  </div>
                ) : (
                  <p>Please connect your wallet.</p>
                )}

                {/* Balances Display */}
                {isConnected && (
                  <div>
                    <h3 className="text-md font-semibold mb-3">
                      Token Balances
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm text-muted-foreground">
                          Native Balance
                        </p>
                        <p className="text-lg font-semibold text-right">
                          {nativeBalance
                            ? `${formatBalance(nativeBalance.value)} ${
                                nativeBalance.symbol
                              }`
                            : "..."}
                        </p>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm text-muted-foreground">
                          {specifiedTokenBalance?.symbol || "Token"} Balance
                        </p>
                        <p className="text-lg font-semibold text-right">
                          {specifiedTokenBalance
                            ? `${formatBalance(
                                specifiedTokenBalance.value,
                                2
                              )} ${specifiedTokenBalance.symbol}`
                            : "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ProfilePage;
