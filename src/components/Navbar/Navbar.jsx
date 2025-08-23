import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import { FiShoppingBag } from "react-icons/fi";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext"; // ✅ import context

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart(); // ✅ get cart items

  const toggleCart = () => setCartOpen(!cartOpen);

  return (
    <div className="shadow-md bg-white dark:bg-slate-800 dark:text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <a href="#" className="font-bold text-xl flex items-center gap-1">
              <FiShoppingBag size="30" /> ShopMe
            </a>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input type="text" placeholder="Search"
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-lg border border-gray-300 py-1 px-2
                text-sm focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-slate-800"
              />
              <IoMdSearch className="text-slate-800 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3"/>
            </div>
            <button onClick={toggleCart} className="relative bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-2">
              <FaCartShopping className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <DarkMode />
          </div>
        </div>
      </div>

      {cartOpen && <Cart onClose={toggleCart} />}
    </div>
  );
};

export default Navbar;

