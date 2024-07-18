import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/footer";
import Home from "../pages/home/home";
import { Customers } from "../pages/customer/customers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerDetails } from "../pages/customer/CustomerDetails";

const AppRouter = () => {
  return (
    <div className="d-md-flex mt-5 ">
      <BrowserRouter>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default AppRouter;
