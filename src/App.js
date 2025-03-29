import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home';
import Navbar from './component/Navbar';
import Signin from './component/Signin';
import Signup from './component/Signup';
import ForgotPassword from "./component/ForgotPassword"
import Slider from './component/Slider';
import Category_slide from './component/Category-slide/Category_slide';
import Product from './component/Product';
import Account from './component/Account';
import Cart from './component/Cart';
import Order from './component/Order';









function App() {
  return (
    <>

      <Routes>

        <Route path='/' element={<Home />}></Route>
        <Route path='/Navbar' element={<Navbar />}></Route>
        <Route path='/Signin' element={<Signin />}></Route>
        <Route path='/Signup' element={<Signup />}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/Slider' element={<Slider />}></Route>
        <Route path='/Account' element={<Account/>} ></Route>
        <Route path='/cart' element={<Cart/>} ></Route>
        <Route path='/Order' element={<Order/>}></Route>

        <Route path='Category_slide' element={<Category_slide />}></Route>
        <Route path='/Product' element={<Product/>}></Route>
    

      </Routes>




    </>

  );
}

export default App