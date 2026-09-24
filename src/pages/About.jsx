import React from 'react'
import AboutHero from '../components/aboutus/Hero'
import WorkShowcase from '../components/aboutus/Team'
import MissionSection from '../components/aboutus/MissionSection'
import OurValuesSection from '../components/aboutus/ourValues'

function About() {
  return (
    <div>
      <AboutHero/>
      <MissionSection/>
      <WorkShowcase/>
      <OurValuesSection/>
    </div>
  )
}

export default About
