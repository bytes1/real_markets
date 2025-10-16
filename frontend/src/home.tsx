import { Header } from "./components/Header";
import { MarketsPage } from "./components/MarketsPage";
import { HeroSection } from "@/components/HeroSection";
import { ExclusiveMarkets } from "@/components/ExclusiveMarkets";
export const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <MarketsPage />
      <div className="mt-8">
        <ExclusiveMarkets />
      </div>
    </div>
  );
};
