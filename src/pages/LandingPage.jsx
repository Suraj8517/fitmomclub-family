import React from 'react'
import Home from './Home'
import Header from '../components/utils/Header'
import { Routes, Route, useLocation } from "react-router-dom";
import About from './About';
import Services from './services';  
import Contact from './contact';
import Footer from '../components/utils/Footer';
import NotFound from './notFound';
import ScrollToTop from '../components/utils/scrollToTop';
import BlogList from './blogList';
import BlogPost from './blogPost';
import JoinNow from '../components/utils/joinNowButton';

function LandingPage() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/contact-us' element={<Contact />} />
        <Route path="blogs" element={<BlogList/>}/>
        <Route path="/blogs/:slug" element={<BlogPost/>}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      {!isHome && <Footer />}
    </div>
  )
}

export default LandingPage