import { Connect } from "./connect";
import { useAccount } from "wagmi";
import { WalletPopover } from "../WalletPopover";
import { Star } from "lucide-react";

export const Header = () => {
  const { isConnected } = useAccount();

  const handleNewFeatureClick = () => {
    window.open(
      "https://realmarkets.vercel.app",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">True Markets</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleNewFeatureClick}
          className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-foreground"
        >
          <Star className="w-4 h-4" />
          <span>Credential Issuance</span>
        </button>
        {isConnected && <WalletPopover />}
        <Connect />
      </div>
    </header>
  );
};
