import { Header } from "./components/Header";
import { MarketsPage } from "./components/MarketsPage";
import { HeroSection } from "@/components/HeroSection";
export const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <MarketsPage />
    </div>
  );
};
