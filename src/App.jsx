import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import { CartProvider } from "./context/CartContext";

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);

  const handleOrderPopup = () => setOrderPopup(!orderPopup);

  useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({ offset: 100, duration: 800, easing: "ease-in-sine", delay: 100 });
      AOS.refresh();
    });
  }, []);

  return (
    <CartProvider>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar />
        <Hero />
        <Products />
        <TopProducts />
        <Banner />
        <Subscribe />
        <Testimonials />
        <Footer />
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      </div>
    </CartProvider>
  );
};

export default App;
