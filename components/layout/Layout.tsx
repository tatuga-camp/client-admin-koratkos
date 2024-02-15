import React, { Children } from 'react'
import Navbar from './Navbar'
import { RiArrowGoBackFill } from "react-icons/ri";
import Footer from './Footer';

const Layout = ({children}) => {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}

export default Layout
