import HeroBanner from "../components/Home/HeroBanner";
import SectionHeading from "../components/Home/SectionHeading";
import ProductCard from "../components/Home/ProductCard";
import TopCategories from "../components/Home/TopCategories";
import { smartphoneDeals } from "../data/Home";
import DailyEssentials from "../components/Home/DailyEssentials";
import TopBrands from "../components/Home/TopBrands";

function HomePage() {
  return (
    <>
      <HeroBanner />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionHeading title="Grab the best deal on" highlight="Smartphones" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {smartphoneDeals.map((deal) => (
            <ProductCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      <TopCategories />
      <TopBrands />
      <DailyEssentials />
    </>
  );
}

export default HomePage;