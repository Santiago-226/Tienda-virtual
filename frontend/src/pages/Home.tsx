import Hero from '../components/Hero';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ProductCarousel from '../components/ProductCarousel';

function Home() {
  return (
    <div>
      <Hero />
      <ProductCarousel/>
      <Services />
      <AboutUs />
    </div>
  );
}

export default Home;