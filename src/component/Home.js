import React from 'react'
import Navbar from './Navbar'
import Slider from "./Slider"
import Category_slide from "./Category-slide/Category_slide"
import Product from './Product'
const Home = () => {
  return (
    <>

      <Navbar />
      <Slider/>
      <Category_slide/>
      <Product/>

    </>
  )
}

export default Home
