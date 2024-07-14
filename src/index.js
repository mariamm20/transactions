import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar , Footer } from './components/layout';
import Home from './components/home';
import { Customers } from './components/customers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App(){
  return (
    <div className=''>
    <BrowserRouter>
    <div className='d-flex flex-lg-nowrap flex-wrap'>
      <Navbar/>
<Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/customers" element={<Customers/>} />
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


