import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar , Footer } from './components/layout';
import Home from './components/Home';
import { Customers } from './components/customers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App(){
  return (
    <>
    <BrowserRouter>
      <Navbar/>
<Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/customers" element={<Customers/>} />
</Routes>
    <Footer/>
    </BrowserRouter>
    
    </>
    
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


