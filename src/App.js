import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Headers from "./componets/Headers/Headers";
import MainMenu from "./componets/MainMenu/MainMenu";
import ProductList from "./componets/ProductList/ProductList";
import Profile from "./componets/Profile/Profile";
import About from "./componets/About/About";
import Footer from "./componets/Footer/Footer";
import Contact from "./componets/ContactUs/ContactUs";
import Login from "./componets/Login/Login";
import Register from "./componets/Register/Register";
import Cart from "./componets/Cart/Cart";
import SignupPopup from "./componets/SignUpPopUp/SignUpPopUp";
import Home from "./componets/Home/Home";
import ProductDetails  from "./componets/ProductDetails/ProductDetails";
import ProductManagement from "./componets/Admin/ProductManagement";
import AdminLogin from "./componets/AdminLogin/AdminLogin";
// Admin importing 
import Navbar from "./componets/Admin/Navbar/Navbar";
import AddAdmin from "./componets/Admin/AddAdmin/AddAdmin";
import AddCategory from "./componets/Admin/AddCategory/AddCategory";
import AddProducts from "./componets/Admin/AddProducts/AddProducts";
import Orders from "./componets/Admin/Orders/Orders";
import Users from "./componets/Admin/Users/Users";
import ViewProducts from "./componets/Admin/ViewProducts/ViewProducts";
import CarousalAdmin from "./componets/Admin/AdminCarousel/Admincarousel";
//Delivery
import Delivery from "./componets/DeliveryBoy/Dashboard";
import DeliveryHome from "./componets/DeliveryBoy/DeliveryHome/DeliveryHome";
import "./App.css";

function App() {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // Cart state to hold added items

  // Function to handle adding products to the cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // If product already exists in cart, increase its quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Add new product to the cart
        return [...prevCart, { ...product, quantity: product.quantity }];
      }
    });
  };

  // Function to handle removing products from the cart
  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Function to handle quantity change in the cart
  const handleQuantityChange = (id, action) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1, // Ensure quantity doesn't go below 1
            }
          : item
      )
    );
  };

  // Function to toggle the signup popup
  const toggleSignupPopup = () => setSignupOpen(!isSignupOpen);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Login and Register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Headers />
                <MainMenu />
                <Home />
                <Footer />
              </>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={
              <>
                <Headers />
                <MainMenu />
                <About />
                <Footer />
              </>
            }
          />

          {/* Contact Page */}
          <Route
            path="/contact"
            element={
              <>
                <Headers />
                <MainMenu />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Cart Page */}
          <Route
            path="/cart"
            element={
              <>
                <Headers />
                <MainMenu />
                <Cart
                  cartItems={cart}
                  handleQuantityChange={handleQuantityChange} // Pass the function to Cart
                  handleRemoveFromCart={handleRemoveFromCart}
                />
                <Footer />
              </>
            }
          />
          {/* ProductDetails */}
      <Route path="/product/:productId" element={<ProductDetails />} />
          {/* Add Products */}
          <Route
            path="/add-products"
            element={
              <>
                <AddProducts />
                <Footer />
              </>
            }
          />
          {/* Profile Section */}
          <Route path="/profile" element={<Profile/>} />
          {/* Category Page */}
          <Route
            path="/category/:category"
            element={
              <>
                <Headers />
                <MainMenu />
                <ProductList handleAddToCart={handleAddToCart} />
                <Footer />
              </>
            }
          />

          {/* Product Management Page */}
          <Route
            path="/product-management"
            element={
              <>
                <Headers />
                <MainMenu />
                <ProductManagement />
              </>
            }
          />


<Route
            path="/adminLogin"
            element={
              <>
                <AdminLogin/>
              </>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <>
                <Navbar />
                <AddProducts />
              </>
            }
          />
          <Route path="/admin/add-product" element={
            <>
           <Navbar />
            <AddProducts />
            </>
            } />

          <Route path="/admin/add-category" element={
            
            <>
           <Navbar />
            <AddCategory />
            </>} />
          <Route path="/admin/view-products" element={
              <>
            <Navbar />
            <ViewProducts/>
              </>
            } />
          <Route path="/admin/orders" element={
               <>
              <Navbar />
               <Orders/>
               </>
          } />
          <Route path="/admin/users" element={   <>
            <Navbar />
            <Users/>
            </>} />
            <Route path="/admin/users" element={   <>
            <Navbar />
            <AddCategory/>
            </>} />
          <Route path="/admin/add-admin" element={   <>
            <Navbar />
            <AddAdmin/>
            </>} />
            <Route path="/admin/CarousalAdmin" element={   <>
            <Navbar />
            <CarousalAdmin/>
            </>} />

          {/*Dlivery boy interface */}
            <Route path="/Delivery/Dashboard" element={   <>
              <Navbar />
           <Delivery/>
           </>} />    
       
                <Route path="/Delivery/Home" element={   <>
                
           <DeliveryHome/>
           </>} />
            
        </Routes>


        {/* Render Signup Popup if it's open */}
        {isSignupOpen && <SignupPopup onClose={toggleSignupPopup} />}
      </Router>
    </div>
  );
}

export default App;
