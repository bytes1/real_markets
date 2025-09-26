import { Button } from "@/components/ui/button"; // Assuming you have shadcn button

// --- Sub-components for better organization ---

const LargeBanner = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1d] text-white p-8 md:p-12 lg:p-16 rounded-lg overflow-hidden">
      {/* Background patterns/shapes (adjust as needed for exact match) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <circle cx="20" cy="80" r="15" fill="purple" opacity="0.5" />
          <rect
            x="60"
            y="10"
            width="30"
            height="30"
            fill="cyan"
            opacity="0.4"
          />
          <polygon points="50,0 60,20 40,20" fill="magenta" opacity="0.6" />
        </svg>
      </div>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://via.placeholder.com/1500x500/000000/FFFFFF?text=Background+Pattern')",
        }}
      ></div>

      <div className="relative z-10 max-w-5xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          TRADE ON TRUE MARKETS <br />
          <span className="flex items-center gap-4">
            <span className="inline-block transform -rotate-45 text-purple-400">
              →
            </span>
            FORECAST
          </span>
          THE FUTURE
        </h1>
        <Button
          variant="default"
          className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-lg shadow-lg"
        >
          START TRADING
        </Button>
      </div>
    </div>
  );
};

interface SmallCardProps {
  title: string;
  description?: string;
  bgColor: string;
  textColor?: string;
  hasLiveIndicator?: boolean;
}

const SmallCard = ({
  title,
  description,
  bgColor,
  textColor = "text-white",
  hasLiveIndicator = false,
}: SmallCardProps) => {
  return (
    <div
      className={`relative ${bgColor} ${textColor} p-6 rounded-lg h-full flex flex-col justify-between`}
    >
      {hasLiveIndicator && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE
        </span>
      )}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  );
};

// --- Main Hero Section Component ---
export const HeroSection = () => {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <LargeBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SmallCard title="Points" bgColor="bg-[#1a1a2e]" />
        <SmallCard
          title="Hourly  Challenge"
          description="$10k USDC prize pool  Enroll and start trading" // Use \n for line breaks
          bgColor="bg-lime-300"
          textColor="text-black"
          hasLiveIndicator={true}
        />
      </div>
    </div>
  );
};
