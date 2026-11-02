import TechLandingHero from '@/components/sections/TechLandingHero'
import HomeAbout from '@/components/sections/HomeAbout'
import HomeHowWeWork from '@/components/sections/HomeHowWeWork'
import HomeServices from '@/components/sections/HomeServices'
import HomeCTA from '@/components/sections/HomeCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <TechLandingHero />
      <HomeAbout />
      <HomeHowWeWork />
      <HomeServices />
      <HomeCTA />
      <Footer />
    </>
  )
}
