import  CategoriesGrid from '../components/CategoriesGrid';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import DiscountProductCarousel from '../components/DiscountProductCarousel';


function Home() {
  return (
    <div>
      <Hero />
      <ProductCarousel />
      <CategoriesGrid />
      <DiscountProductCarousel />
    </div>
  );
}

export default Home;