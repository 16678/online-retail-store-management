import React, { useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sample from './componets/Admin/sample/sample.js';
import Headers from "./componets/Headers/Headers";
import MainMenu from "./componets/MainMenu/MainMenu";
import ProductList from "./componets/ProductList/ProductList.js";
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
import ImageUploader from "./componets/ImageUploader/ImageUploader";
import ForgotPassword from "./componets/ForgotPassword/ForgotPassword";
// Admin importing 
import Navbar from "./componets/Admin/Navbar/Navbar";
import DeliveryDashboard from "./componets/Admin/AdminDeliveryDashboard/DeliveryDashboard.js";
import AdminCartManager from "./componets/Admin/AdminCartManager/AdminCartManager.js";
import AddAdmin from "./componets/Admin/AddAdmin/AddAdmin";
import AddCategory from "./componets/Admin/AddCategory/AddCategory";
import AddProducts from "./componets/Admin/AddProducts/AddProducts";
import Orders from "./componets/Admin/Orders/Orders";
import Customers from "./componets/Admin/Customers/Customers";
import ViewProducts from "./componets/Admin/ViewProducts/ViewProducts";
import CarousalAdmin from "./componets/Admin/AdminCarousel/Admincarousel";
import AssignOrders from "./componets/Admin/AssignOrders/AssignOrders.js";
import AdminManagement from "./componets/Admin/AdminManagement/AdminManagement";
import CategoryAdmin from "./componets/Admin/CategoryAdmin/CategoryAdmin";
import DeliveryBoyList from "./componets/Admin/DeliveryBoyList/DeliveryBoyList";
import AdminCategoryUploader from "./componets/Admin/CategoryUploader/CategoryUploader.js";
import DeliveryBoyQRCode from "./componets/Admin/DeliveryBoyQRCode/DeliveryBoyQRCode.js";
//Delivery
import Delivery from "./componets/DeliveryBoy/Dashboard/Dashboard";
import DeliveryBoyLogIn from "./componets/DeliveryBoy/DeliveryBoyLogIn/DeliveryBoyLogIn.js";
// import OrderScanner from "./componets/DeliveryBoy/OrderScanner/OrderScanner.js";
import DeliveryHome from "./componets/DeliveryBoy/DeliveryHome/DeliveryHome";
 import DeliveryBoyRegistration from './componets/DeliveryBoy/Registartion/Registration.js';
import ProductSearch from "./componets/ProductSearch/ProductSearch";
import DeliveryBoyProfile from "./componets/DeliveryBoy/DeliveryBoyProfile/DeliveryBoyProfile";
import DeliveryAssignedOrders from "./componets/DeliveryBoy/DeliveryAssignedOrders/DeliveryAssignedOrders.js";
import  OrderDetails from "./componets/DeliveryBoy/OrderDetails/OrderDetails.js";
import DeliveryBoyScanner from "./componets/DeliveryBoy/DeliveryBoyScanner/DeliveryBoyScanner.js";
import "./App.css";
import SearchResults from "./componets/SearchResults/SearchResults.js";
import  DeliveryEarnings from "./componets/DeliveryBoy/DeliveryEarnings/DeliveryEarnings.js";

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
          <Route path="/profile" element={<>
               <Headers />
                <MainMenu />
                <Profile />
          </>} />

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
           <Route
            path="/sample"
            element={
            
              
                <Sample/>
              
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
              <>  <Headers />
                <MainMenu />
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
          <Route
            path="/product/:id"
            element={
              <>
                <Headers />
                <MainMenu />
                <ProductDetails/>
                <Footer />
              </>
            }
          /><Route
            path="/search"
            element={
              <>
               <Headers />
                <MainMenu />
                <SearchResults/>
                 <Footer />
               
              </>
            }
          />
            <Route
            path="/ForgotPassword"
            element={
              <>
                <ForgotPassword/>
               
              </>
            }
          />
           <Route
            path="/ProductSearch"
            element={
              <>
                <ProductSearch/>
               
              </>
            }
          />

          {/* Product Management Page
          <Route
            path="/product-management"
            element={
              <>
                <Headers />
                <MainMenu />
                <ProductManagement />
              </>
            }
          /> */}
   {/*Image Uploader */}
   <Route
            path="/imageUploader"
            element={
              <>
                <ImageUploader/>
                
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
          <Route
            path="/Addcategory"
            element={
              <>
                <AddCategory/>
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
               <Route
            path="/admin/CategoryAdmin"
            element={
              <>
                <Navbar />
                <CategoryAdmin/>
              </>
            }
          />
           {/* Admin Management */}
           <Route
            path="/admin/management"
            element={
              <>
                
                <AdminManagement/>
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                
                <AdminManagement/>
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
            {/* <Navbar /> */}
            <ViewProducts/>
              </>
            } />
          <Route path="/admin/orders" element={
               <>
            
               <Orders/>
               </>
          } />
          <Route path="/admin/Customers" element={   <>
            <Navbar />
            < Customers/>
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
            <Route path="/admin/CategoryUploader" element={   <>
            <Navbar />
            <AdminCategoryUploader/>
            </>} />

            <Route path="/admin/DeliveryBoyList" element={   <>
            
            <DeliveryBoyList/>
            </>} />

            <Route path="/admin/AssignOrders" element={   <>
            <Navbar />
            <AssignOrders/>
            </>} />
            
                {/* <Route path="/admin/TrackDeliveries" element={   <>
            <Navbar />
            <TrackDeliveries/>
            </>} /> */}

           <Route path="/admin/DeliveryDashboard" element={   <>
            <Navbar />
            <DeliveryDashboard/>
            </>} />
             <Route path="/admin/AdminCartManager" element={   <>
         
            <AdminCartManager/>
            </>} />

            <Route path="/Admin/AddDeliveryBoy" element={   <>
                   <Navbar />
                <DeliveryBoyRegistration/>
                </>} />
                  <Route path="/Admin/DeliveryBoyQRCode" element={   <>
                   <Navbar />
                <DeliveryBoyQRCode/>
                </>} />
          {/*Dlivery boy interface */}


            <Route path="/Delivery/Dashboard" element={   <>
             
           <Delivery/>
           <DeliveryHome/>
     
           </>} />  
            
             <Route path="/Delivery/DeliveryBoyLogIn" element={   <>
            
           <DeliveryBoyLogIn/>
     
           </>} /> 
       
                <Route path="/Delivery/Home" element={   <>
                  <Delivery/>
           <DeliveryHome/>
           </>} />
           <Route path="/Delivery/Profile" element={   <>
            <Delivery/>
       
                <DeliveryBoyProfile/>
                </>} />
        
            
                 {/* <Route path="/Delivery/OrderScanner" element={   <>
                   
                <OrderScanner/>
                </>} /> */}

                <Route path="/Delivery/Registration" element={   <>
                <Delivery/>
                <DeliveryBoyRegistration/>
                </>} />

                     <Route path="/Delivery/DeliveryAssignedOrders" element={   <>
                     <Delivery/>
                <DeliveryAssignedOrders/>
                </>} />

                  <Route path="/Delivery/OrdersPage" element={   <>
                  <Delivery/>
                <OrderDetails/>
                </>} />

                  <Route path="/Delivery/DeliveryBoyScanner" element={   <>
                  <Delivery/>
                <DeliveryBoyScanner/>
                </>} />

            <Route path="/Delivery/DeliveryEarnings" element={   <>
                  <Delivery/>
                <DeliveryEarnings/>
                </>} />
                DeliveryEarnings

        </Routes>
        
            
        


        {/* Render Signup Popup if it's open */}
        {isSignupOpen && <SignupPopup onClose={toggleSignupPopup} />}
      </Router>
    </div>
  );
}

export default App;
