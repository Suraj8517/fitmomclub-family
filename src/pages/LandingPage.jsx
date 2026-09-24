import React from 'react'
import Home from './Home'
import Header from '../components/utils/Header'
import { Routes, Route } from "react-router-dom";
import About from './About';
import Services from './services';  
import Contact from './contact';
function LandingPage() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/contact-us' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default LandingPage
