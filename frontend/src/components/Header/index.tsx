import { Connect } from "./connect";
import { useAccount } from "wagmi";
import WalletBalance from "../WalletBalance";

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
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
    <div className="flex items-center justify-between p-4 bg-background text-foreground">
      <div className="flex gap-6">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          True Markets
        </h1>
        <button
          onClick={handleNewFeatureClick}
          className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
        >
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-30"></span>
          <StarIcon className="mr-2 h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-180" />
          <span>Credential Issuance</span>
        </button>
      </div>
      <div className="flex gap-2">
        {isConnected && <WalletBalance />}
        <Connect />
      </div>
    </div>
  );
};
