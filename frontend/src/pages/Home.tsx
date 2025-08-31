import  CategoriesGrid from '../components/CategoriesGrid';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import DiscountProductCarousel from '../components/DiscountProductCarousel';
import StoreLocationMap from '../components/StoreLocationMap';


function Home() {
  return (
    <div>
      <Hero />
      <ProductCarousel />
      <CategoriesGrid />
      <DiscountProductCarousel />
      <StoreLocationMap />
    </div>
  );
}

export default Home;