import HeroBanner from "../components/Home/HeroBanner";
import SmartphoneDeals from "../components/Home/SmartPhoneDeals";
import TopCategories from "../components/Home/TopCategories";
import TopBrands from "../components/Home/TopBrands";
import DailyEssentials from "../components/Home/DailyEssentials";

function HomePage() {
  return (
    <>
      <HeroBanner />
      <SmartphoneDeals />
      <TopCategories />
      <TopBrands />
      <DailyEssentials />
    </>
  );
}

export default HomePage;