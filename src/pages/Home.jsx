import React from 'react'
import HeroSection from '../components/Hero'
import HeroSecondSection from '../components/HeroSecondSection'
import ExpertiseStack from '../components/ExpertiseStacking'
import FamilyTestimonials from '../components/Testimonials'
import Cta from '../components/utils/CTA'
import JoinNow from '../components/utils/joinnowbutton'

function Home() {

  return (
    <div>
     
     <HeroSection/> 
    
     <HeroSecondSection/>
     
     <ExpertiseStack/>
     <FamilyTestimonials/>
     <Cta/>
    </div>
  )
}

export default Home
