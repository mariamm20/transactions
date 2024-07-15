import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar , Footer } from './components/layout';
import Home from './components/home';
import { Customers } from './components/customers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerDetails } from './components/CustomerDetails';
function App(){
  return (
    <div className=''>
    <BrowserRouter>
    <div className='d-flex flex-lg-nowrap flex-wrap justify-content-lg-baseline justify-content-center align-items-lg-baseline align-items-center'>
      <Navbar/>
<Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/customers" element={<Customers/>} />
    <Route path="/customers/:id" element={<CustomerDetails/>} />
</Routes>
</div>
    <Footer/>
    </BrowserRouter>
    
    </div>
    
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


