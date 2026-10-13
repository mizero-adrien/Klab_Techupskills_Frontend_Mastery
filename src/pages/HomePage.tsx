//home page
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../components/Home/SectionHeading";
import { smartphoneDeals } from "../data/Home";
import ProductCard from "../components/Home/ProductCard";



export const slides = [
  { id: 1, eyebrow: "Best Deal Online on smart watches", title: "SMART WEARABLE.", subtitle: "UP to 80% OFF" },
  { id: 2, eyebrow: "New arrivals in mobiles", title: "LATEST SMARTPHONES.", subtitle: "UP to 60% OFF" },
  { id: 3, eyebrow: "Fresh every morning", title: "DAILY ESSENTIALS.", subtitle: "UP to 50% OFF" },
  { id: 4, eyebrow: "Make your home yours", title: "HOME & DECOR.", subtitle: "UP to 40% OFF" },
  { id: 5, eyebrow: "Sound that moves you", title: "AUDIO SALE.", subtitle: "UP to 70% OFF" },
  { id: 6, eyebrow: "Style for every season", title: "FASHION FINDS.", subtitle: "UP to 55% OFF" },
  { id: 7, eyebrow: "Work smarter", title: "LAPTOP DEALS.", subtitle: "UP to 35% OFF" },
];

function HomePage() {

    const [index, setIndex] = useState(0);
    const slide = slides[index];

    const prev = () => setIndex((i) => (i-1 + slides.length) % slides.length);
    const next = () => setIndex((i) => (i+1) % slides.length);

    useEffect(() => {
       const timer = setTimeout(next, 5000);
       return () => clearTimeout(timer);
}, [index]);

  return (
    <>
    <section className="relative  mx-auto mt-4 max-w-7xl px-4">
      <div className="relative flex min-h-\[280px] overflow-hidden items-center rounded-2xl bg-[#1f2547] px-16 py-14 text-white">
        <div>
            <p className="text-lg ">{slide.eyebrow}</p>
            <h1 className="mt-2 text-5xl font-bold">{slide.title}</h1>
            <p className="mt-3 text-xl">{slide.subtitle}</p>

        </div>
        <div className="absolute bottom-5 left-16 flex gap-1.5">
  {slides.map((s, i) => (
    <button
      key={s.id}
      type="button"
      aria-label={`Go to slide ${i + 1}`}
      onClick={() => setIndex(i)}
      className={`h-1.5 rounded-full transition-all ${
        i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
      }`}
    />
  ))}
</div>
      </div>

      <button 
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className = "absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md"
      > 
        <ChevronLeft size={20}/>
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md"
      >
        <ChevronRight size={20} />
      </button>
    </section>  //end of hero section

//section for smartphone deals
     <section className="mx-auto max-w-7xl px-4 py-8">
  <SectionHeading title="Grab the best deal on" highlight="Smartphones" />
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
    {smartphoneDeals.map((deal) => (
      <ProductCard key={deal.id} deal={deal} />
    ))}
  </div>
</section>

   
</>
    
  );    
}

export default HomePage;